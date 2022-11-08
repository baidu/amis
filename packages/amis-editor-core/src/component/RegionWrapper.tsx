import {isAlive} from 'mobx-state-tree';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {EditorManager} from '../manager';
import {RegionConfig, RendererInfo} from '../plugin';
import {EditorStoreType} from '../store/editor';
import {EditorNodeContext, EditorNodeType} from '../store/node';

export interface RegionWrapperProps {
  name: string;
  label: string;
  placeholder?: string | JSX.Element;
  preferTag?: string;
  wrapperResolve?: (dom: HTMLElement) => HTMLElement;
  editorStore: EditorStoreType;
  manager: EditorManager;
  rendererName?: string;
  regionConfig: RegionConfig;
  node?: EditorNodeType; // 虚拟dom节点信息
  $$editor?: RendererInfo; // 当前节点信息（info）
}

/**
 * 1.DOM标记 添加 data-region、data-region-host 和 data-renderer 属性
 * 2.构建 Node store 节点。
 */
export class RegionWrapper extends React.Component<RegionWrapperProps> {
  static contextType = EditorNodeContext;
  parentNode: EditorNodeType;
  editorNode: EditorNodeType;

  UNSAFE_componentWillMount() {
    this.parentNode = this.context!;

    /**
     * 当前parent为空时尝试通过节点id获取当前上下文
     * 备注：非react容器类自定义组件需要
     */
    const {$$editor, manager} = this.props;
    if (!this.parentNode && $$editor && $$editor.id) {
      const curContext = manager.store.getNodeById($$editor.id);
      if (curContext) {
        this.parentNode = curContext;
      }
    }

    if (!this.parentNode) {
      return;
    }

    this.editorNode = this.parentNode.addChild({
      id: this.parentNode.id,
      type: this.parentNode.type,
      label: this.props.label,
      path: `${this.parentNode.path}/${this.props.name}`,
      region: this.props.name, // regions中的key值
      regionInfo: this.props.regionConfig,
      preferTag: this.props.preferTag
    });
  }

  componentDidMount() {
    this.editorNode &&
      this.markDom(
        this.editorNode.id,
        this.props.name,
        this.props.rendererName
      );
  }

  componentDidUpdate(prevProps: RegionWrapperProps) {
    this.editorNode &&
      this.markDom(
        this.editorNode.id,
        this.props.name,
        this.props.rendererName
      );
  }

  componentWillUnmount() {
    if (this.editorNode && isAlive(this.editorNode) && this.parentNode) {
      this.parentNode.removeChild(this.editorNode);
    }
  }

  /**
   * 弄点标记
   */
  markDom(id: string, region: string, rendererName?: string) {
    const dom = findDOMNode(this) as HTMLElement;

    if (!dom) {
      return;
    }
    const wrapperResolve = this.props.wrapperResolve;
    const wrapper = wrapperResolve ? wrapperResolve(dom) : dom.parentElement!;

    wrapper.setAttribute('data-region', region);
    wrapper.setAttribute('data-region-host', id);
    rendererName && wrapper.setAttribute('data-renderer', rendererName);
  }

  render() {
    return (
      <EditorNodeContext.Provider value={this.editorNode}>
        {this.props.children}
        <span className="ae-Region-placeholder">
          {this.props.placeholder || this.props.label}
        </span>
      </EditorNodeContext.Provider>
    );
  }
}

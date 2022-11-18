/**
 * @file 虚拟的渲染器，也就是说其实并不存在渲染器，而是弄个假的用来编辑。
 */
import {isAlive} from 'mobx-state-tree';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {RendererInfo} from '../plugin';
import {EditorNodeContext, EditorNodeType} from '../store/node';

export interface VRendererProps extends RendererInfo {
  path: string;
  data?: any;
  widthMutable?: boolean;
  children?: React.ReactNode;
}

export class VRenderer extends React.Component<VRendererProps> {
  static contextType = EditorNodeContext;
  editorNode: EditorNodeType;

  UNSAFE_componentWillMount() {
    const {data, path, widthMutable, ...info} = this.props;
    const parent: EditorNodeType = this.context;
    this.editorNode = parent.addChild({
      id: info.id,
      type: info.type,
      label: info.name,
      path: this.props.path,
      schemaPath: info.schemaPath,
      info: info,
      getData: () => this.props.data,
      widthMutable,
      memberIndex: info.memberIndex
    });
  }

  componentDidMount() {
    this.markDom(this.editorNode.id);
  }

  componentDidUpdate() {
    this.markDom(this.editorNode.id);
  }

  componentWillUnmount() {
    if (this.editorNode && isAlive(this.editorNode)) {
      const parent: EditorNodeType = this.context;
      parent.removeChild(this.editorNode);
    }
  }

  /**
   * 弄点标记
   */
  markDom(id: string) {
    const root = findDOMNode(this) as HTMLElement;

    if (!root) {
      return;
    }

    const info = this.editorNode.info!;
    let dom = info.wrapperResolve ? info.wrapperResolve(root) : root;
    (Array.isArray(dom) ? dom : dom ? [dom] : []).forEach(dom =>
      dom.setAttribute('data-editor-id', id)
    );
  }

  render() {
    return (
      <EditorNodeContext.Provider value={this.editorNode}>
        {this.props.children}
      </EditorNodeContext.Provider>
    );
  }
}

import {RendererProps} from 'amis-core';
import {observer} from 'mobx-react';
import {isAlive} from 'mobx-state-tree';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {RendererInfo} from '../plugin';
import {EditorNodeType} from '../store/node';
import {autobind} from '../util';

export interface NodeWrapperProps extends RendererProps {
  $$editor: RendererInfo; // 当前节点信息（info）
  $$node?: EditorNodeType; // 虚拟dom节点信息
}

@observer
export class NodeWrapper extends React.Component<NodeWrapperProps> {
  componentDidMount() {
    this.markDom(this.props.$$editor.id);

    // 稍微等会，因为有可能别的 node 还没更新完成。
    const node = this.props.$$node;
    node &&
      requestAnimationFrame(() => {
        () => isAlive(node) && node.calculateHighlightBox();
      });
  }

  componentDidUpdate(prevProps: NodeWrapperProps) {
    this.markDom(this.props.$$editor.id);
  }

  ref: any;
  getWrappedInstance() {
    return this.ref;
  }

  @autobind
  refFn(ref: any) {
    this.ref = ref;
  }

  /**
   * 弄点标记
   */
  markDom(id: string) {
    const root = findDOMNode(this) as HTMLElement;

    if (!root || !id) {
      return;
    }

    const info = this.props.$$editor;
    const visible =
      this.props.$$visible !== false && this.props.$$hidden !== true;
    let dom = info.wrapperResolve ? info.wrapperResolve(root) : root;
    (Array.isArray(dom) ? dom : dom ? [dom] : []).forEach(dom => {
      dom.setAttribute('data-editor-id', id);
      dom.setAttribute('data-visible', visible ? '' : 'false');
      dom.setAttribute('data-hide-text', visible ? '' : '<隐藏状态>');
    });
    info.plugin?.markDom?.(dom, this.props);
  }

  render() {
    // store 可能有循环引用，不能调用 JSONPipeOut
    let {$$editor, $$node, store, ...rest} = this.props;
    const renderer = $$editor.renderer;

    if ($$editor.filterProps) {
      rest = $$editor.filterProps.call($$editor.plugin, rest, $$node);
    }

    if ($$editor.renderRenderer) {
      return $$editor.renderRenderer.call(
        $$editor.plugin,
        {
          ...rest,
          store,
          ...$$node?.state,
          $$editor,
          ...$$editor.wrapperProps,
          ref: this.refFn
        },
        $$editor
      );
    }

    return (
      <renderer.component
        {...rest}
        store={store}
        {...$$node?.state}
        $$editor={$$editor}
        {...$$editor.wrapperProps}
        ref={this.refFn}
      />
    );
  }
}

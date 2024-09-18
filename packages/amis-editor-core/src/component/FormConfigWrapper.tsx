import {findDOMNode} from 'react-dom';
import {JSONPipeOut} from '../util';
import React from 'react';
import {NodeWrapper} from './NodeWrapper';

export class FormConfigWrapper extends NodeWrapper {
  // 销毁的时候要把加的 aeEditor-form-config 干掉
  componentWillUnmount() {
    const root = findDOMNode(this) as HTMLElement;

    if (!root) {
      return;
    }

    const info = this.props.$$editor;
    let dom = info.wrapperResolve ? info.wrapperResolve(root) : root;

    (Array.isArray(dom) ? dom : dom ? [dom] : []).forEach(dom => {
      dom.classList.remove('ae-Editor-form-config');
    });
  }

  markDom(id: string) {
    const root = findDOMNode(this) as HTMLElement;

    if (!root || !id) {
      return;
    }

    const info = this.props.$$editor;

    let dom = info.wrapperResolve ? info.wrapperResolve(root) : root;
    const schema = this.props.$$formSchema;
    schema &&
      (Array.isArray(dom) ? dom : dom ? [dom] : []).forEach(dom => {
        dom.setAttribute('data-editor-id', id);
        dom.classList.add('ae-Editor-form-config');
      });
  }

  render() {
    // store 都有可能有循环引用，不能调用 JSONPipeOut
    let {$$editor, $$node, $schema, store, ...rest} = this.props;
    const renderer = $$editor.renderer;

    rest = JSONPipeOut(rest, false);

    if ($$editor.filterProps) {
      rest = $$editor.filterProps.call($$editor.plugin, rest, $$node);
    }

    if ($$editor.renderRenderer) {
      return $$editor.renderRenderer.call(
        $$editor.plugin,
        {
          ...rest,
          store,
          $schema,
          $$editor,
          ...$$editor.wrapperProps,
          ref: this.refFn
        },
        $$editor
      );
    }
    const Component = renderer.component!;

    return (
      <Component
        {...rest}
        store={store}
        $schema={$schema}
        $$editor={$$editor}
        {...$$editor.wrapperProps}
        ref={this.refFn}
      />
    );
  }
}

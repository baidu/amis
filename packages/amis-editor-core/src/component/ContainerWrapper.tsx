import {NodeWrapper, NodeWrapperProps} from './NodeWrapper';
import React from 'react';
import {observer} from 'mobx-react';
import {autobind} from '../util';
import {Schema} from 'amis/lib/types';
import find from 'lodash/find';
import {RegionWrapper} from './RegionWrapper';

export interface ContainerWrapperProps extends NodeWrapperProps {}

@observer
export class ContainerWrapper extends React.Component<ContainerWrapperProps> {
  ref: any;
  getWrappedInstance() {
    return this.ref;
  }

  @autobind
  refFn(ref: any) {
    this.ref = ref;
  }

  /*
    由于基本上容器渲染器都是通过 this.props.render('region', subScheme) 来渲染孩子节点的。
    所以 ContainerWrapper 只要修改下发的 render 即可完成包裹。
   */
  @autobind
  renderChild(region: string, node: Schema, props: any) {
    const {render, $$editor, $$node} = this.props;

    const child = render(region, node, props);
    const config = find(
      $$editor.regions,
      item => item.key === region && !item.matchRegion && !item.renderMethod
    );

    if (config) {
      const Region = config.wrapper || RegionWrapper;

      return (
        <Region
          key={props?.key}
          preferTag={config.preferTag}
          name={config.key}
          label={config.label}
          placeholder={config.placeholder}
          regionConfig={config}
          editorStore={$$editor.plugin.manager.store}
          wrapperResolve={config.wrapperResolve}
          manager={$$editor.plugin.manager}
          children={child}
          rendererName={$$editor.renderer.name}
          $$editor={$$editor}
          node={$$node}
        />
      );
    }

    return child;
  }

  render() {
    const {$$editor, $$node, ...rest} = this.props;
    const props: any = {};
    const editorStore = $$editor.plugin.manager.store;

    if (
      $$editor.id &&
      (editorStore.isActive($$editor.id) ||
        editorStore.dropId === $$editor.id) &&
      Array.isArray($$editor.regions)
    ) {
      $$editor.regions.forEach(({key, optional}) => {
        if (optional) {
          return;
        } else if ($$node?.memberImmutable(key)) {
          return;
        }

        let defaultRegion: any[] = [];
        /** form表单的按钮组特殊处理
         * 原因：确保编辑态也显示默认的提交按钮
         */
        if (
          key === 'actions' &&
          (typeof rest.submitText === 'undefined' || rest.submitText)
        ) {
          defaultRegion = [
            {
              type: 'submit',
              label: rest.submitText || '提交',
              primary: true
            }
          ];
        }

        const region = Array.isArray(rest[key])
          ? rest[key].concat()
          : rest[key]
          ? [rest[key]]
          : defaultRegion;

        if (!region.length) {
          region.push({children: () => null});
        }

        props[key] = region;
      });
    }

    return (
      <NodeWrapper
        {...rest}
        {...props}
        $$editor={$$editor}
        $$node={$$node}
        render={this.renderChild}
        ref={this.refFn}
      />
    );
  }
}

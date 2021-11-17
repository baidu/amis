import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaCollection} from '../Schema';
import {resolveVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';
import mapValues from 'lodash/mapValues';

/**
 * WebComponent 容器渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/web-component
 */
export interface WebComponentSchema extends BaseSchema {
  /**
   * 指定为 web-component 类型
   */
  type: 'web-component';

  /**
   * 标签
   */
  tag: string;

  /**
   * 子节点
   */
  body: SchemaCollection;

  /**
   * 组件属性
   */
  prpos?: {
    [propName: string]: any;
  };
}

export default class WebComponent extends React.Component<RendererProps> {
  renderBody(): JSX.Element | null {
    const {body, render} = this.props;
    return body ? (render('body', body) as JSX.Element) : null;
  }

  render() {
    const {tag, props, data} = this.props;

    const propsValues = mapValues(props, s => {
      if (typeof s === 'string') {
        return resolveVariableAndFilter(s, data, '| raw') || s;
      } else {
        return s;
      }
    });
    const Component = (tag as keyof JSX.IntrinsicElements) || 'div';
    return <Component {...propsValues}>{this.renderBody()}</Component>;
  }
}

@Renderer({
  type: 'web-component'
})
export class WebComponentRenderer extends WebComponent {}

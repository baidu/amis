import React from 'react';
import {
  AMISSchemaBase,
  Renderer,
  RendererProps,
  AMISSchemaCollection
} from 'amis-core';
import {BaseSchema} from '../Schema';
import {resolveVariable, resolveVariableAndFilter} from 'amis-core';
import mapValues from 'lodash/mapValues';

/**
 * WebComponent 容器渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/web-component
 */
/**
 * Web 组件，用于集成自定义 WebComponent。支持属性与事件绑定。
 */
export interface AMISWebComponentSchema extends AMISSchemaBase {
  /**
   * 指定为 web-component 组件
   */
  type: 'web-component';

  /**
   * HTML 标签名
   */
  tag: string;

  /**
   * 子内容配置
   */
  body: AMISSchemaCollection;

  /**
   * 传递给 Web 组件的属性
   */
  props?: {
    [propName: string]: any;
  };
}

export default class WebComponent extends React.Component<RendererProps> {
  renderBody(): JSX.Element | null {
    const {body, render} = this.props;
    return body ? (render('body', body) as JSX.Element) : null;
  }

  render() {
    const {tag, props, data, style} = this.props;

    const propsValues = mapValues(props, s => {
      if (typeof s === 'string') {
        return resolveVariableAndFilter(s, data, '| raw') || s;
      } else {
        return s;
      }
    });
    const Component = (tag as keyof JSX.IntrinsicElements) || 'div';
    return (
      <Component {...propsValues} style={style}>
        {this.renderBody()}
      </Component>
    );
  }
}

@Renderer({
  type: 'web-component'
})
export class WebComponentRenderer extends WebComponent {}

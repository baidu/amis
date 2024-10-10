import {
  Renderer,
  RendererProps,
  SchemaClassName,
  getPropValue
} from 'amis-core';
import React from 'react';
import {
  BaseSchema,
  SchemaObject,
  SchemaCollection,
  SchemaIcon
} from '../Schema';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';

/**
 * 渲染数据里的 amis schema
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/amis
 */
export interface AIMSRenderSchema extends BaseSchema {
  /**
   * 指定类型
   */
  type: 'amis';

  /**
   * 类名
   */
  className?: SchemaClassName;
}

@Renderer({
  type: 'amis'
})
export class AMISRenderer extends React.Component<RendererProps> {
  render() {
    const {render, props, schema} = this.props;
    let value = getPropValue(this.props) || schema;
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.warn('amis value must be json string', e);
        value = null;
      }
    }

    return render('amis', value, props);
  }
}

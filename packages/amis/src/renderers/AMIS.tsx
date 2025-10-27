import {
  Renderer,
  RendererProps,
  AMISClassName,
  getPropValue,
  AMISSchemaBase,
  AMISVariableName,
  AMISSchemaCollection
} from 'amis-core';
import React from 'react';
import {BaseSchema, SchemaObject, SchemaIcon} from '../Schema';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';

/**
 * 渲染数据里的 amis schema
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/amis
 */
export interface AIMSAMISSchema extends AMISSchemaBase {
  /**
   * 指定为 amis 类型，用于嵌套渲染 AMIS 配置
   */
  type: 'amis';

  /**
   * 自定义 CSS 类名
   */
  className?: AMISClassName;

  /**
   * 组件名称，用于组件通信和数据绑定
   */
  name?: AMISVariableName;

  /**
   * AMIS Schema 配置，可以是对象或字符串形式的 JSON
   */
  value?: AMISSchemaCollection;
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

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
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/amis-render
 */
export interface AIMSRenderSchema extends BaseSchema {
  /**
   * 指定类型
   */
  type: 'amis-render';

  /**
   * 类名
   */
  className?: SchemaClassName;
}

@Renderer({
  type: 'amis-render'
})
export class AMISRenderer extends React.Component<RendererProps> {
  render() {
    const {render, props} = this.props;
    let value = getPropValue(this.props);
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.warn('amis-render value must be json string', e);
        value = null;
      }
    }

    return render('amis-render', value, props);
  }
}

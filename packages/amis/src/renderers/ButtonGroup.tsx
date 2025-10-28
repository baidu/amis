import React from 'react';
import ButtonGroup from './Form/ButtonGroupSelect';
import {
  AMISExpression,
  AMISLegacyActionSchema,
  AMISSchemaBase,
  Renderer,
  AMISButtonSchema
} from 'amis-core';
import {BaseSchema, AMISClassName, SchemaExpression} from '../Schema';
import {ActionSchema} from './Action';

/**
 * Button Group 渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/button-group
 */
export interface AMISButtonGroupSchemaBase extends AMISSchemaBase {
  /**
   * @deprecated 给 Button 配置 className。建议用btnLevel
   */
  btnClassName?: AMISClassName;

  /**
   * @deprecated 给选中态 Button 配置 className。建议用btnActiveLevel
   */
  btnActiveClassName?: string;

  /**
   * 按钮集合
   */
  buttons?: Array<AMISButtonSchema>;

  /**
   * 按钮样式级别
   */
  btnLevel?: string;

  /**
   * 按钮选中样式级别
   */
  btnActiveLevel?: string;

  /**
   * 是否垂直展示
   */
  vertical?: boolean;

  /**
   * 是否平铺展示
   */
  tiled?: boolean;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 禁用表达式
   */
  disabledOn?: AMISExpression;

  /**
   * 是否显示
   */
  visible?: boolean;

  /**
   * 显示表达式
   */
  visibleOn?: AMISExpression;
}

/**
 * 按钮组组件，将多个按钮组合展示。
 */
export interface AMISButtonGroupSchema extends AMISButtonGroupSchemaBase {
  /**
   * 指定为 button-group 组件
   */
  type: 'button-group';

  /**
   * 按钮大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default ButtonGroup;

@Renderer({
  type: 'button-group'
})
export class ButtonGroupRenderer extends ButtonGroup {}

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
   * 按钮选中的样式级别
   */
  btnActiveLevel?: string;

  /**
   * 垂直展示？
   */
  vertical?: boolean;

  /**
   * 平铺展示？
   */
  tiled?: boolean;

  /**
   * 是否为禁用状态。
   */
  disabled?: boolean;

  /**
   * 通过 JS 表达式来配置当前表单项的禁用状态。
   */
  disabledOn?: AMISExpression;

  /**
   * 是否显示
   */
  visible?: boolean;

  /**
   * 通过 JS 表达式来配置当前表单项是否显示
   */
  visibleOn?: AMISExpression;

  /**
   * 按钮大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export interface AMISButtonGroupSchema extends AMISButtonGroupSchemaBase {
  /**
   * 指定为提交按钮类型
   */
  type: 'button-group';
}

export default ButtonGroup;

@Renderer({
  type: 'button-group'
})
export class ButtonGroupRenderer extends ButtonGroup {}

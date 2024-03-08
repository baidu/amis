/**
 * @file Signature.tsx 签名组件
 *
 * @created: 2024/03/04
 */

import React from 'react';
import {
  IScopedContext,
  FormItem,
  FormControlProps,
  ScopedContext
} from 'amis-core';
import {Signature} from 'amis-ui';
import pick from 'lodash/pick';
import {FormBaseControlSchema} from '../../Schema';

export interface InputSignatureSchema extends FormBaseControlSchema {
  type: 'input-signature';
  /**
   * 组件宽度，默认占满父容器
   */
  width?: number;
  /**
   * 组件高度，默认占满父容器
   */
  height?: number;
  /**
   * 组件字段颜色
   * @default #000
   */
  color?: string;
  /**
   * 组件背景颜色
   * @default #efefef
   */
  bgColor?: string;
  /**
   * 清空按钮名称
   * @default 清空
   */
  clearBtnLabel?: string;
  /**
   * 撤销按钮名称
   * @default 撤销
   */
  undoBtnLabel?: string;
  /**
   * 确认按钮名称
   * @default 确认
   */
  confirmBtnLabel?: string;

  /**
   * 是否内嵌
   */
  embed?: boolean;

  /**
   * 弹窗确认按钮名称
   */
  embedConfirmLabel?: string;
  /**
   * 弹窗取消按钮名称
   */
  ebmedCancelLabel?: string;
  /**
   * 弹窗按钮图标
   */
  embedBtnIcon?: string;
  /**
   * 弹窗按钮文案
   */
  embedBtnLabel?: string;
}

export interface IInputSignatureProps extends FormControlProps {}

interface IInputSignatureState {
  loading: boolean;
}

export default class InputSignatureComp extends React.Component<
  IInputSignatureProps,
  IInputSignatureState
> {
  render() {
    const {classnames: cx, className, onChange} = this.props;
    const props = pick(this.props, [
      'value',
      'width',
      'height',
      'mobileUI',
      'embed',
      'color',
      'bgColor',
      'clearBtnLabel',
      'undoBtnLabel',
      'confirmBtnLabel',
      'embedConfirmLabel',
      'ebmedCancelLabel',
      'embedBtnIcon',
      'embedBtnLabel'
    ]);

    return (
      <Signature
        classnames={cx}
        className={className}
        onChange={onChange}
        {...props}
      />
    );
  }
}

@FormItem({
  type: 'input-signature',
  sizeMutable: false
})
export class InputSignatureRenderer extends InputSignatureComp {
  static contextType = ScopedContext;

  constructor(props: IInputSignatureProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount?.();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }
}

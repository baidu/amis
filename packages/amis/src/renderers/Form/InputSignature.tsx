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
  ScopedContext,
  normalizeApi,
  createObject,
  Payload,
  autobind
} from 'amis-core';
import {Signature} from 'amis-ui';
import pick from 'lodash/pick';
import {FormBaseControlSchema, SchemaApi} from '../../Schema';
import {base64ToBlob} from 'file64';
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
   * 清空按钮图标
   * @default 清空
   */
  clearBtnIcon?: string;
  /**
   * 撤销按钮名称
   * @default 撤销
   */
  undoBtnLabel?: string;
  /**
   * 清空按钮图标
   * @default 清空
   */
  undoBtnIcon?: string;
  /**
   * 确认按钮名称
   * @default 确认
   */
  confirmBtnLabel?: string;
  /**
   * 确认按钮图标
   * @default 确认
   */
  confirmBtnIcon?: string;
  /**
   * 是否内嵌
   */
  embed?: boolean;

  /**
   * 弹窗确认按钮名称
   */
  embedConfirmLabel?: string;
  /**
   * 弹窗确认按钮图标
   */
  embedConfirmIcon?: string;
  /**
   * 弹窗取消按钮名称
   */
  ebmedCancelLabel?: string;
  /**
   * 弹窗取消按钮图标
   */
  ebmedCancelIcon?: string;
  /**
   * 弹窗按钮图标
   */
  embedBtnIcon?: string;
  /**
   * 弹窗按钮文案
   */
  embedBtnLabel?: string;
  /**
   *  上传签名图片api, 仅在内嵌模式下生效
   */
  uploadApi?: SchemaApi;
}

export interface IInputSignatureProps extends FormControlProps {}

interface IInputSignatureState {
  loading: boolean;
}

export default class InputSignatureComp extends React.Component<
  IInputSignatureProps,
  IInputSignatureState
> {
  @autobind
  async uploadFile(file: string, uploadApi: string): Promise<Payload> {
    const api = normalizeApi(uploadApi, 'post');
    if (!api.data) {
      const fd = new FormData();
      const fileBlob = await base64ToBlob(file);
      fd.append('file', fileBlob, 'signature.png');
      api.data = fd;
    }

    return this.props.env!.fetcher(
      api,
      createObject(this.props.data, {
        file
      })
    );
  }

  @autobind
  async handleChange(val: any) {
    const {translate: __, uploadApi, embed, onChange} = this.props;
    // 非内嵌模式 没有上传api 或是清空直接onChange
    if (!embed || !uploadApi || val === undefined) {
      onChange?.(val);
      return;
    }

    try {
      // 用api进行上传，上传结果回传表单数据
      const res = await this.uploadFile(val, uploadApi as string);
      if (!res.ok || (res.status && (res as any).status !== '0') || !res.data) {
        throw new Error(res.msg || __('File.errorRetry'));
      }
      const value =
        (res.data as any).value || (res.data as any).url || res.data;
      onChange?.(value);
    } catch (error) {
      // 失败清空签名组件内的数据，传空字符串会重新触发amis的渲染，underfined不会被重新渲染（连续的空字符串不会被重新渲染，amis底层会对value值进行diff对比）
      onChange?.('');
      this.props.env?.alert?.(error.message || __('File.errorRetry'));
    }
  }

  render() {
    const {classnames: cx, className} = this.props;
    const props = pick(this.props, [
      'value',
      'width',
      'height',
      'mobileUI',
      'embed',
      'color',
      'bgColor',
      'clearBtnLabel',
      'clearBtnIcon',
      'undoBtnLabel',
      'undoBtnIcon',
      'confirmBtnLabel',
      'confirmBtnIcon',
      'embedConfirmLabel',
      'embedConfirmIcon',
      'ebmedCancelLabel',
      'ebmedCancelIcon',
      'embedBtnIcon',
      'embedBtnLabel',
      'uploadApi'
    ]);

    return (
      <Signature
        classnames={cx}
        className={className}
        onChange={this.handleChange}
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

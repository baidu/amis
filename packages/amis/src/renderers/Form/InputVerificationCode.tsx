import React from 'react';
import {
  autobind,
  FormControlProps,
  FormItem,
  resolveVariableAndFilter
} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';
import {VerificationCode} from 'amis-ui';

export interface VerificationCodeSchema extends FormBaseControlSchema {
  value?: string;
  length?: number;
  /**
   * is密码模式
   */
  masked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /**
   * 分隔符
   */
  separator?: string; // 支持表达式
}

export interface VerificationCodeProps extends FormControlProps {
  //
}

export default class VerificationCodeControl extends React.Component<VerificationCodeProps> {
  /**
   * actions finish
   * @date 2024-06-04 星期二
   * @function
   * @param {}
   * @return {}
   */
  @autobind
  async onFinish(value: string) {
    const {dispatchEvent, data} = this.props;

    const rendererEvent = await dispatchEvent(
      'finish',
      {
        ...data,
        value
      },
      this
    );

    if (rendererEvent?.prevented) {
      return;
    }
  }

  /**
   * actions change
   * @date 2024-06-04 星期二
   * @function
   * @param {}
   * @return {}
   */
  @autobind
  async onChange(value: string) {
    const {onChange, data, dispatchEvent} = this.props;

    const rendererEvent = await dispatchEvent('change', {
      ...data,
      value
    });
    if (rendererEvent?.prevented) {
      return;
    }

    onChange?.(value);
  }

  render() {
    const {separator} = this.props;

    return (
      <VerificationCode
        {...this.props}
        separator={
          typeof separator === 'string'
            ? (data: {index: number; character: string}) =>
                resolveVariableAndFilter(separator, data)
            : () => {}
        }
        onFinish={this.onFinish}
        onChange={this.onChange}
      ></VerificationCode>
    );
  }
}

@FormItem({
  type: 'input-verification-code'
})
export class VerificationCodeControlRenderer extends VerificationCodeControl {
  //
}

import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from 'amis-core';

import {Textarea} from 'amis-ui';

import {autobind, ucFirst} from 'amis-core';

import {bindRendererEvent} from 'amis-core';
import type {ListenerAction} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';

/**
 * TextArea 多行文本输入框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/textarea
 */
export interface TextareaControlSchema extends FormBaseControlSchema {
  /**
   * 指定为多行文本输入框
   */
  type: 'textarea';

  /**
   * 最大行数
   */
  maxRows?: number;

  /**
   * 最小行数
   */
  minRows?: number;

  /**
   * 是否只读
   */
  readOnly?: boolean;

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 限制文字个数
   */
  maxLength?: number;

  /**
   * 是否显示计数
   */
  showCounter?: boolean;

  /**
   * 输入内容是否可清除
   */
  clearable?: boolean;

  /**
   * 重置值
   */
  resetValue?: string;
}

export type TextAreaRendererEvent = 'blur' | 'focus';

export interface TextAreaProps extends FormControlProps {
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  clearable?: boolean;
  resetValue?: string;
}

export interface TextAreaState {
  focused: boolean;
}

export default class TextAreaControl extends React.Component<
  TextAreaProps,
  TextAreaState
> {
  static defaultProps: Partial<TextAreaProps> = {
    minRows: 3,
    maxRows: 20,
    trimContents: true,
    resetValue: '',
    clearable: false
  };

  inputRef = React.createRef<any>();

  doAction(action: ListenerAction, args: any) {
    const actionType = action?.actionType as string;
    const onChange = this.props.onChange;

    if (!!~['clear', 'reset'].indexOf(actionType)) {
      onChange?.(this.props.resetValue);
      this.focus();
    } else if (actionType === 'focus') {
      this.focus();
    }
  }

  focus() {
    this.inputRef.current?.focus();
  }

  @autobind
  @bindRendererEvent<TextAreaProps, TextAreaRendererEvent>('change')
  handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const {onChange} = this.props;
    onChange && onChange(e);
  }

  @autobind
  @bindRendererEvent<TextAreaProps, TextAreaRendererEvent>('focus')
  handleFocus(e: React.FocusEvent<HTMLTextAreaElement>) {
    const {onFocus} = this.props;

    this.setState(
      {
        focused: true
      },
      () => {
        onFocus && onFocus(e);
      }
    );
  }

  @autobind
  @bindRendererEvent<TextAreaProps, TextAreaRendererEvent>('blur')
  handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    const {onBlur, trimContents, value, onChange} = this.props;

    this.setState(
      {
        focused: false
      },
      () => {
        if (trimContents && value && typeof value === 'string') {
          onChange(value.trim());
        }

        onBlur && onBlur(e);
      }
    );
  }

  render() {
    const {...rest} = this.props;

    return (
      <Textarea {...rest} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} />
    );
  }
}

@FormItem({
  type: 'textarea'
})
export class TextAreaControlRenderer extends TextAreaControl {}

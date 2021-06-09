import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import Textarea from '../../components/Textarea';
import {findDOMNode} from 'react-dom';
import {autobind} from '../../utils/helper';
/**
 * TextArea 多行文本输入框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/textarea
 */
export interface TextareaControlSchema extends FormBaseControl {
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
}

export interface TextAreaProps extends FormControlProps {
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
}

export default class TextAreaControl extends React.Component<
  TextAreaProps,
  any
> {
  static defaultProps: Partial<TextAreaProps> = {
    minRows: 3,
    maxRows: 20,
    trimContents: true
  };

  input?: HTMLInputElement;
  inputRef = (ref: any) => (this.input = findDOMNode(ref) as HTMLInputElement);

  focus() {
    if (!this.input) {
      return;
    }

    this.input.focus();

    // 光标放到最后
    const len = this.input.value.length;
    len && this.input.setSelectionRange(len, len);
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange} = this.props;

    let value = e.currentTarget.value;

    onChange(value);
  }

  @autobind
  handleFocus(e: React.FocusEvent<HTMLTextAreaElement>) {
    const {onFocus} = this.props;

    onFocus && onFocus(e);
  }

  @autobind
  handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    const {onBlur, trimContents, value, onChange} = this.props;

    if (trimContents && value && typeof value === 'string') {
      onChange(value.trim());
    }

    onBlur && onBlur(e);
  }

  render() {
    const {
      className,
      classPrefix: ns,
      value,
      type,
      placeholder,
      disabled,
      minRows,
      maxRows,
      readOnly,
      name
    } = this.props;
    return (
      <Textarea
        autoComplete="off"
        ref={this.inputRef}
        name={name}
        disabled={disabled}
        type={type}
        className={cx(`${ns}TextareaControl`, className)}
        value={
          typeof value === 'undefined' || value === null
            ? ''
            : typeof value === 'string'
            ? value
            : JSON.stringify(value)
        }
        placeholder={placeholder}
        autoCorrect="off"
        spellCheck="false"
        readOnly={readOnly}
        minRows={minRows || undefined}
        maxRows={maxRows || undefined}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    );
  }
}

@FormItem({
  type: 'textarea'
})
export class TextAreaControlRenderer extends TextAreaControl {}

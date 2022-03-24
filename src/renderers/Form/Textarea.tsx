import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import Textarea from '../../components/Textarea';
import {Icon} from '../../components/icons';
import {findDOMNode} from 'react-dom';
import {autobind, ucFirst} from '../../utils/helper';

import {bindRendererEvent} from '../../actions/Decorators';
import type {ListenerAction} from '../../actions/Action';

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

export type TextAreaRendererEvent = 'blur' | 'focus' | 'clear';

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

  state = {
    focused: false
  };

  input?: HTMLInputElement;
  inputRef = (ref: any) => (this.input = findDOMNode(ref) as HTMLInputElement);

  doAction(action: ListenerAction, args: any) {
    const actionType = action?.actionType as string;

    if (!!~['clear', 'reset'].indexOf(actionType)) {
      this.handleClear();
    } else if (actionType === 'focus') {
      this.focus();
    }
  }

  valueToString(value: any) {
    return typeof value === 'undefined' || value === null
      ? ''
      : typeof value === 'string'
      ? value
      : JSON.stringify(value);
  }

  focus() {
    if (!this.input) {
      return;
    }

    this.setState(
      {
        focused: true
      },
      () => {
        if (!this.input) {
          return;
        }

        this.input.focus();

        // 光标放到最后
        const len = this.input.value.length;
        len && this.input.setSelectionRange(len, len);
      }
    );
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const {onChange} = this.props;
    let value = e.currentTarget.value;

    onChange?.(value);
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

  @autobind
  @bindRendererEvent<TextAreaProps, TextAreaRendererEvent>('clear')
  async handleClear() {
    const {onChange, resetValue} = this.props;

    onChange?.(resetValue);
    this.focus();
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
      name,
      borderMode,
      classnames: cx,
      maxLength,
      showCounter,
      clearable
    } = this.props;
    const counter = showCounter ? this.valueToString(value).length : 0;

    return (
      <div
        className={cx(
          `TextareaControl`,
          {
            [`TextareaControl--border${ucFirst(borderMode)}`]: borderMode,
            'is-focused': this.state.focused,
            'is-disabled': disabled
          },
          className
        )}
      >
        <Textarea
          className={cx(`TextareaControl-input`)}
          autoComplete="off"
          ref={this.inputRef}
          name={name}
          disabled={disabled}
          value={this.valueToString(value)}
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

        {clearable && !disabled && value ? (
          <a onClick={this.handleClear} className={cx('TextareaControl-clear')}>
            <Icon icon="input-clear" className="icon" />
          </a>
        ) : null}

        {showCounter ? (
          <span
            className={cx('TextareaControl-counter', {
              'is-empty': counter === 0,
              'is-clearable': clearable && !disabled && value
            })}
          >
            {`${counter}${
              typeof maxLength === 'number' && maxLength ? `/${maxLength}` : ''
            }`}
          </span>
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'textarea'
})
export class TextAreaControlRenderer extends TextAreaControl {}

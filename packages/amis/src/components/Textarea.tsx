import React from 'react';
import {findDOMNode} from 'react-dom';
import BaseTextArea from 'react-textarea-autosize';
import {localeable, LocaleProps} from '../locale';
import {themeable, ThemeProps} from '../theme';
import {autobind, ucFirst} from '../utils/helper';
import {Icon} from './icons';

export interface TextAreaProps extends ThemeProps, LocaleProps {
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

  trimContents?: boolean;

  value?: any;
  onChange?: (value: any) => void;

  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;

  placeholder?: string;
  name?: string;
  disabled?: boolean;
}

export interface TextAreaState {
  focused: boolean;
}

export class Textarea extends React.Component<TextAreaProps, TextAreaState> {
  static defaultProps = {
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
  handleFocus(e: React.FocusEvent<HTMLTextAreaElement>) {
    const {onFocus} = this.props;

    this.setState(
      {
        focused: true
      },
      () => {
        onFocus?.(e);
      }
    );
  }

  @autobind
  handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    const {onBlur, trimContents, value, onChange} = this.props;

    this.setState(
      {
        focused: false
      },
      () => {
        if (trimContents && value && typeof value === 'string') {
          onChange?.(value.trim());
        }

        onBlur && onBlur(e);
      }
    );
  }

  @autobind
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
        <BaseTextArea
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

export default themeable(localeable(Textarea));

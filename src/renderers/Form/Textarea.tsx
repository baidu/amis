import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import Textarea from '../../components/Textarea';
import {findDOMNode} from 'react-dom';
import {autobind, ucFirst} from '../../utils/helper';
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
}

export interface TextAreaProps extends FormControlProps {
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
}

export default class TextAreaControl extends React.Component<
  TextAreaProps,
  {focused: boolean}
> {
  static defaultProps: Partial<TextAreaProps> = {
    minRows: 3,
    maxRows: 20,
    trimContents: true
  };

  state = {
    focused: false
  };

  input?: HTMLInputElement;
  inputRef = (ref: any) => (this.input = findDOMNode(ref) as HTMLInputElement);

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
  handleChange(e: React.ChangeEvent<any>) {
    const {onChange} = this.props;

    let value = e.currentTarget.value;

    onChange(value);
  }

  @autobind
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
      showCounter
    } = this.props;

    let counter = showCounter
      ? (typeof value === 'undefined' || value === null
          ? ''
          : typeof value === 'string'
          ? value
          : JSON.stringify(value)
        ).length
      : 0;

    return (
      <div
        className={cx(
          `TextareaControl`,
          {
            [`TextareaControl--border${ucFirst(borderMode)}`]: borderMode,
            'is-focused': this.state.focused
          },
          className
        )}
      >
        <Textarea
          autoComplete="off"
          ref={this.inputRef}
          name={name}
          disabled={disabled}
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

        {showCounter ? (
          <span
            className={cx(
              'TextareaControl-counter',
              counter === 0 ? 'is-empty' : ''
            )}
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

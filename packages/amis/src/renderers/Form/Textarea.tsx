import React from 'react';
import {
  FormItem,
  FormControlProps,
  resolveEventData,
  autobind,
  getVariable,
  CustomStyle,
  setThemeClassName
} from 'amis-core';
import {Textarea} from 'amis-ui';
import type {AMISFormItem, ListenerAction} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
import cx from 'classnames';

/**
 * TextArea 多行文本输入框。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/textarea
 */
/**
 * TextArea 多行文本输入框组件，支持最大/最小行数、只读、边框模式、最大长度、字符统计和清除等功能。
 */
export interface AMISTextareaSchema extends AMISFormItem {
  /**
   * 指定为 textarea 组件
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
   * 边框模式
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 最大长度
   */
  maxLength?: number;

  /**
   * 是否显示字符计数
   */
  showCounter?: boolean;

  /**
   * 是否显示清除按钮
   */
  clearable?: boolean;

  /**
   * 重置时的默认值
   */
  resetValue?: string;
}

export type TextAreaRendererEvent = 'blur' | 'focus' | 'change';

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

  doAction(
    action: ListenerAction,
    data: any,
    throwErrors: boolean = false,
    args?: any
  ) {
    const actionType = action?.actionType as string;
    const {onChange, formStore, store, name, resetValue} = this.props;

    if (actionType === 'clear') {
      onChange?.('');
      this.focus();
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      onChange?.(pristineVal);
      this.focus();
    } else if (actionType === 'focus') {
      this.focus();
    }
  }

  focus() {
    this.inputRef.current?.focus();
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const {onChange, dispatchEvent} = this.props;

    dispatchEvent('change', resolveEventData(this.props, {value: e}));

    onChange && onChange(e);
  }

  @autobind
  handleFocus(e: React.FocusEvent<HTMLTextAreaElement>) {
    const {onFocus, dispatchEvent, value} = this.props;

    this.setState(
      {
        focused: true
      },
      async () => {
        const rendererEvent = await dispatchEvent(
          'focus',
          resolveEventData(this.props, {value})
        );

        if (rendererEvent?.prevented) {
          return;
        }
        onFocus && onFocus(e);
      }
    );
  }

  @autobind
  handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    const {onBlur, trimContents, value, onChange, dispatchEvent} = this.props;

    this.setState(
      {
        focused: false
      },
      async () => {
        if (trimContents && value && typeof value === 'string') {
          onChange(value.trim());
        }

        const rendererEvent = await dispatchEvent(
          'blur',
          resolveEventData(this.props, {value})
        );

        if (rendererEvent?.prevented) {
          return;
        }

        onBlur && onBlur(e);
      }
    );
  }

  renderStatic(displayValue = '-') {
    const {render, staticSchema = {}} = this.props;

    return render(
      'static-textarea',
      {
        type: 'multiline-text',
        maxRows: staticSchema.limit || 5,
        ...staticSchema
      },
      {
        value: displayValue
      }
    );
  }

  @supportStatic()
  render() {
    const {...rest} = this.props;
    const {id, themeCss, env, className, classPrefix: ns} = this.props;
    return (
      <>
        <Textarea
          {...rest}
          forwardRef={this.inputRef}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          className={cx(
            className,
            setThemeClassName({
              ...this.props,
              name: 'inputControlClassName',
              id,
              themeCss: themeCss
            })
          )}
        />
        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss,
            classNames: [
              {
                key: 'inputControlClassName',
                weights: {
                  default: {
                    inner: `.${ns}TextareaControl-input`
                  },
                  hover: {
                    inner: `.${ns}TextareaControl-input`
                  },
                  focused: {
                    suf: '.is-focused',
                    inner: `.${ns}TextareaControl-input`
                  },
                  disabled: {
                    suf: '.is-disabled',
                    inner: `.${ns}TextareaControl-input`
                  }
                }
              }
            ],
            id: id
          }}
          env={env}
        />
      </>
    );
  }
}

@FormItem({
  type: 'textarea'
})
export class TextAreaControlRenderer extends TextAreaControl {}

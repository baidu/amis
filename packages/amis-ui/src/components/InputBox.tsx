import React from 'react';
import {TestIdBuilder, ThemeProps, themeable} from 'amis-core';
import Input from './Input';
import {autobind, ucFirst} from 'amis-core';
import {Icon} from './icons';

export interface InputBoxProps
  extends ThemeProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'style' | 'prefix' | 'onChange' | 'translate' | 'size'
    > {
  value?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onClear?: (e: React.MouseEvent<any>) => void;
  clearable?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
  prefix?: JSX.Element;
  children?: React.ReactNode | Array<React.ReactNode>;
  borderMode?: 'full' | 'half' | 'none';
  testIdBuilder?: TestIdBuilder;
  inputRender?: (props: any, ref?: any) => JSX.Element;
  dataName?: string;
}

export interface InputBoxState {
  isFocused: boolean;
}

export class InputBox extends React.Component<InputBoxProps, InputBoxState> {
  static defaultProps = {
    clearable: true,
    placeholder: ''
  };

  state = {
    isFocused: false
  };

  @autobind
  clearValue(e: any) {
    e.preventDefault();
    e.stopPropagation();

    const onClear = this.props.onClear;
    const onChange = this.props.onChange;
    onClear?.(e);
    onChange?.('');
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const onChange = this.props.onChange;
    onChange && onChange(e.currentTarget ? e.currentTarget.value : (e as any));
  }

  @autobind
  handleFocus(e: any) {
    const onFocus = this.props.onFocus;
    onFocus && onFocus(e);
    this.setState({
      isFocused: true
    });
  }

  @autobind
  handleBlur(e: any) {
    const onBlur = this.props.onBlur;
    onBlur && onBlur(e);
    this.setState({
      isFocused: false
    });
  }

  render() {
    const {
      className,
      classnames: cx,
      classPrefix,
      clearable,
      disabled,
      hasError,
      value,
      placeholder,
      prefix: result,
      children,
      borderMode,
      onClick,
      mobileUI,
      testIdBuilder,
      inputRender,
      dataName,
      ...rest
    } = this.props;
    const isFocused = this.state.isFocused;

    return (
      <div
        className={cx('InputBox', className, {
          'is-mobile': mobileUI,
          'is-focused': isFocused,
          'is-disabled': disabled,
          'is-error': hasError,
          'is-clickable': onClick,
          [`InputBox--border${ucFirst(borderMode)}`]: borderMode
        })}
        onClick={onClick}
        data-amis-name={dataName}
      >
        {result}

        {typeof inputRender === 'function' ? (
          inputRender({
            ...rest,
            value: value ?? '',
            onChange: this.handleChange as any,
            placeholder,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
            disabled,
            ...testIdBuilder?.getTestId()
          })
        ) : (
          <Input
            {...rest}
            value={value ?? ''}
            onChange={this.handleChange}
            placeholder={placeholder}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            size={12}
            disabled={disabled}
            {...testIdBuilder?.getTestId()}
          />
        )}

        {clearable && !disabled && value ? (
          <a onClick={this.clearValue} className={cx('InputBox-clear')}>
            <Icon icon="input-clear" className="icon" />
          </a>
        ) : null}

        {children}
      </div>
    );
  }
}

export default themeable(InputBox);

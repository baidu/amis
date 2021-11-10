import React from 'react';
import {ThemeProps, themeable} from '../theme';
import Input from './Input';
import {autobind} from '../utils/helper';
import {Icon} from './icons';

export interface InputBoxProps
  extends ThemeProps,
    Omit<React.DOMAttributes<HTMLInputElement>, 'prefix' | 'onChange'> {
  value?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onClear?: (e: React.MouseEvent<any>) => void;
  clearable?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
  prefix?: JSX.Element;
  children?: JSX.Element;
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

    const onClear = this.props.onClear;
    const onChange = this.props.onChange;
    onClear?.(e);
    onChange?.('');
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const onChange = this.props.onChange;
    onChange && onChange(e.currentTarget.value);
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
      ...rest
    } = this.props;
    const isFocused = this.state.isFocused;

    return (
      <div
        className={cx(
          'InputBox',
          className,
          isFocused ? 'is-focused' : '',
          disabled ? 'is-disabled' : '',
          hasError ? 'is-error' : '',
          rest.onClick ? 'is-clickable' : ''
        )}
      >
        {result}

        <Input
          {...rest}
          value={value || ''}
          onChange={this.handleChange}
          placeholder={placeholder}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          size={12}
        />

        {children}

        {clearable && !disabled && value ? (
          <a onClick={this.clearValue} className={cx('InputBox-clear')}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}
      </div>
    );
  }
}

export default themeable(InputBox);

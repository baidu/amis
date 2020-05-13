import React from 'react';
import {ThemeProps, themeable} from '../theme';
import uncontrollable from 'uncontrollable';
import Input from './Input';
import {autobind} from '../utils/helper';
import {Icon} from './icons';

export interface InputBoxProps
  extends ThemeProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  clearable?: boolean;
  disabled?: boolean;
  placeholder?: string;
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
  clearValue() {
    const onChange = this.props.onChange;
    onChange && onChange('');
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
      value,
      placeholder,
      children,
      ...rest
    } = this.props;
    const isFocused = this.state.isFocused;

    return (
      <div className={cx('InputBox', className, isFocused ? 'is-focused' : '')}>
        <Input
          {...rest}
          value={value || ''}
          onChange={this.handleChange}
          placeholder={placeholder}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        {clearable && !disabled && value ? (
          <a onClick={this.clearValue} className={cx('InputBox-clear')}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}

        {children}
      </div>
    );
  }
}

export default themeable(
  uncontrollable(InputBox, {
    value: 'onChange'
  })
);

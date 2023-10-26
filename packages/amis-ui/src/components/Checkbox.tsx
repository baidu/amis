/**
 * @file Checkbox
 * @author fex
 */

import React from 'react';
import {ThemeProps, themeable} from 'amis-core';
import {autobind} from 'amis-core';

const preventEvent = (e: any) => e.stopPropagation();

interface CheckboxProps extends ThemeProps {
  type: 'checkbox' | 'radio';
  size?: 'sm' | 'lg' | 'small' | 'large';
  label?: string;
  labelClassName?: string;
  className?: string;
  onChange?: (value: any, shift?: boolean) => void;
  value?: boolean | string | number;
  inline?: boolean;
  trueValue?: boolean | string | number;
  falseValue?: boolean | string | number;
  disabled?: boolean;
  readOnly?: boolean;
  checked?: boolean;
  name?: string;
  description?: string;
  partial?: boolean;
  optionType?: 'default' | 'button';
  children?: React.ReactNode | Array<React.ReactNode>;
}

export class Checkbox extends React.Component<CheckboxProps, any> {
  static defaultProps: Pick<
    CheckboxProps,
    'trueValue' | 'falseValue' | 'type'
  > = {
    trueValue: true,
    falseValue: false,
    type: 'checkbox'
  };

  @autobind
  handleCheck(e: React.ChangeEvent<any>) {
    const {trueValue, falseValue, onChange} = this.props;

    if (!onChange) {
      return;
    }

    onChange(
      e.currentTarget.checked ? trueValue : falseValue,
      (e.nativeEvent as MouseEvent).shiftKey
    );
  }

  render() {
    let {
      size,
      className,
      classnames: cx,
      value,
      label,
      partial,
      trueValue,
      children,
      disabled,
      description,
      readOnly,
      checked,
      type,
      name,
      labelClassName,
      optionType,
      mobileUI
    } = this.props;
    const _checked =
      typeof checked !== 'undefined'
        ? checked
        : typeof value === 'undefined'
        ? value
        : value == trueValue;

    return (
      <label
        className={cx(`Checkbox Checkbox--${type}`, className, {
          'Checkbox--full': !partial,
          // 'Checkbox--partial': partial
          [`Checkbox--${size}`]: size,
          'Checkbox--button': optionType === 'button',
          'Checkbox--button--checked': optionType === 'button' && _checked,
          'Checkbox--button--disabled--unchecked':
            optionType === 'button' && disabled && !_checked,
          'Checkbox--button--disabled--checked':
            optionType === 'button' && disabled && _checked,
          'is-mobile': mobileUI
        })}
        data-role="checkbox"
      >
        <input
          type={type}
          checked={
            typeof checked !== 'undefined'
              ? checked
              : typeof value === 'undefined'
              ? value
              : value == trueValue
          }
          onChange={this.handleCheck}
          onClick={
            preventEvent // 当点击 i 的时候，这个地方也会触发 click，很奇怪，干脆禁掉
          }
          disabled={disabled}
          readOnly={readOnly}
          name={name}
        />
        <i />
        <span className={cx(labelClassName)}>{children || label}</span>
        {description ? (
          <div className={cx('Checkbox-desc')}>{description}</div>
        ) : null}
      </label>
    );
  }
}

export default themeable(Checkbox);

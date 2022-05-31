/**
 * @file Switch
 * @description
 * @author fex
 */

import React from 'react';
import {ClassNamesFn, themeable} from 'amis-core';
import {classPrefix, classnames} from '../themes/default';

const sizeMap = {
  md: 'i-switch-md',
  lg: 'i-switch-lg',
  middle: 'i-switch-md',
  large: 'i-switch-lg'
};

const levelMap = {
  info: 'bg-info',
  primary: 'bg-primary',
  danger: 'bg-danger'
};

interface SwitchProps {
  id?: string;
  size?: 'md' | 'lg' | 'middle' | 'large';
  level?: 'info' | 'primary' | 'danger';
  className?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  onChange?: (checked: boolean | string | number) => void;
  value?: boolean | string | number;
  inline?: boolean;
  trueValue?: boolean | string | number;
  falseValue?: boolean | string | number;
  disabled?: boolean;
  readOnly?: boolean;
  onText?: React.ReactNode;
  offText?: React.ReactNode;
  checked?: boolean;
}

export class Switch extends React.PureComponent<SwitchProps, any> {
  static defaultProps = {
    trueValue: true,
    falseValue: false
  };

  constructor(props: SwitchProps) {
    super(props);

    this.hanldeCheck = this.hanldeCheck.bind(this);
  }

  hanldeCheck(e: React.ChangeEvent<HTMLInputElement>) {
    const {trueValue, falseValue, onChange} = this.props;

    if (!onChange) {
      return;
    }

    onChange(e.currentTarget.checked ? trueValue! : falseValue!);
  }

  render() {
    let {
      size,
      level,
      className,
      classPrefix,
      onChange,
      value,
      inline,
      trueValue,
      falseValue,
      onText = '',
      offText = '',
      disabled,
      readOnly,
      checked,
      classnames: cx,
      ...rest
    } = this.props;

    className =
      (className ? className : '') +
      (size && sizeMap[size] ? ` ${sizeMap[size]}` : '') +
      (level && levelMap[level] ? ` ${levelMap[level]}` : '');

    const isChecked =
      typeof checked !== 'undefined'
        ? checked
        : typeof value === 'undefined'
        ? false
        : value == trueValue;

    return (
      <label
        className={cx(
          `Switch`,
          isChecked ? 'is-checked' : '',
          disabled ? 'is-disabled' : '',
          className
        )}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={this.hanldeCheck}
          disabled={disabled}
          readOnly={readOnly}
          {...rest}
        />

        <span className="text">{isChecked ? onText : offText}</span>
        <span className="slider"></span>
      </label>
    );
  }
}

export default themeable(Switch);

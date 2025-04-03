/**
 * @file Checkbox
 * @author fex
 */

import React from 'react';
import {TestIdBuilder, ThemeProps, themeable} from 'amis-core';
import {autobind} from 'amis-core';
import Icon from './icons';

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
  testIdBuilder?: TestIdBuilder;
  dataName?: string;
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
  labelRef: React.RefObject<HTMLLabelElement> = React.createRef();
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

  @autobind
  setClassName(className: string) {
    this.setState({
      className
    });
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
      optionType = 'default',
      mobileUI,
      testIdBuilder
    } = this.props;
    const {className: stateClassName} = this.state || {};
    const _checked =
      typeof checked !== 'undefined'
        ? checked
        : typeof value === 'undefined'
        ? value
        : value == trueValue;

    return (
      <label
        className={cx(
          'Checkbox',
          `Checkbox--${type}--${optionType}`,
          className,
          stateClassName,
          {
            'Checkbox--partial': partial,
            [`Checkbox--${size}`]: size,
            'is-mobile': mobileUI,
            'disabled': disabled,
            'checked': _checked,
            [`Checkbox--${type}--${optionType}--checked`]:
              !disabled && _checked,
            [`Checkbox--${type}--${optionType}--disabled--unchecked`]:
              disabled && !_checked,
            [`Checkbox--${type}--${optionType}--disabled--checked`]:
              disabled && _checked
          }
        )}
        data-role="checkbox"
        {...testIdBuilder?.getTestId()}
        data-amis-name={this.props.dataName}
        ref={this.labelRef}
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
        <i {...testIdBuilder?.getChild('input').getTestId()}>
          <Icon iconContent={`${type}-icon`} className="icon" />
        </i>
        <span
          className={cx(labelClassName)}
          {...testIdBuilder?.getChild('label').getTestId()}
        >
          {children || label}
        </span>
        {description ? (
          <div className={cx('Checkbox-desc')}>{description}</div>
        ) : null}
      </label>
    );
  }
}

export default themeable(Checkbox);

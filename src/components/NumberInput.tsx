import React from 'react';
// @ts-ignore
import InputNumber from 'rc-input-number';
import {ThemeProps, themeable} from '../theme';
import {autobind} from '../utils/helper';

export interface NumberProps extends ThemeProps {
  placeholder?: string;
  max?: number;
  min?: number;
  step?: number;
  showSteps?: boolean;
  precision?: number;
  disabled?: boolean;
  value?: number;
  onChange?: (value: number) => void;
}

export class NumberInput extends React.Component<NumberProps, any> {
  static defaultProps = {
    step: 1
  };

  @autobind
  handleChange(value: any) {
    const {min, max, onChange} = this.props;

    if (typeof value === 'number') {
      if (typeof min === 'number') {
        value = Math.max(value, min);
      }

      if (typeof max === 'number') {
        value = Math.min(value, max);
      }
    }

    onChange?.(value);
  }

  render(): JSX.Element {
    const {
      className,
      classPrefix: ns,
      classnames: cx,
      value,
      step,
      precision,
      max,
      min,
      disabled,
      placeholder,
      onChange,
      showSteps
    } = this.props;

    let precisionProps: any = {};

    if (typeof precision === 'number') {
      precisionProps.precision = precision;
    }

    return (
      <InputNumber
        className={cx(className, showSteps === false ? 'no-steps' : '')}
        prefixCls={`${ns}Number`}
        value={value}
        step={step}
        max={max}
        min={min}
        onChange={this.handleChange}
        disabled={disabled}
        placeholder={placeholder}
        {...precisionProps}
      />
    );
  }
}

export default themeable(NumberInput);

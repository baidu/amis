import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import InputNumber from 'rc-input-number';
import {filter} from '../../utils/tpl';

export interface NumberProps extends FormControlProps {
  placeholder?: string;
  max?: number | string;
  min?: number | string;
  step?: number;
  precision?: number;
}

export default class NumberControl extends React.Component<NumberProps, any> {
  static defaultProps: Partial<NumberProps> = {
    step: 1,
    resetValue: ''
  };

  constructor(props: NumberProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(inputValue: any) {
    const {classPrefix: ns, onChange, resetValue} = this.props;

    onChange(typeof inputValue === 'undefined' ? resetValue || '' : inputValue);
  }

  filterNum(value: number | string | undefined) {
    if (typeof value !== 'number') {
      value = filter(value, this.props.data);
      value = /^[-]?\d+/.test(value) ? parseInt(value, 10) : undefined;
    }
    return value;
  }

  render(): JSX.Element {
    const {
      className,
      classPrefix: ns,
      value,
      step,
      precision,
      max,
      min,
      disabled,
      placeholder
    } = this.props;

    let precisionProps: any = {};

    if (typeof precision === 'number') {
      precisionProps.precision = precision;
    }

    return (
      <div className={cx(`${ns}NumberControl`, className)}>
        <InputNumber
          prefixCls={`${ns}Number`}
          value={value}
          step={step}
          max={this.filterNum(max)}
          min={this.filterNum(min)}
          onChange={this.handleChange}
          disabled={disabled}
          placeholder={placeholder}
          {...precisionProps}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'number'
})
export class NumberControlRenderer extends NumberControl {
  static defaultProps: Partial<FormControlProps> = {
    validations: 'isNumeric'
  };
}

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
  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';
   /**
   * 指定输入框展示值的格式
   */
  formatter?: Function;
  /**
   * 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用
   */
  parser?: Function;
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
      showSteps,
      formatter,
      parser,
      borderMode
    } = this.props;

    let precisionProps: any = {};

    if (typeof precision === 'number') {
      precisionProps.precision = precision;
    }
    const NumberClass = ({
      'full': '',
      'half': `${ns}Number-border-half`,
      'none': `${ns}Number-border-none`,
    })[borderMode || 'full'];

    return (
      <InputNumber
        className={cx(className, showSteps === false ? 'no-steps' : '', NumberClass)}
        prefixCls={`${ns}Number`}
        value={value}
        step={step}
        max={max}
        min={min}
        formatter={formatter}
        parser={parser}
        onChange={this.handleChange}
        disabled={disabled}
        placeholder={placeholder}
        {...precisionProps}
      />
    );
  }
}

export default themeable(NumberInput);

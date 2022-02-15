import React from 'react';
// @ts-ignore
import InputNumber from 'rc-input-number';
import {ThemeProps, themeable} from '../theme';
import {autobind, ucFirst} from '../utils/helper';

export interface NumberProps extends ThemeProps {
  placeholder?: string;
  max?: number;
  min?: number;
  step?: number;
  showSteps?: boolean;
  precision?: number;
  disabled?: boolean;
  /**
   * 只读
   */
  readOnly?: boolean;
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
  /**
   * 获取焦点事件
   */
  onFocus?: Function;
  /**
   * 失去焦点事件
   */
  onBlur?: Function;
}

export class NumberInput extends React.Component<NumberProps, any> {
  static defaultProps: Pick<NumberProps, 'step' | 'readOnly' | 'borderMode'> = {
    step: 1,
    readOnly: false,
    borderMode: 'full'
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

  @autobind
  handleFocus(e: React.SyntheticEvent<HTMLElement>) {
    const {onFocus} = this.props;
    onFocus && onFocus(e);
  }

  @autobind
  handleBlur(e: React.SyntheticEvent<HTMLElement>) {
    const {onBlur} = this.props;
    onBlur && onBlur(e);
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
      borderMode,
      readOnly
    } = this.props;

    let precisionProps: any = {};

    if (typeof precision === 'number') {
      precisionProps.precision = precision;
    }

    return (
      <InputNumber
        className={cx(className, showSteps === false ? 'no-steps' : '', {
          [`Number--border${ucFirst(borderMode)}`]: borderMode
        })}
        readOnly={readOnly}
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
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        {...precisionProps}
      />
    );
  }
}

export default themeable(NumberInput);

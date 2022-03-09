import React from 'react';
// @ts-ignore
import InputNumber from 'rc-input-number';
import {Icon} from './icons';
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
  /**
   * 指定输入框是基础输入框，增强输入框
   */
  mode?: 'base' | 'strong';
  autoFocus?: Boolean;
  keyboard?: Boolean;
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
  @autobind
  upHandle() {
    const {value, step, disabled, readOnly} = this.props;
    // value为undefined会导致溢出错误
    let val = Number(value) || 0;
    if (disabled || readOnly) {
      return;
    }
    if (Number(step)) {
      val = val + Number(step);
    } else {
      return;
    }
    this.handleChange(val);
  }
  @autobind
  minusHandle() {
    const {value, step, disabled, readOnly} = this.props;
    // value为undefined会导致溢出错误
    let val = Number(value) || 0;
    if (disabled || readOnly) {
      return;
    }
    if (Number(step)) {
      val = val - Number(step);
    } else {
      return;
    }
    this.handleChange(val);
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
      readOnly,
      mode,
      autoFocus,
      keyboard
    } = this.props;

    let precisionProps: any = {};

    if (typeof precision === 'number') {
      precisionProps.precision = precision;
    }

    return (
      <div className={cx('outer-input-number', readOnly ? 'outer-number-readOnly' : '',
        disabled ? 'outer-number-disabled' : '')}>
        <div className={cx(
            mode === 'strong' ? 'is-base' : 'is-strong',
            value && value === min ? 'Number-left-border-min': '',
            disabled ? 'Number-left-border-disabled': '',
            readOnly ? 'Number-left-border-readOnly': '',
            'Number-left-border'
          )} onClick={this.minusHandle}>
          <Icon icon="minus" className="icon" />
        </div>
        <InputNumber
          className={cx(className, showSteps === false || mode === 'strong'
            ? 'no-steps' : '', {
            [`Number--border${ucFirst(borderMode)}`]: borderMode
          }, (mode === 'strong') ? 'stepPosition-number' : '')}
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
          autoFocus={autoFocus}
          keyboard={keyboard}
          {...precisionProps}
        />
        <div className={cx(
          mode === 'strong' ? 'is-base' : 'is-strong',
          value && value === max ? 'Number-right-border-max': '',
          disabled ? 'Number-right-border-disabled': '',
          readOnly ? 'Number-right-border-readOnly': '',
          'Number-right-border')}
          onClick={this.upHandle}>
          <Icon icon="plus" className="icon " />
        </div>
      </div>
    );
  }
}

export default themeable(NumberInput);

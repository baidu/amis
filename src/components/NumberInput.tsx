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
  stepPosition?: 'aside' | 'behind';
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
  upHandle() {
    const {value, step, max, min, disabled, readOnly} = this.props;
    if (disabled || readOnly) {
      return;
    }
    // value为undefined会导致溢出错误
    let val = Number(value) || 0;
    if (Number(step)) {
      val = val + Number(step);
    } else {
      val = val + 1;
    }
    if (typeof min === 'number') {
      val = Math.max(val, min);
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

    if (typeof max === 'number') {
      val = Math.min(val, max);
    }
    this.handleChange(val);
  }
  @autobind
  minusHandle() {
    const {value, step, max, min, disabled, readOnly} = this.props;
    if (disabled || readOnly) {
      return;
    }
    // value为undefined会导致溢出错误
    let val = Number(value) || 0;
    if (Number(step)) {
      val = val - Number(step);
    } else {
      val = val - 1;
    }
    if (typeof min === 'number') {
      val = Math.max(val, min);
    }

    if (typeof max === 'number') {
      val = Math.min(val, max);
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
      stepPosition,
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
            (stepPosition && stepPosition) === 'aside' ? 'is-aside' : 'is-behind',
            'Number-left-border'
          )} onClick={this.minusHandle}>
          <Icon icon="minus" className="icon" />
        </div>
        <InputNumber
          className={cx(className, showSteps === false || (stepPosition && stepPosition)
            || disabled || readOnly ? 'no-steps' : '', {
            [`Number--border${ucFirst(borderMode)}`]: borderMode
          }, (stepPosition && stepPosition) ? 'stepPosition-number' : '',)}
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
          (stepPosition && stepPosition) ? 'is-aside' : 'is-behind',
          'Number-right-border')}
          onClick={this.upHandle}>
          <Icon icon="plus" className="icon " />
        </div>
      </div>
    );
  }
}

export default themeable(NumberInput);

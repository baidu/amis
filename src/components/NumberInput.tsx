import React from 'react';
// @ts-ignore
import InputNumber from 'rc-input-number';
import getMiniDecimal, {
  DecimalClass,
  toFixed
} from 'rc-input-number/lib/utils/MiniDecimal';
import {getNumberPrecision} from 'rc-input-number/lib/utils/numberUtil';

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
  displayMode?: 'base' | 'enhance';
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
  handleEnhanceModeChange(action: 'add' | 'subtract'): void {
    const {value, step, disabled, readOnly, precision} = this.props;
    // value为undefined会导致溢出错误
    let val = Number(value) || 0;
    if (disabled || readOnly) {
      return;
    }
    if (isNaN(Number(step)) || !Number(step)) {
      return;
    }
    let stepDecimal = getMiniDecimal(Number(step));
    if (action !== 'add') {
      stepDecimal = stepDecimal.negate();
    }
    const target = getMiniDecimal(val).add(stepDecimal.toString());
    const getPrecision = (numStr: string) => {
      if (precision! >= 0) {
        return precision;
      }
      return Math.max(getNumberPrecision(numStr), getNumberPrecision(Number(step) || 1));
    };
    const triggerValueUpdate = (newValue: DecimalClass, userTyping: boolean): DecimalClass => {
      let updateValue = newValue;
      const numStr = updateValue.toString();
      const mergedPrecision = getPrecision(numStr);
      if (mergedPrecision! >= 0) {
        updateValue = getMiniDecimal(toFixed(numStr, '.', mergedPrecision));
      }

      return updateValue;

    };
    const updatedValue = triggerValueUpdate(target, false);
    val = Number(updatedValue.toString());
    this.handleChange(val);
  }
  @autobind
  renderBase() {
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
      displayMode,
      autoFocus,
      keyboard
    } = this.props;

    let precisionProps: any = {};

    if (typeof precision === 'number') {
      precisionProps.precision = precision;
    }
    return <InputNumber
      className={cx(className, showSteps === false ? 'no-steps' : '',
        displayMode === 'enhance' ? 'Number--enhance-input' : '', {
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
      autoFocus={autoFocus}
      keyboard={keyboard}
      {...precisionProps}
    />
  }
  render(): JSX.Element {
    const {
      classPrefix: ns,
      classnames: cx,
      value,
      precision,
      max,
      min,
      disabled,
      showSteps,
      borderMode,
      readOnly,
      displayMode
    } = this.props;

    let precisionProps: any = {};

    if (typeof precision === 'number') {
      precisionProps.precision = precision;
    }
    return (
      <>
        {displayMode === 'enhance' ?
          <div className={cx('Number--enhance',
            disabled ? 'Number--enhance-disabled' : '',
            showSteps === false ? 'Number--enhance-no-steps' : '',
            {
              [`Number--enhance-border${ucFirst(borderMode)}`]: borderMode
            })}>
            <div
              className={cx('Number--enhance-left-icon',
              value && value === min ? 'Number--enhance-border-min': '',
              disabled ? 'Number--enhance-border-disabled': '',
              readOnly ? 'Number--enhance-border-readOnly': '')} onClick={() => this.handleEnhanceModeChange('subtract')}>
              <Icon icon="minus" className="icon" />
            </div>
            {this.renderBase()}
            <div
              className={cx('Number--enhance-right-icon',
              value && value === max ? 'Number--enhance-border-max': '',
              disabled ? 'Number--enhance-border-disabled': '',
              readOnly ? 'Number--enhance-border-readOnly': '')} onClick={() => this.handleEnhanceModeChange('add')}>
              <Icon icon="plus" className="icon " />
            </div>
          </div> : this.renderBase()}
      </>
    );
  }
}

export default themeable(NumberInput);

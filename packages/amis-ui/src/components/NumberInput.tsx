import React from 'react';
import isInteger from 'lodash/isInteger';
// @ts-ignore
import InputNumber from 'rc-input-number';
import getMiniDecimal, {
  DecimalClass,
  toFixed
} from 'rc-input-number/lib/utils/MiniDecimal';
import {
  getNumberPrecision,
  num2str
} from 'rc-input-number/lib/utils/numberUtil';

import {Icon} from './icons';
import {ThemeProps, themeable} from 'amis-core';
import {autobind, ucFirst} from 'amis-core';

export type ValueType = string | number;

export interface NumberProps extends ThemeProps {
  placeholder?: string;
  max?: ValueType;
  min?: ValueType;
  step?: number;
  showSteps?: boolean;
  precision?: number;
  disabled?: boolean;
  /**
   * 只读
   */
  readOnly?: boolean;
  value?: ValueType;
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
  inputRef?: Function;
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
  keyboard?: Boolean;

  /**
   * 是否是大数
   */
  big?: boolean;

  /**
   * 清空输入内容时的值
   */
  resetValue?: any;
}

export class NumberInput extends React.Component<NumberProps, any> {
  static defaultProps: Pick<
    NumberProps,
    'step' | 'readOnly' | 'borderMode' | 'resetValue'
  > = {
    step: 1,
    readOnly: false,
    borderMode: 'full',
    resetValue: ''
  };

  /**
   * 处理value值
   *
   * @param value value 值
   * @param min 最小值
   * @param max 最大值
   * @param precision 精度
   * @param resetValue 重置值
   * @param isBig 是否为大数模式
   */
  static normalizeValue = (
    value: any,
    min: ValueType | undefined,
    max: ValueType | undefined,
    precision: number,
    resetValue: any,
    isBig: boolean | undefined
  ) => {
    /**
     * 输入不合法时重置为resetValue
     * 若resetValue为非数字，则直接重置
     * 若resetValue为数字，则需要处理max，min，precision，保证抛出的值满足条件
     */
    if (value == null) {
      if (typeof resetValue !== 'number') {
        return resetValue ?? '';
      }

      value = resetValue;
    }
    // 处理max & min
    if (typeof value === 'number') {
      if (typeof min === 'number') {
        value = Math.max(value, min);
      }

      if (typeof max === 'number') {
        value = Math.min(value, max);
      }
    }
    // 处理string类型输入
    if (typeof value === 'string') {
      let val = getMiniDecimal(value);
      if (typeof min !== 'undefined') {
        let minValue = getMiniDecimal(min);
        if (val.lessEquals(minValue)) {
          value = min;
        }
      }
      if (typeof max !== 'undefined') {
        let maxValue = getMiniDecimal(max);
        if (maxValue.lessEquals(val)) {
          value = max;
        }
      }
    }
    /**
     * 非大数模式下，如果精度不满足要求，需要处理value值，遵循四舍五入的处理规则
     */
    if (!isBig && getNumberPrecision(value) !== precision) {
      value = getMiniDecimal(
        toFixed(num2str(value), '.', precision)
      ).toNumber();
    }

    return value;
  };

  /**
   * 获取精度，合法的精度为0和正整数，不合法的精度统一转化为0
   * 若设置了step，则会基于step的精度生成，最终使用更高的精度
   *
   * @param precision 精度
   * @param step 步长
   */
  static normalizePrecision = (precision: any, step?: number): number => {
    if (
      typeof precision === 'number' &&
      isInteger(precision) &&
      precision >= 0
    ) {
      return Math.max(precision, getNumberPrecision(step ?? 1));
    }

    // 如果设置了step，就基于step和precision，选取更高精度
    if (step != null) {
      return Math.max(0, getNumberPrecision(step));
    }

    return 0;
  };

  /**
   * 是否是 bigNumber，如果输入的内容是字符串就自动开启
   */
  isBig: boolean = false;

  constructor(props: NumberProps) {
    super(props);

    // 严格判断大数模式，因为初始化value为empty string时，修改value值格式仍然为string
    this.isBig = !!props.big;
  }

  componentDidUpdate(prevProps: NumberProps) {
    const isBig = !!this.props.big;

    if (!!prevProps?.big !== isBig) {
      this.isBig = isBig;
    }
  }

  @autobind
  handleChange(value: any) {
    const {min, max, step, precision, resetValue, onChange} = this.props;
    const finalPrecision = NumberInput.normalizePrecision(precision, step);
    const result = NumberInput.normalizeValue(
      value,
      min,
      max,
      finalPrecision,
      resetValue,
      this.isBig
    );

    onChange?.(result);
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
    const {value, step = 1, disabled, readOnly, precision} = this.props;
    // value为undefined会导致溢出错误
    let val = value || 0;
    if (disabled || readOnly) {
      return;
    }
    if (isNaN(Number(step)) || !Number(step)) {
      return;
    }
    let stepDecimal = getMiniDecimal(step);
    if (action !== 'add') {
      stepDecimal = stepDecimal.negate();
    }
    const target = getMiniDecimal(val).add(stepDecimal.toString());
    const getPrecision = (numStr: string) => {
      if (precision != null && precision >= 0) {
        return precision;
      }
      return Math.max(
        getNumberPrecision(numStr),
        getNumberPrecision(Number(step) || 1)
      );
    };
    const triggerValueUpdate = (
      newValue: DecimalClass,
      userTyping: boolean
    ): DecimalClass => {
      let updateValue = newValue;
      const numStr = updateValue.toString();
      const mergedPrecision = getPrecision(numStr);
      if (mergedPrecision >= 0) {
        updateValue = getMiniDecimal(toFixed(numStr, '.', mergedPrecision));
      }

      return updateValue;
    };
    const updatedValue = triggerValueUpdate(target, false);
    if (this.isBig) {
      this.handleChange(updatedValue.toString());
    } else {
      val = Number(updatedValue.toString());
      this.handleChange(val);
    }
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
      showSteps,
      formatter,
      parser,
      borderMode,
      readOnly,
      displayMode,
      inputRef,
      keyboard
    } = this.props;
    const precisionProps: any = {
      precision: NumberInput.normalizePrecision(precision, step)
    };

    return (
      <InputNumber
        className={cx(
          className,
          showSteps === false ? 'no-steps' : '',
          displayMode === 'enhance' ? 'Number--enhance-input' : '',
          {
            [`Number--border${ucFirst(borderMode)}`]: borderMode
          }
        )}
        ref={inputRef}
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
        stringMode={this.isBig ? true : false}
        keyboard={keyboard}
        {...precisionProps}
      />
    );
  }
  render(): JSX.Element {
    const {
      classnames: cx,
      value,
      max,
      min,
      disabled,
      showSteps,
      borderMode,
      readOnly,
      displayMode
    } = this.props;

    return (
      <>
        {displayMode === 'enhance' ? (
          <div
            className={cx(
              'Number--enhance',
              disabled ? 'Number--enhance-disabled' : '',
              showSteps === false ? 'Number--enhance-no-steps' : '',
              {
                [`Number--enhance-border${ucFirst(borderMode)}`]: borderMode
              }
            )}
          >
            <div
              className={cx(
                'Number--enhance-left-icon',
                value && value === min ? 'Number--enhance-border-min' : '',
                disabled ? 'Number--enhance-border-disabled' : '',
                readOnly ? 'Number--enhance-border-readOnly' : ''
              )}
              onClick={() => this.handleEnhanceModeChange('subtract')}
            >
              <Icon icon="minus" className="icon" />
            </div>
            {this.renderBase()}
            <div
              className={cx(
                'Number--enhance-right-icon',
                value && value === max ? 'Number--enhance-border-max' : '',
                disabled ? 'Number--enhance-border-disabled' : '',
                readOnly ? 'Number--enhance-border-readOnly' : ''
              )}
              onClick={() => this.handleEnhanceModeChange('add')}
            >
              <Icon icon="plus" className="icon " />
            </div>
          </div>
        ) : (
          this.renderBase()
        )}
      </>
    );
  }
}

export default themeable(NumberInput);

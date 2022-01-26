import React, { CSSProperties, ReactNode } from 'react';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isEqual from 'lodash/isEqual';

import { FormItem, FormControlProps, FormBaseControl } from './Item';
import InputRange from '../../components/Range';
import NumberInput from '../../components/NumberInput';
import { Icon } from '../../components/icons';
import { stripNumber } from '../../utils/tpl-builtin';
import { autobind } from '../../utils/helper';
import { filter } from '../../utils/tpl';

/**
 * Range
 * 文档：https://baidu.gitee.io/amis/docs/components/form/range
 */

export type Value = string | MultipleValue | number | [number, number];
export type FormarValue = MultipleValue | number;
export type TooltipPosType = 'auto' | 'top' | 'right' | 'bottom' | 'left';
export type Overwrite<T, U> = Pick<T, Extract<keyof T, keyof U>> & U;
export interface RangeControlSchema extends FormBaseControl {
  type: 'input-range';

  /**
   * 最大值
   */
  max?: number;

  /**
   * 最小值
   */
  min?: number;

  /**
   * 步长
   */
  step?: number;

  /**
   * 单位
   */
  unit?: string;
}

export type MarksType = {
  [index: number | string]: Record<number, React.ReactNode | { style?: React.CSSProperties; label?: string }>
};

export interface RangeProps extends FormControlProps {
  /**
  * 滑块值
  */
  value: Value;

  /**
  * 最小值
  */
  min?: number;

  /**
  * 最大值
  */
  max?: number;

  /**
  * 步长
  */
  step?: number;

  /**
  * 是否展示步长
  */
  showSteps?: boolean;

  /**
  * 分割块数
  */
  parts?: number;

  /**
  * 刻度
  */
  marks?: MarksType;

  /**
  * 是否展示标签
  */
  tooltipVisible?: boolean;

  /**
  * 标签方向
  */
  tooltipPlacement?: TooltipPosType;

  /**
  * 控制滑块标签显隐函数
  */
  tipFormatter?: (value: Value) => boolean;

  /**
  * 是否为双滑块
  */
  multiple?: boolean;

  /**
  * 是否通过分隔符连接
  */
  joinValues?: boolean;

  /**
  * 分隔符
  */
  delimiter?: string;

  /**
  * 单位
  */
  unit?: string;

  /**
  * 是否展示输入框
  */
  showInput?: boolean;

  /**
  * 是否禁用
  */
  disabled?: boolean;

  /**
  * value改变事件
  */
  onChange: (value: Value) => void;

  /**
  * 鼠标松开事件
  */
  onAfterChange?: (value: Value) => any;
}

export interface MultipleValue {
  min: number;
  max: number;
}

export interface DefaultProps {
  value: Value;
  max: number;
  min: number;
  step: number;
  unit: string;
  clearable: boolean;
  disabled: boolean;
  showInput: boolean;
  multiple: boolean;
  joinValues: boolean;
  delimiter: string;
  showSteps: boolean;
  parts: number;
  tooltipPlacement: TooltipPosType;
}

export interface RangeItemProps extends Overwrite<DefaultProps, RangeProps> {
  value: FormarValue;
  updateValue: (value: Value) => void;
  onAfterChange: () => void;
}

export interface RangeState {
  value: FormarValue;
}

/**
  * 格式化初始value值
  * @param value 初始value值 Value
  * @param props RangeProps
  * @returns number | {min: number, max: number}
  */
export function formatValue(
  value: Value,
  props: {
    multiple: boolean;
    delimiter: string;
    min: number;
    max: number;
  }
): FormarValue {
  if (props.multiple) {
    if (typeof value === 'string') {
      const [minValue, maxValue] = value
        .split(props.delimiter || ',')
        .map(v => Number(v));
      return {
        min:
          (props.min && minValue < props.min && props.min) ||
          minValue ||
          props.min,
        max:
          (props.max && maxValue > props.max && props.max) ||
          maxValue ||
          props.max
      };
    }
    else if (Array.isArray(value)) {
      const [min, max] = value;
      return {
        min:
          (props.min && min < props.min && props.min) ||
          min ||
          props.min,
        max:
          (props.max && max > props.max && props.max) ||
          max ||
          props.max,
      };
    }
    else if (typeof value === 'object') {
      return {
        min:
          (props.min && value.min < props.min && props.min) ||
          value.min ||
          props.min,
        max:
          (props.max && value.max > props.max && props.max) ||
          value.max ||
          props.max
      };
    }
    else {
      return {
        min: props.min,
        max: props.max
      };
    }
  }
  return +value ?? props.min;
}

/**
  * 输入框
  */
export class Input extends React.Component<RangeItemProps, any> {
  /**
    * onChange事件，只能输入数字
    * @param e React.ChangeEvent
    */
  @autobind
  onChange(value: number) {
    const { multiple, value: originValue, type } = this.props;
    const _value = this.getValue(value, type);

    this.props.updateValue(
      multiple
        ? { ...(originValue as MultipleValue), [type]: _value }
        : value
    );
  }

  /**
    * 双滑块 更新value
    * @param value 输入的value值
    */
  @autobind
  onUpdateValue(value: number) {
    const { multiple, value: originValue, type } = this.props;
    const _value = this.getValue(value, type);

    this.props.updateValue(
      multiple
        ? { ...(originValue as MultipleValue), [type]: _value }
        : value
    );
  }

  filterNum(value: number | string | undefined) {
    if (typeof value !== 'number') {
      value = filter(value, this.props.data);
      value = /^[-]?\d+/.test(value) ? +value : undefined;
    }
    return value;
  }

  getStepPrecision() {
    const { step } = this.props;

    return typeof step !== 'number' || step >= 1 || step < 0
      ? 0
      : step.toString().split('.')[1]?.length;
  }

  getValue(value: string | number, type?: string) {
    const { max, min, step, value: stateValue } = this.props as RangeItemProps;

    if (
      value === '' ||
      value === '-' ||
      new RegExp('^[-]?\\d+[.]{1}[0]{0,' + this.getStepPrecision() + '}$').test(
        value + ''
      )
    ) {
      return value;
    }

    let _value = Math.round(parseFloat(value + '') / step) * step;
    _value =
      step < 1 ? parseFloat(_value.toFixed(this.getStepPrecision())) : ~~value;

    switch (type) {
      case 'min': {
        if (isObject(stateValue) && isNumber(stateValue.max)) {
          if (_value >= stateValue.max && min <= stateValue.max - step) {
            return stateValue.max - step;
          }
          if (_value < stateValue.max - step) {
            return value;
          }
        }
        return min;
      }
      case 'max':
        return isObject(stateValue) && isNumber(stateValue.min)
          ? (_value > max && max) ||
          (_value <= stateValue.min && stateValue.min + step) ||
          value
          : max;
      default:
        return (_value < min && min) || (_value > max && max) || value;
    }
  }

  render() {
    const {
      classnames: cx,
      value,
      multiple,
      type,
      step,
      classPrefix: ns,
      disabled,
      max,
      min
    } = this.props;
    const _value = multiple
      ? type === 'min'
        ? Math.min((value as MultipleValue).min, (value as MultipleValue).max)
        : Math.max((value as MultipleValue).min, (value as MultipleValue).max)
      : value;
    return (
      <div className={cx(`${ns}InputRange-input`)}>
        <NumberInput
          value={+_value}
          step={step}
          max={this.filterNum(max)}
          min={this.filterNum(min)}
          onChange={this.onChange}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default class RangeControl extends React.PureComponent<
  RangeProps,
  RangeState
> {
  midLabel?: HTMLSpanElement;

  static defaultProps: DefaultProps = {
    value: 0,
    max: 100,
    min: 0,
    step: 1,
    unit: '',
    clearable: true,
    disabled: false,
    showInput: false,
    multiple: false,
    joinValues: true,
    delimiter: ',',
    showSteps: false,
    parts: 1,
    tooltipPlacement: 'auto'
  };

  constructor(props: RangeProps) {
    super(props);
    const { value: propsValue, multiple, delimiter, min, max } = {
      ...RangeControl.defaultProps,
      ...this.props
    };
    const value = formatValue(propsValue, {
      multiple,
      delimiter,
      min,
      max
    });

    this.state = {
      value: this.getValue(value)
    };
  }

  componentDidUpdate(prevProps: RangeProps) {
    const { value } = prevProps;
    const { value: nextPropsValue, multiple, delimiter, min, max, onChange } = {
      ...RangeControl.defaultProps,
      ...this.props
    };
    if (value !== nextPropsValue) {
      const value = formatValue(nextPropsValue, {
        multiple,
        delimiter,
        min,
        max
      });
      this.setState({
        value: this.getValue(value)
      });
    }
  }

  @autobind
  clearValue() {
    const { multiple, min, max } = {
      ...RangeControl.defaultProps,
      ...this.props
    };
    if (multiple) {
      this.updateValue({ min, max });
    } else {
      this.updateValue(min)
    }
  }

  @autobind
  getValue(value: FormarValue) {
    const { multiple } = this.props;
    return multiple ? {
      max: stripNumber((value as MultipleValue).max),
      min: stripNumber((value as MultipleValue).min),
    } : stripNumber(value as number)
  }

  /**
    * 所有触发value变换 -> updateValue
    * @param value
    */
  @autobind
  updateValue(value: FormarValue) {
    this.setState({ value: this.getValue(value) });
    const { multiple, joinValues, delimiter, onChange } = this.props;
    onChange(
      multiple ?
        joinValues
          ? [(value as MultipleValue).min, (value as MultipleValue).max].join(delimiter || ',')
          : {
            min: (value as MultipleValue).min,
            max: (value as MultipleValue).max
          }
        : value
    );
  }

  /**
   * 鼠标松开事件
   */
  @autobind
  onAfterChange() {
    const { value } = this.state;
    const { multiple, joinValues, delimiter, onAfterChange } = this.props;
    onAfterChange && onAfterChange(
      multiple ?
        joinValues
          ? [(value as MultipleValue).min, (value as MultipleValue).max].join(delimiter || ',')
          : {
            min: (value as MultipleValue).min,
            max: (value as MultipleValue).max
          }
        : value
    );
  }

  render() {
    const { value } = this.state;
    const props: RangeItemProps = {
      ...RangeControl.defaultProps,
      ...this.props,
      value,
      updateValue: this.updateValue,
      onAfterChange: this.onAfterChange
    };

    const {
      classPrefix: ns,
      multiple,
      parts,
      showInput,
      classnames: cx,
      className,
      disabled,
      clearable,
      min,
      max
    } = props;

    // 指定parts -> 重新计算步长
    if (parts > 1) {
      props.step = (props.max - props.min) / props.parts;
      props.showSteps = true;
    }

    return (
      <div
        className={cx(
          'RangeControl',
          `${ns}InputRange`,
          { 'is-disabled': disabled },
          className
        )}
      >
        {
          showInput && multiple &&
          <Input {...props} type="min" />
        }
        <InputRange {...props} />
        {showInput && <Input {...props} type="max" />}
        {clearable && !disabled && showInput ? (
          <a
            onClick={() => this.clearValue()}
            className={cx('InputRange-clear', {
              'is-active': multiple
                ? isEqual(this.state.value, { min: min, max: max })
                : this.state.value !== min
            })}
          >
            <Icon icon="close" className="icon" />
          </a>
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'input-range'
})
export class RangeControlRenderer extends RangeControl { }

import React, {ReactNode} from 'react';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isEqual from 'lodash/isEqual';
import forEach from 'lodash/forEach';

import {
  FormItem,
  FormControlProps,
  resolveEventData,
  autobind,
  stripNumber,
  filter,
  ActionObject,
  isMobile,
  isPureVariable,
  resolveVariableAndFilter,
  isNumeric,
  getVariable
} from 'amis-core';
import {Range as InputRange, NumberInput, Icon} from 'amis-ui';
import {FormBaseControlSchema, SchemaObject} from '../../Schema';
import {supportStatic} from './StaticHoc';

import type {SchemaTokenizeableString} from '../../Schema';
import {AMISFormItem} from 'amis-core';

/**
 * Range
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/range
 */

export type Value = string | MultipleValue | number | [number, number];
export type FormatValue = MultipleValue | number;
export type TooltipPosType = 'auto' | 'top' | 'right' | 'bottom' | 'left';
export type InputRangeRendererEvent = 'change' | 'blur' | 'focus';
export type InputRangeRendererAction = 'clear';
/**
 * InputRange 表单滑块组件，支持单滑块和双滑块，配置最小值、最大值、步长、分段、刻度和单位，可展示当前值及标签。
 */
export interface AMISInputRangeSchema extends AMISFormItem {
  type: 'input-range';

  /**
   * 滑块值
   */
  value?: Value;

  /**
   * 最大值
   */
  max?: number | SchemaTokenizeableString;

  /**
   * 最小值
   */
  min?: number | SchemaTokenizeableString;

  /**
   * 步长
   */
  step?: number | SchemaTokenizeableString;

  /**
   * 单位
   */
  unit?: string;

  /**
   * 是否展示步长
   */
  showSteps?: boolean;

  /**
   * 分割块数
   */
  parts?: number | number[];

  /**
   * 刻度
   */
  marks?: Array<any>;

  /**
   * 是否展示标签
   */
  tooltipVisible?: boolean;

  /**
   * 标签方向
   */
  tooltipPlacement?: TooltipPosType;

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
   * 是否展示输入框
   */
  showInput?: boolean;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 输入框是否可清除
   */
  clearable?: boolean;
}

type MarksType = {
  [index: string | number]: MarksValue;
};

type MarksValue =
  | string
  | number
  | SchemaObject
  | {style?: React.CSSProperties; label?: string};

export interface RangeProps extends FormControlProps {
  /**
   * 滑块值
   */
  value: Value;

  /**
   * 最小值
   */
  min: number | SchemaTokenizeableString;

  /**
   * 最大值
   */
  max: number | SchemaTokenizeableString;

  /**
   * 步长
   */
  step: number | SchemaTokenizeableString;

  /**
   * 是否展示步长
   */
  showSteps: boolean;

  /**
   * 分割块数
   */
  parts: number;

  /**
   * 刻度
   */
  marks?: Array<any>;

  /**
   * 是否展示标签
   */
  tooltipVisible: boolean;

  /**
   * 标签方向
   */
  tooltipPlacement: TooltipPosType;

  /**
   * 控制滑块标签显隐函数
   */
  tipFormatter?: (value: Value) => boolean;

  /**
   * 是否为双滑块
   */
  multiple: boolean;

  /**
   * 是否通过分隔符连接
   */
  joinValues: boolean;

  /**
   * 分隔符
   */
  delimiter: string;

  /**
   * 单位
   */
  unit?: string;

  /**
   * 是否展示输入框
   */
  showInput: boolean;

  /**
   * 输入框是否显示单位
   */
  showInputUnit?: boolean;

  /**
   * 是否禁用
   */
  disabled: boolean;

  /**
   * 输入框是否可清除
   */
  clearable?: boolean;

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
  showInputUnit: boolean;
  multiple: boolean;
  joinValues: boolean;
  delimiter: string;
  showSteps: boolean;
  parts: number;
  tooltipPlacement: TooltipPosType;
}

export interface RangeItemProps
  extends Omit<RangeProps, 'min' | 'max' | 'step'> {
  min: number;
  max: number;
  step: number;
  value: FormatValue;
  onChange: (value: Value) => void;
  onAfterChange: () => void;
}

export interface RangeState {
  value: FormatValue;
}

const resolveNumVariable = (
  value: number | string | undefined,
  data: Record<string, any> = {},
  fallback: number
) => {
  if (typeof value === 'string') {
    value = isPureVariable(value)
      ? resolveVariableAndFilter(value, data)
      : value;

    if (typeof value === 'string') {
      const result = parseFloat(value);
      return isNaN(result) ? fallback : result;
    } else if (typeof value === 'number') {
      return value;
    }
  } else if (typeof value === 'number') {
    return value;
  }

  return value ?? fallback;
};

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
): FormatValue {
  if (props.multiple) {
    let {min, max} = props;
    // value是字符串
    if (typeof value === 'string') {
      [min, max] = value.split(props.delimiter || ',').map(v => Number(v));
    }
    // value是数组
    else if (Array.isArray(value)) {
      [min, max] = value;
    }
    // value是对象
    else if (typeof value === 'object') {
      min = value.min;
      max = value.max;
    }
    return {
      min: min === undefined || min < props.min ? props.min : min,
      max: max === undefined || max > props.max ? props.max : max
    };
  }
  return +value < props.min ? props.min : Math.min(+value, props.max);
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
  handleInputNumberChange(value: number) {
    const {multiple, value: originValue, type, min, max, onChange} = this.props;
    const _value = this.getValue(value, type);

    onChange?.(
      multiple
        ? {...(originValue as MultipleValue), [type]: _value}
        : Math.max(Math.min(value, max), min)
    );
  }

  /**
   * 双滑块 更新value
   * @param value 输入的value值
   */
  @autobind
  onUpdateValue(value: number) {
    const {multiple, value: originValue, type} = this.props;
    const _value = this.getValue(value, type);

    this.props.onChange(
      multiple ? {...(originValue as MultipleValue), [type]: _value} : value
    );
  }

  checkNum(value: number | string | undefined) {
    if (typeof value !== 'number') {
      value = filter(value, this.props.data);
      value = /^[-]?\d+/.test(value) ? +value : undefined;
    }
    return value;
  }

  /**
   * 获取步长小数精度
   * @returns
   */
  getStepPrecision() {
    const {step: rawStep, data} = this.props;
    const step = resolveNumVariable(rawStep, data, 1);
    const stepIsDecimal = /^\d+\.\d+$/.test(step.toString());
    return !stepIsDecimal || step < 0
      ? 0
      : step.toString().split('.')[1]?.length;
  }

  /**
   * 处理数据
   * @param value input数据
   * @param type min | max 双滑块
   * @returns 处理之后数据
   */
  getValue(value: string | number, type?: string) {
    const {min, max, step, value: stateValue} = this.props as RangeItemProps;

    // value为null、undefined时，取对应的min/max
    value = value ?? (type === 'min' ? min : max);
    // 校正value为step的倍数
    let _value = Math.round(parseFloat(value + '') / step) * step;
    // 同步value与步长小数位数
    _value = parseFloat(_value.toFixed(this.getStepPrecision()));
    // 单滑块只用考虑 轨道边界 ，双滑块需要考虑 两端滑块边界
    switch (type) {
      case 'min': {
        if (isObject(stateValue) && isNumber(stateValue.max)) {
          // 如果 大于当前双滑块最大值 取 当前双滑块max值 - 步长
          if (_value >= stateValue.max) {
            return stateValue.max - step;
          }
          return _value;
        }
        return min;
      }
      case 'max':
        if (isObject(stateValue) && isNumber(stateValue.min)) {
          // 如果 小于当前双滑块最大值 取 当前双滑块min值 + 步长
          if (_value <= stateValue.min) {
            return stateValue.min + step;
          }
          return _value;
        }
        return max;
      default:
        // 轨道边界
        return (_value < min && min) || (_value > max && max) || _value;
    }
  }

  /**
   * 失焦事件
   */
  @autobind
  async onBlur(e: any) {
    const {dispatchEvent, value, onBlur} = this.props;

    const rendererEvent = await dispatchEvent(
      'blur',
      resolveEventData(this.props, {
        value
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onBlur?.(e);
  }

  /**
   * 聚焦事件
   */
  @autobind
  async onFocus(e: any) {
    const {dispatchEvent, value, onFocus} = this.props;

    const rendererEvent = await dispatchEvent(
      'focus',
      resolveEventData(this.props, {
        value
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onFocus?.(e);
  }

  render() {
    const {
      classnames: cx,
      style,
      value,
      multiple,
      type,
      step,
      classPrefix: ns,
      disabled,
      max,
      min,
      mobileUI,
      unit,
      showInputUnit
    } = this.props;
    const _value = multiple
      ? type === 'min'
        ? Math.min((value as MultipleValue).min, (value as MultipleValue).max)
        : Math.max((value as MultipleValue).min, (value as MultipleValue).max)
      : value;
    return (
      <div
        className={cx(`${ns}InputRange-input`, {
          [`${ns}InputRange-input-with-unit`]: unit && showInputUnit
        })}
      >
        <NumberInput
          value={+_value}
          step={step}
          max={this.checkNum(max)}
          min={this.checkNum(min)}
          onChange={this.handleInputNumberChange}
          disabled={disabled}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          mobileUI={mobileUI}
        />
        {unit && showInputUnit && (
          <div className={cx(`${ns}InputRange-unit`, `${ns}Select`)}>
            {unit}
          </div>
        )}
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
    showInputUnit: false,
    multiple: false,
    joinValues: true,
    delimiter: ',',
    showSteps: false,
    parts: 1,
    tooltipPlacement: 'auto'
  };

  constructor(props: RangeProps) {
    super(props);
    const {value: propsValue, multiple, delimiter, min, max, data} = this.props;

    const value = formatValue(propsValue, {
      multiple,
      delimiter,
      min: resolveNumVariable(min, data, 0),
      max: resolveNumVariable(max, data, 0)
    });

    this.state = {
      value: this.getValue(value)
    };
  }

  componentDidUpdate(prevProps: RangeProps) {
    const {value, min, max, data: prevData} = prevProps;
    const {
      value: nextPropsValue,
      multiple,
      delimiter,
      min: nextPropsMin,
      max: nextPropsMax,
      data,
      onChange
    } = this.props;
    const prevMin = resolveNumVariable(min, prevData, 0);
    const prevMax = resolveNumVariable(max, prevData, 100);
    const nextMin = resolveNumVariable(nextPropsMin, data, 0);
    const nextMax = resolveNumVariable(nextPropsMax, data, 100);

    if (
      value !== nextPropsValue ||
      prevMin !== nextMin ||
      prevMax !== nextMax
    ) {
      const value = formatValue(nextPropsValue, {
        multiple,
        delimiter,
        min: nextMin,
        max: nextMax
      });
      this.setState({
        value: this.getValue(value)
      });
    }
  }

  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const actionType = action?.actionType as string;

    if (actionType === 'reset') {
      this.resetValue();
    } else if (actionType === 'clear') {
      this.clearValue();
    }
  }

  @autobind
  resetValue() {
    const {
      multiple,
      min: rawMin,
      max: rawMax,
      data,
      onChange,
      formStore,
      store,
      name,
      resetValue
    } = this.props;
    const min = resolveNumVariable(rawMin, data, 0);
    const max = resolveNumVariable(rawMax, data, 100);

    let pristineVal =
      getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
    const value = this.getFormatValue(
      pristineVal ?? (multiple ? {min, max} : min)
    );

    onChange?.(value);
  }

  @autobind
  clearValue(type: string = 'clear') {
    const {multiple, min: rawMin, max: rawMax, data, onChange} = this.props;
    const min = resolveNumVariable(rawMin, data, 0);
    const max = resolveNumVariable(rawMax, data, 100);
    const value = this.getFormatValue(multiple ? {min, max} : min);

    onChange?.(value);
  }

  /**
   * 获取步长小数精度
   * @returns
   */
  getStepPrecision() {
    const {step: rawStep, data} = this.props;
    const step = resolveNumVariable(rawStep, data, 1);
    const stepIsDecimal = /^\d+\.\d+$/.test(step.toString());
    return !stepIsDecimal || step < 0
      ? 0
      : step.toString().split('.')[1]?.length;
  }

  @autobind
  getValue(value: FormatValue) {
    const {multiple} = this.props;
    const precision = this.getStepPrecision();
    return multiple
      ? {
          max: stripNumber((value as MultipleValue).max, precision),
          min: stripNumber((value as MultipleValue).min, precision)
        }
      : stripNumber(value as number, precision);
  }

  /**
   * 所有触发value变换 -> onChange
   * @param value
   */
  @autobind
  async handleChange(_value: FormatValue) {
    const value = this.getValue(_value);
    this.setState({value});
    const {onChange, dispatchEvent} = this.props;
    let result = this.getFormatValue(value);

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {
        value: result
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange?.(result);
  }

  /**
   * 鼠标松开事件
   */
  @autobind
  onAfterChange() {
    const {value} = this.state;
    const {onAfterChange} = this.props;
    const result = this.getFormatValue(this.getValue(value));
    onAfterChange && onAfterChange(result);
  }

  /**
   * 获取导出格式数据
   */
  @autobind
  getFormatValue(value: FormatValue): Value {
    const {multiple, joinValues, delimiter, extraName} = this.props;
    return multiple
      ? extraName
        ? [(value as MultipleValue).min, (value as MultipleValue).max]
        : joinValues
        ? [(value as MultipleValue).min, (value as MultipleValue).max].join(
            delimiter || ','
          )
        : {
            min: (value as MultipleValue).min,
            max: (value as MultipleValue).max
          }
      : value;
  }

  @supportStatic()
  render() {
    const {value} = this.state;
    const props: RangeItemProps = {
      ...this.props,
      /** 解析变量，下面组件透传属性时使用 props 即可 */
      min: resolveNumVariable(this.props.min, this.props.data, 0),
      max: resolveNumVariable(this.props.max, this.props.data, 0),
      step: resolveNumVariable(this.props.step, this.props.data, 1),
      value,
      onChange: this.handleChange,
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
      max,
      render,
      marks,
      region,
      mobileUI
    } = props;

    // 处理自定义json配置
    let renderMarks:
      | MarksType
      | {[index: string]: ReactNode; [index: number]: ReactNode}
      | undefined = marks ? {...marks} : marks;
    marks &&
      forEach(marks, (item, key) => {
        if (isObject(item) && (item as SchemaObject).type) {
          renderMarks &&
            (renderMarks[key] = render(region, item as SchemaObject));
        }

        /** 过滤掉不合法的值（合法的值是数字 & 百分数） */
        if (renderMarks && !isNumeric(key.replace(/%$/, ''))) {
          delete renderMarks[key];
        }
      });

    return (
      <div
        className={cx(
          'RangeControl',
          `${ns}InputRange`,
          {'is-disabled': disabled},
          {'is-mobile': mobileUI},
          className
        )}
      >
        {showInput && multiple && <Input {...props} type="min" />}
        <InputRange {...props} marks={renderMarks} />
        {showInput && <Input {...props} type="max" />}
        {clearable && !disabled && showInput ? (
          <a
            onClick={() => this.clearValue()}
            className={cx('InputRange-clear', {
              'is-active': multiple
                ? isEqual(this.state.value, {min: min, max: max})
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
export class RangeControlRenderer extends RangeControl {}

import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from 'amis-core';
import cx from 'classnames';
import {filter} from 'amis-core';
import {NumberInput, Select} from 'amis-ui';
import {autobind, createObject} from 'amis-core';
import {normalizeOptions, Option} from 'amis-core';
import {PlainObject, ActionObject} from 'amis-core';
import {BaseSchema, FormBaseControlSchema} from '../../Schema';
/**
 * 数字输入框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/number
 */
export interface NumberControlSchema extends FormBaseControlSchema {
  type: 'input-number';

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
   * 精度
   */
  precision?: number;

  /**
   * 默认当然是
   */
  showSteps?: boolean;
  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';
  /**
   * 前缀
   */
  prefix?: string;
  /**
   * 后缀
   */
  suffix?: string;

  /**
   * 单位列表
   */
  unitOptions?: string | Array<Option> | string[] | PlainObject;

  /**
   * 是否千分分隔
   */
  kilobitSeparator?: boolean;
  /**
   * 只读
   */
  readOnly?: boolean;
  /**
   * 是否启用键盘行为
   */
  keyboard?: boolean;
  /**
   * 输入框为基础输入框还是加强输入框
   */
  displayMode?: 'base' | 'enhance';
}

export interface NumberProps extends FormControlProps {
  placeholder?: string;
  max?: number | string;
  min?: number | string;
  step?: number;
  precision?: number;
  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';
  /**
   * 前缀
   */
  prefix?: string;
  /**
   * 后缀
   */
  suffix?: string;
  /**
   * 是否千分分隔
   */
  kilobitSeparator?: boolean;
  /**
   * 只读
   */
  readOnly?: boolean;
  /**
   * 启用键盘行为，即通过上下方向键控制是否生效
   */
  keyboard?: boolean;
  /**
   * 输入框为基础输入框还是加强输入框
   */
  displayMode?: 'base' | 'enhance';
}

interface NumberState {
  // 数字单位，将会影响输出
  unit?: string;
  unitOptions?: Option[];
}

export type InputNumberRendererEvent = 'blur' | 'focus' | 'change';
export type InputNumberRendererAction = 'clear';

export default class NumberControl extends React.Component<
  NumberProps,
  NumberState
> {
  input?: HTMLInputElement;
  static defaultProps: Partial<NumberProps> = {
    step: 1,
    resetValue: ''
  };

  constructor(props: NumberProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeUnit = this.handleChangeUnit.bind(this);
    const unit = this.getUnit();
    const unitOptions = normalizeOptions(props.unitOptions);
    this.state = {unit, unitOptions};
  }

  /**
   * 动作处理
   */
  doAction(action: ActionObject, args: any) {
    const actionType = action?.actionType as string;
    const {resetValue, onChange} = this.props;

    if (actionType === 'clear') {
      onChange?.('');
    } else if (actionType === 'reset') {
      const value = this.getValue(resetValue ?? '');
      onChange?.(value);
    }
  }

  // 解析出单位
  getUnit() {
    const props = this.props;
    if (props.unitOptions && props.unitOptions.length) {
      const optionValues = normalizeOptions(props.unitOptions).map(
        option => option.value
      );
      // 如果有值就解析出来作为单位
      if (props.value && typeof props.value === 'string') {
        let unit = optionValues[0];
        // 先找长的字符，这样如果有 ab 和 b 两种后缀相同的也能识别
        optionValues.sort((a, b) => b.length - a.length);
        for (const optionValue of optionValues) {
          if (props.value.endsWith(optionValue)) {
            unit = optionValue;
            break;
          }
        }
        return unit;
      } else {
        // 没有值就使用第一个单位
        return optionValues[0];
      }
    }
    return undefined;
  }

  getValue(inputValue: any) {
    const {resetValue, unitOptions} = this.props;

    if (inputValue && typeof inputValue !== 'number') {
      return;
    }

    if (inputValue !== null && unitOptions && this.state.unit) {
      inputValue = inputValue + this.state.unit;
    }
    return inputValue === null ? resetValue ?? null : inputValue;
  }

  // 派发有event的事件
  @autobind
  async dispatchEvent(eventName: string) {
    const {dispatchEvent, data, value} = this.props;

    dispatchEvent(
      eventName,
      createObject(data, {
        value
      })
    );
  }

  async handleChange(inputValue: any) {
    const {onChange, data, dispatchEvent} = this.props;
    const value = this.getValue(inputValue);

    const rendererEvent = await dispatchEvent(
      'change',
      createObject(data, {
        value
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }
    onChange(value);
  }

  filterNum(value: number | string | undefined) {
    if (typeof value !== 'number') {
      value = filter(value, this.props.data);
      value = /^[-]?\d+/.test(value) ? +value : undefined;
    }
    return value;
  }

  // 单位选项的变更
  handleChangeUnit(option: Option) {
    let value = this.props.value;
    const prevUnitValue = this.state.unit;
    this.setState({unit: option.value}, () => {
      if (value) {
        value = value.replace(prevUnitValue, '');
        this.props.onChange(value + this.state.unit);
      }
    });
  }

  componentDidUpdate(prevProps: NumberProps) {
    if (this.props.value !== prevProps.value) {
      const unit = this.getUnit();
      this.setState({unit: unit});
    }
    if (this.props.unitOptions !== prevProps.unitOptions) {
      this.setState({unitOptions: normalizeOptions(this.props.unitOptions)});
    }
  }
  @autobind
  inputRef(ref: any) {
    this.input = ref;
  }
  focus() {
    if (!this.input) {
      return;
    }
    this.input.focus();
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
      placeholder,
      showSteps,
      borderMode,
      suffix,
      prefix,
      kilobitSeparator,
      unitOptions,
      readOnly,
      keyboard,
      displayMode
    } = this.props;

    let precisionProps: any = {};

    const finalPrecision = this.filterNum(precision);
    if (typeof finalPrecision === 'number') {
      precisionProps.precision = finalPrecision;
    }

    const unit = this.state?.unit;
    // 数据格式化
    const formatter = (value: string | number) => {
      // 增加千分分隔
      if (kilobitSeparator && value) {
        value = (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return (prefix ? prefix : '') + value + (suffix ? suffix : '');
    };
    // 将数字还原
    const parser = (value: string) => {
      if (value) {
        prefix && (value = value.replace(prefix, ''));
        suffix && (value = value.replace(suffix, ''));
        kilobitSeparator && (value = value.replace(/,/g, ''));
      }
      return value;
    };

    const finalValue =
      unit && value && typeof value === 'string'
        ? value.replace(unit, '')
        : value;

    return (
      <div
        className={cx(
          `${ns}NumberControl`,
          {
            [`${ns}NumberControl--withUnit`]: unitOptions
          },
          className
        )}
      >
        <NumberInput
          inputRef={this.inputRef}
          value={finalValue}
          step={step}
          max={this.filterNum(max)}
          min={this.filterNum(min)}
          formatter={formatter}
          parser={parser}
          onChange={this.handleChange}
          disabled={disabled}
          placeholder={placeholder}
          precision={finalPrecision}
          showSteps={showSteps}
          borderMode={borderMode}
          readOnly={readOnly}
          onFocus={() => this.dispatchEvent('focus')}
          onBlur={() => this.dispatchEvent('blur')}
          keyboard={keyboard}
          displayMode={displayMode}
        />
        {unitOptions ? (
          <Select
            value={unit}
            clearable={false}
            options={this.state.unitOptions || []}
            onChange={this.handleChangeUnit}
          />
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'input-number'
})
export class NumberControlRenderer extends NumberControl {
  static defaultProps: Partial<FormControlProps> = {
    validations: 'isNumeric',
    ...NumberControl.defaultProps
  };
}

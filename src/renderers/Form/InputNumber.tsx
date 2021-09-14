import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import {filter} from '../../utils/tpl';
import NumberInput from '../../components/NumberInput';
import {FormOptionsControl} from './Options';

/**
 * 数字输入框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/number
 */
export interface NumberControlSchema extends FormBaseControl {
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
   * 是否千分分隔
   */
  kilobitSeparator?: boolean;
  /**
  * 只读
  */
  readOnly?: boolean
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
  readOnly?: boolean
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

    if (inputValue && typeof inputValue !== 'number') {
      return;
    }

    onChange(inputValue === null ? resetValue ?? null : inputValue);
  }

  filterNum(value: number | string | undefined) {
    if (typeof value !== 'number') {
      value = filter(value, this.props.data);
      value = /^[-]?\d+/.test(value) ? +value : undefined;
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
      placeholder,
      showSteps,
      borderMode,
      suffix,
      prefix,
      kilobitSeparator,
      readOnly
    } = this.props;

    let precisionProps: any = {};

    const finalPrecision = this.filterNum(precision);
    if (typeof finalPrecision === 'number') {
      precisionProps.precision = finalPrecision;
    }
    // 数据格式化
    const formatter = (value: string | number) => {
      // 增加千分分隔
      if (kilobitSeparator && value) {
        value = (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return (prefix ? prefix : '')
       + value
       + (suffix ? suffix : '');
    }
    // 将数字还原
    const parser = (value: string) => {
      if (value) {
        prefix && (value = value.replace(prefix, ''));
        suffix && (value = value.replace(suffix, ''));
        kilobitSeparator &&  (value = value.replace(/,/g, ''));
      }
      return value;
    }
    return (
      <div className={cx(`${ns}NumberControl`, className)}>
        <NumberInput
          value={value}
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
        />
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

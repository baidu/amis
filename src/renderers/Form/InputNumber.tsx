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
   * 指定输入框展示值的格式
   */
  formatter?: string;
  /**
   * 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用
   */
  parser?: string;
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
   * 指定输入框展示值的格式
   */
  formatter?: string;
  /**
   * 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用
   */
  parser?: string;
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
      formatter,
      parser,
      borderMode
    } = this.props;

    let precisionProps: any = {};

    const finalPrecision = this.filterNum(precision);
    if (typeof finalPrecision === 'number') {
      precisionProps.precision = finalPrecision;
    }

    return (
      <div className={cx(`${ns}NumberControl`, className)}>
        <NumberInput
          value={value}
          step={step}
          max={this.filterNum(max)}
          min={this.filterNum(min)}
          formatter={formatter && eval(formatter)}
          parser={parser && eval(parser)}
          onChange={this.handleChange}
          disabled={disabled}
          placeholder={placeholder}
          precision={finalPrecision}
          showSteps={showSteps}
          borderMode={borderMode}
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

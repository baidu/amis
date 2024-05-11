import React from 'react';
import {Renderer, RendererProps, numberFormatter, stripNumber} from 'amis-core';
import moment from 'moment';
import {BaseSchema} from '../Schema';
import isNumber from 'lodash/isNumber';
import {getPropValue, Option, PlainObject, normalizeOptions} from 'amis-core';

import getMiniDecimal, {
  DecimalClass,
  toFixed,
  getNumberPrecision,
  num2str
} from '@rc-component/mini-decimal';

/**
 * Number 展示渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/number
 */
export interface NumberSchema extends BaseSchema {
  /**
   * 指定为数字展示类型
   */
  type: 'number';

  /**
   * 精度，用来控制小数点位数
   */
  precision?: number;

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
   * 百分比显示
   */
  percent?: boolean | number;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 单位列表
   */
  unitOptions?: string | Array<Option> | string[] | PlainObject;
}

export interface NumberProps
  extends RendererProps,
    Omit<NumberSchema, 'type' | 'className'> {}

export class NumberField extends React.Component<NumberProps> {
  static defaultProps: Pick<NumberProps, 'placeholder' | 'kilobitSeparator'> = {
    placeholder: '-',
    kilobitSeparator: true
  };

  render() {
    const {
      placeholder,
      kilobitSeparator,
      precision,
      prefix,
      affix,
      suffix,
      percent,
      unitOptions,
      className,
      style,
      classnames: cx,
      translate: __
    } = this.props;
    let viewValue: React.ReactNode = (
      <span className="text-muted">{placeholder}</span>
    );

    let value = getPropValue(this.props);

    let unit = '';
    if (typeof value === 'string' && unitOptions && unitOptions.length) {
      const units = normalizeOptions(unitOptions).map(v => v.value);
      unit = units.find(item => value.endsWith(item)) || '';
      if (unit) {
        value = value.replace(unit, '');
      }
    }

    if (typeof value === 'number' || typeof value === 'string') {
      // 设置了精度，但是原始数据是字符串，需要转成 float 之后再处理
      if (typeof value === 'string' && precision) {
        value = stripNumber(parseFloat(value));
      }

      if (isNaN(value)) {
        viewValue = false;
      } else if (percent) {
        // 如果是百分比展示
        value = parseFloat(value) || 0;
        const decimals = typeof percent === 'number' ? percent : 0;

        let whole = value * 100;
        let multiplier = Math.pow(10, decimals);

        value =
          (Math.round(whole * multiplier) / multiplier).toFixed(decimals) + '%';
        viewValue = <span>{value}</span>;
      } else {
        if (typeof value === 'number' && precision) {
          value = getMiniDecimal(
            toFixed(num2str(value), '.', precision)
          ).toNumber();
        }

        if (kilobitSeparator) {
          value = numberFormatter(value, precision);
        }

        viewValue = <span>{value}</span>;
      }
    }

    viewValue = !viewValue ? (
      <span className="text-danger">{__('Number.invalid')}</span>
    ) : (
      <>
        {prefix}
        {viewValue}
        {unit}
        {affix ?? suffix}
      </>
    );

    return (
      <span className={cx('NumberField', className)} style={style}>
        {viewValue}
      </span>
    );
  }
}

@Renderer({
  type: 'number'
})
export class NumberFieldRenderer extends NumberField {}

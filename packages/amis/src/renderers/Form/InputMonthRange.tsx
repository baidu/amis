import React from 'react';
import {FormItem} from 'amis-core';
import cx from 'classnames';
import {filterDate, parseDuration} from 'amis-core';
import InputDateRange, {DateRangeControlSchema} from './InputDateRange';
import {DateRangePicker} from 'amis-ui';

/**
 * MonthRange 月范围控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/month-range
 */

export interface MonthRangeControlSchema
  extends Omit<DateRangeControlSchema, 'type'> {
  type: 'input-month-range';
}

export default class MonthRangeControl extends InputDateRange {
  render() {
    const {
      className,
      classPrefix: ns,
      minDate,
      maxDate,
      minDuration,
      maxDuration,
      data,
      format,
      env,
      ...rest
    } = this.props;

    return (
      <div className={cx(`${ns}DateRangeControl`, className)}>
        <DateRangePicker
          viewMode="months"
          format={format}
          classPrefix={ns}
          data={data}
          {...rest}
          minDate={minDate ? filterDate(minDate, data, format) : undefined}
          maxDate={maxDate ? filterDate(maxDate, data, format) : undefined}
          minDuration={minDuration ? parseDuration(minDuration) : undefined}
          maxDuration={maxDuration ? parseDuration(maxDuration) : undefined}
          onChange={this.handleChange}
          onFocus={this.dispatchEvent}
          onBlur={this.dispatchEvent}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'input-month-range'
})
export class MonthRangeControlRenderer extends MonthRangeControl {
  static defaultProps = {
    format: 'X',
    inputFormat: 'YYYY-MM',
    joinValues: true,
    delimiter: ',',
    timeFormat: '',
    ranges: 'thismonth,prevmonth',
    animation: true
  };
}

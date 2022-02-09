import React from 'react';
import {FormItem} from './Item';
import cx from 'classnames';
import {filterDate, parseDuration} from '../../utils/tpl-builtin';
import InputDateRange, {DateRangeControlSchema} from './InputDateRange';
import DateRangePicker from '../../components/DateRangePicker';

/**
 * YearRange 年份范围控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-year-range
 */
export interface YearRangeControlSchema
  extends Omit<DateRangeControlSchema, 'type'> {
  type: 'input-year-range';
}

export default class YearRangeControl extends InputDateRange {
  render() {
    const {
      className,
      classPrefix: ns,
      defaultValue,
      defaultData,
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
          viewMode="years"
          format="YYYY"
          inputFormat="YYYY"
          placeholder="YearRange.placeholder"
          ranges="thisyear,lastYear"
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
  type: 'input-year-range'
})
export class YearRangeControlRenderer extends YearRangeControl {
  static defaultProps = {
    format: 'X',
    joinValues: true,
    delimiter: ',',
    timeFormat: '',
    inputFormat: 'YYYY',
    dateFormat: 'YYYY'
  };
}

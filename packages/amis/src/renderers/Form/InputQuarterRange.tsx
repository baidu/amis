import React from 'react';
import {FormItem} from './Item';
import cx from 'classnames';
import {filterDate, parseDuration} from '../../utils/tpl-builtin';
import InputDateRange, {DateRangeControlSchema} from './InputDateRange';
import DateRangePicker from '../../components/DateRangePicker';
/**
 * QuarterRange 季度范围控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-quarter-range
 */
export interface QuarterRangeControlSchema
  extends Omit<DateRangeControlSchema, 'type'> {
  type: 'input-quarter-range';
}

export default class QuarterRangeControl extends InputDateRange {
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
          viewMode="quarters"
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
  type: 'input-quarter-range'
})
export class QuarterRangeControlRenderer extends QuarterRangeControl {
  static defaultProps = {
    format: 'X',
    inputFormat: 'YYYY-[Q]Q',
    joinValues: true,
    delimiter: ',',
    timeFormat: '',
    ranges: 'thisquarter,prevquarter'
  };
}

import React from 'react';
import {FormItem} from 'amis-core';
import cx from 'classnames';
import {filterDate, parseDuration} from 'amis-core';
import InputDateRange, {DateRangeControlSchema} from './InputDateRange';
import {DateRangePicker} from 'amis-ui';
import {supportStatic} from './StaticHoc';
import {isMobile} from 'amis-core';

/**
 * YearRange 年份范围控件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/input-year-range
 */
export interface YearRangeControlSchema
  extends Omit<DateRangeControlSchema, 'type'> {
  type: 'input-year-range';
}

export default class YearRangeControl extends InputDateRange {
  @supportStatic()
  render() {
    const {
      className,
      style,
      classPrefix: ns,
      minDate,
      maxDate,
      minDuration,
      maxDuration,
      data,
      format,
      useMobileUI,
      env,
      ...rest
    } = this.props;
    const mobileUI = useMobileUI && isMobile();

    return (
      <div className={cx(`${ns}DateRangeControl`, className)}>
        <DateRangePicker
          viewMode="years"
          format={format}
          useMobileUI={useMobileUI}
          classPrefix={ns}
          popOverContainer={
            mobileUI && env && env.getModalContainer
              ? env.getModalContainer
              : mobileUI
              ? undefined
              : rest.popOverContainer
          }
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
    inputFormat: 'YYYY',
    joinValues: true,
    delimiter: ',',
    timeFormat: '',
    /** shortcuts的兼容配置 */
    ranges: 'thisyear,prevyear',
    shortcuts: 'thisyear,prevyear',
    animation: true
  };
}

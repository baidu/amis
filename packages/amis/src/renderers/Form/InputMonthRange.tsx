import React from 'react';
import {FormItem} from 'amis-core';
import cx from 'classnames';
import {filterDate, parseDuration} from 'amis-core';
import InputDateRange, {DateRangeControlSchema} from './InputDateRange';
import {DateRangePicker} from 'amis-ui';
import {supportStatic} from './StaticHoc';
import {isMobile} from 'amis-core';

/**
 * MonthRange 月范围控件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/month-range
 */

export interface MonthRangeControlSchema
  extends Omit<DateRangeControlSchema, 'type'> {
  type: 'input-month-range';
}

export default class MonthRangeControl extends InputDateRange {
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
      mobileUI,
      valueFormat,
      inputFormat,
      displayFormat,
      env,
      ...rest
    } = this.props;

    return (
      <div className={cx(`${ns}DateRangeControl`, className)}>
        <DateRangePicker
          viewMode="months"
          mobileUI={mobileUI}
          valueFormat={valueFormat || format}
          displayFormat={displayFormat || inputFormat}
          classPrefix={ns}
          popOverContainer={
            mobileUI
              ? env?.getModalContainer
              : rest.popOverContainer || env.getModalContainer
          }
          popOverContainerSelector={rest.popOverContainerSelector}
          onRef={this.getRef}
          data={data}
          {...rest}
          minDate={
            minDate
              ? filterDate(minDate, data, valueFormat || format)
              : undefined
          }
          maxDate={
            maxDate
              ? filterDate(maxDate, data, valueFormat || format)
              : undefined
          }
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
    /** shortcuts的兼容配置 */
    ranges: '',
    shortcuts: 'thismonth,prevmonth',
    animation: true
  };
}

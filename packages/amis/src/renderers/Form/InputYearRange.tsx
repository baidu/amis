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
          viewMode="years"
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
  type: 'input-year-range'
})
export class YearRangeControlRenderer extends YearRangeControl {
  static defaultProps = {
    format: 'X',
    inputFormat: 'YYYY',
    joinValues: true,
    delimiter: ',',
    /** shortcuts的兼容配置 */
    ranges: 'thisyear,prevyear',
    shortcuts: 'thisyear,prevyear',
    animation: true
  };
}

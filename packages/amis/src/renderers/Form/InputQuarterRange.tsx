import React from 'react';
import {FormItem} from 'amis-core';
import cx from 'classnames';
import {filterDate, parseDuration} from 'amis-core';
import InputDateRange, {DateRangeControlSchema} from './InputDateRange';
import {DateRangePicker} from 'amis-ui';
import {supportStatic} from './StaticHoc';
import {isMobile} from 'amis-core';
/**
 * QuarterRange 季度范围控件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/input-quarter-range
 */
export interface QuarterRangeControlSchema
  extends Omit<DateRangeControlSchema, 'type'> {
  type: 'input-quarter-range';
}

export default class QuarterRangeControl extends InputDateRange {
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
      valueFormat,
      inputFormat,
      displayFormat,
      env,
      mobileUI,
      ...rest
    } = this.props;

    return (
      <div className={cx(`${ns}DateRangeControl`, className)}>
        <DateRangePicker
          viewMode="quarters"
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
  type: 'input-quarter-range'
})
export class QuarterRangeControlRenderer extends QuarterRangeControl {
  static defaultProps = {
    format: 'X',
    inputFormat: 'YYYY-[Q]Q',
    joinValues: true,
    delimiter: ',',
    /** shortcuts的兼容配置 */
    ranges: 'thisquarter,prevquarter',
    shortcuts: 'thisquarter,prevquarter',
    animation: true
  };
}

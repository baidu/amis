import React from 'react';
import {
  AMISSchemaBase,
  Renderer,
  RendererProps,
  normalizeDate
} from 'amis-core';
import moment from 'moment';
import {BaseSchema} from '../Schema';
import {getPropValue} from 'amis-core';

/**
 * DateRange 展示渲染器。
 */
/**
 * 日期范围展示组件，用于显示开始-结束时间段。
 */
export interface AMISDateRangeSchema extends AMISSchemaBase {
  /**
   * 指定为 date-range 组件
   */
  type: 'date-range';

  /**
   * 值的时间格式
   */
  valueFormat?: string;

  /**
   * 展示的时间格式
   */
  format?: string;

  /**
   * 展示的时间格式（新：同format）
   */
  displayFormat?: string;

  /**
   * 分割符
   */
  delimiter?: string;

  /**
   * 连接符
   */
  connector?: string;
}

export interface DateRangeProps
  extends RendererProps,
    Omit<AMISDateRangeSchema, 'type' | 'className'> {}

export class DateRangeField extends React.Component<DateRangeProps, Object> {
  refreshInterval: ReturnType<typeof setTimeout>;

  static defaultProps: Pick<
    DateRangeProps,
    'valueFormat' | 'format' | 'connector' | 'displayFormat'
  > = {
    format: 'YYYY-MM-DD',
    valueFormat: 'X',
    connector: '~'
  };

  render() {
    let {
      delimiter = ',',
      connector = '~',
      value,
      valueFormat,
      format = 'YYYY-MM-DD',
      displayFormat,
      classnames: cx,
      className,
      style
    } = this.props;

    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      value = value.split(delimiter);
    }
    let [startTime = '', endTime = ''] = value;

    if (valueFormat) {
      startTime = normalizeDate(startTime, valueFormat);
      endTime = normalizeDate(endTime, valueFormat);
    } else {
      startTime = normalizeDate(startTime * 1000);
      endTime = normalizeDate(endTime * 1000);
    }

    startTime = startTime?.isValid()
      ? startTime.format(displayFormat || format)
      : '';
    endTime = endTime?.isValid() ? endTime.format(displayFormat || format) : '';

    return (
      <span className={cx('DateRangeField', className)} style={style}>
        {[startTime, endTime].join(` ${connector} `)}
      </span>
    );
  }
}

@Renderer({
  type: 'date-range'
})
export class DateRangeFieldRenderer extends DateRangeField {}

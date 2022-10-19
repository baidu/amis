import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import moment from 'moment';
import {BaseSchema} from '../Schema';
import {getPropValue} from 'amis-core';

/**
 * DateRange 展示渲染器。
 */
export interface DateRangeSchema extends BaseSchema {
  /**
   * 指定为日期展示类型
   */
  type: 'date-range';

  /**
   * 值的时间格式，参考 moment 中的格式说明。
   */
  valueFormat?: string;

  /**
   * 展示的时间格式，参考 moment 中的格式说明。
   */
  format?: string;

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
    Omit<DateRangeSchema, 'type' | 'className'> {}

export class DateRangeField extends React.Component<DateRangeProps, Object> {
  refreshInterval: ReturnType<typeof setTimeout>;

  static defaultProps: Pick<
    DateRangeProps,
    'valueFormat'| 'format' | 'connector'
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
      classnames: cx,
      className
    } = this.props;

    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      value = value.split(delimiter);
    }
    let [startTime = '', endTime = ''] = value;

    if (valueFormat) {
      startTime = moment(startTime, valueFormat);
      endTime = moment(endTime, valueFormat);
    }
    else {
      startTime = moment(startTime * 1000);
      endTime = moment(endTime * 1000);
    }

    startTime = startTime.isValid() ? startTime.format(format) : '';
    endTime = endTime.isValid() ? endTime.format(format) : '';

    return (
      <span
        className={cx('DateRangeField', className)}
      >
        {[startTime, endTime].join(` ${connector} `)}
      </span>
    );
  }
}

@Renderer({
  type: 'date-range'
})
export class DateRangeFieldRenderer extends DateRangeField {};

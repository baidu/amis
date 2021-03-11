import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import {filterDate} from '../../utils/tpl-builtin';
import moment from 'moment';
import 'moment/locale/zh-cn';
import DatePicker from '../../components/DatePicker';

export interface DateBaseControlSchema extends FormBaseControl {
  /**
   * 指定为日期选择控件
   */
  type: 'date' | 'datetime' | 'time' | 'month' | 'quarter';

  /**
   * 是否显示清除按钮
   */
  clearable?: boolean;

  /**
   * 日期存储格式
   */
  format?: string;

  /**
   * 日期展示格式
   */
  inputFormat?: string;

  /**
   * 设定是否存储 utc 时间。
   */
  utc?: boolean;

  /**
   * 是否为内联模式？
   */
  emebed?: boolean;
}

/**
 * Date日期选择控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/date
 */
export interface DateControlSchema extends DateBaseControlSchema {
  /**
   * 指定为日期选择控件
   */
  type: 'date';

  /**
   * 日期存储格式
   * @default X
   */
  format?: string;

  /**
   * 日期展示格式
   * @default YYYY-MM-DD
   */
  inputFormat?: string;

  /**
   * 点选日期后是否关闭弹窗
   */
  closeOnSelect?: boolean;

  /**
   * 限制最小日期
   */
  minDate?: string;

  /**
   * 限制最大日期
   */
  maxDate?: string;
}

/**
 * Datetime日期时间选择控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/datetime
 */
export interface DateTimeControlSchema extends DateBaseControlSchema {
  /**
   * 指定为日期时间选择控件
   */
  type: 'datetime';

  /**
   * 日期存储格式
   * @default X
   */
  format?: string;

  /**
   * 日期展示格式
   * @default YYYY-MM-DD HH:mm
   */
  inputFormat?: string;

  /**
   * 时间的格式。
   *
   * @default HH:mm
   */
  timeFormat?: string;

  /**
   * 限制最小日期
   */
  minDate?: string;

  /**
   * 限制最大日期
   */
  maxDate?: string;

  /**
   * 不记得了
   */
  timeConstraints?: any;
}

/**
 * Time 时间选择控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/time
 */
export interface TimeControlSchema extends DateBaseControlSchema {
  /**
   * 指定为日期时间选择控件
   */
  type: 'time';

  /**
   * 日期存储格式
   * @default X
   */
  format?: string;

  /**
   * 日期展示格式
   * @default YYYY-MM-DD HH:mm
   */
  inputFormat?: string;

  /**
   * 时间的格式。
   *
   * @default HH:mm
   */
  timeFormat?: string;

  /**
   * 不记得了
   */
  timeConstraints?: any;
}

/**
 * Month 月份选择控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/Month
 */
export interface MonthControlSchema extends DateBaseControlSchema {
  /**
   * 指定为月份时间选择控件
   */
  type: 'month';

  /**
   * 月份存储格式
   * @default X
   */
  format?: string;

  /**
   * 月份展示格式
   * @default YYYY-MM
   */
  inputFormat?: string;
}

/**
 * 季度选择控件
 */
export interface QuarterControlSchema extends DateBaseControlSchema {
  /**
   * 指定为月份时间选择控件
   */
  type: 'quarter';

  /**
   * 月份存储格式
   * @default X
   */
  format?: string;

  /**
   * 月份展示格式
   * @default YYYY-MM
   */
  inputFormat?: string;
}

export interface DateProps extends FormControlProps {
  inputFormat?: string;
  timeFormat?: string;
  format?: string;
  timeConstraints?: {
    hours?: {
      min: number;
      max: number;
      step: number;
    };
    minutes?: {
      min: number;
      max: number;
      step: number;
    };
    seconds: {
      min: number;
      max: number;
      step: number;
    };
  };
  closeOnSelect?: boolean;
  disabled: boolean;
  iconClassName?: string;
  utc?: boolean; // 设定是否存储 utc 时间。
  minDate?: string;
  maxDate?: string;
}

interface DateControlState {
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
}

export default class DateControl extends React.PureComponent<
  DateProps,
  DateControlState
> {
  static defaultProps = {
    format: 'X',
    viewMode: 'days',
    inputFormat: 'YYYY-MM-DD',
    timeConstraints: {
      minutes: {
        step: 1
      }
    },
    clearable: true
  };

  componentWillMount() {
    const {
      minDate,
      maxDate,
      value,
      defaultValue,
      setPrinstineValue,
      data,
      format,
      utc
    } = this.props;

    if (defaultValue && value === defaultValue) {
      const date = filterDate(defaultValue, data, format);
      setPrinstineValue((utc ? moment.utc(date) : date).format(format));
    }

    this.setState({
      minDate: minDate ? filterDate(minDate, data, format) : undefined,
      maxDate: maxDate ? filterDate(maxDate, data, format) : undefined
    });
  }

  componentWillReceiveProps(nextProps: DateProps) {
    const props = this.props;

    if (props.defaultValue !== nextProps.defaultValue) {
      const date = filterDate(
        nextProps.defaultValue,
        nextProps.data,
        nextProps.format
      );
      nextProps.setPrinstineValue(
        (nextProps.utc ? moment.utc(date) : date).format(nextProps.format)
      );
    }

    if (
      props.minDate !== nextProps.minDate ||
      props.maxDate !== nextProps.maxDate ||
      props.data !== nextProps.data
    ) {
      this.setState({
        minDate: nextProps.minDate
          ? filterDate(nextProps.minDate, nextProps.data, this.props.format)
          : undefined,
        maxDate: nextProps.maxDate
          ? filterDate(nextProps.maxDate, nextProps.data, this.props.format)
          : undefined
      });
    }
  }

  render() {
    let {
      className,
      defaultValue,
      defaultData,
      classnames: cx,
      minDate,
      maxDate,
      type,
      format,
      timeFormat,
      ...rest
    } = this.props;

    if (type === 'time' && timeFormat) {
      format = timeFormat;
    }

    return (
      <div className={cx(`DateControl`, className)}>
        <DatePicker
          {...rest}
          timeFormat={timeFormat}
          format={format}
          {...this.state}
          classnames={cx}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'date',
  weight: -150
})
export class DateControlRenderer extends DateControl {
  static defaultProps = {
    ...DateControl.defaultProps,
    placeholder: 'Date.placeholder',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '',
    strictMode: false
  };
}

@FormItem({
  type: 'datetime'
})
export class DatetimeControlRenderer extends DateControl {
  static defaultProps = {
    ...DateControl.defaultProps,
    placeholder: 'DateTime.placeholder',
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    dateFormat: 'LL',
    timeFormat: 'HH:mm:ss',
    closeOnSelect: false,
    strictMode: false
  };
}

@FormItem({
  type: 'time'
})
export class TimeControlRenderer extends DateControl {
  static defaultProps = {
    ...DateControl.defaultProps,
    placeholder: 'Time.placeholder',
    inputFormat: 'HH:mm',
    dateFormat: '',
    timeFormat: 'HH:mm',
    viewMode: 'time',
    closeOnSelect: false
  };
}

@FormItem({
  type: 'month'
})
export class MonthControlRenderer extends DateControl {
  static defaultProps = {
    ...DateControl.defaultProps,
    placeholder: 'Month.placeholder',
    inputFormat: 'YYYY-MM',
    dateFormat: 'MM',
    timeFormat: '',
    viewMode: 'months',
    closeOnSelect: true
  };
}

@FormItem({
  type: 'quarter'
})
export class QuarterControlRenderer extends DateControl {
  static defaultProps = {
    ...DateControl.defaultProps,
    placeholder: 'Quarter.placeholder',
    inputFormat: 'YYYY [Q]Q',
    dateFormat: 'YYYY [Q]Q',
    timeFormat: '',
    viewMode: 'quarters',
    closeOnSelect: true
  };
}

@FormItem({
  type: 'year'
})
export class YearControlRenderer extends DateControl {
  static defaultProps = {
    ...DateControl.defaultProps,
    placeholder: 'Year.placeholder',
    inputFormat: 'YYYY',
    dateFormat: 'YYYY',
    timeFormat: '',
    viewMode: 'years',
    closeOnSelect: true
  };
}

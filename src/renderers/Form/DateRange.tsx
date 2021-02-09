import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import {filterDate, parseDuration} from '../../utils/tpl-builtin';
import moment from 'moment';
import 'moment/locale/zh-cn';
import DateRangePicker, {
  DateRangePicker as BaseDateRangePicker
} from '../../components/DateRangePicker';
import {anyChanged} from '../../utils/helper';

/**
 * DateRange 日期范围控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/date-range
 */
export interface DateRangeControlSchema extends FormBaseControl {
  /**
   * 指定为日期范围控件
   */
  type: 'date-range';

  /**
   * 分割符, 因为有两个值，开始时间和结束时间，所以要有连接符。默认为英文逗号。
   *
   */
  delimiter?: string;

  /**
   * 默认 `X` 即时间戳格式，用来提交的时间格式。更多格式类型请参考 moment.
   */
  format?: string;

  /**
   * 默认 `YYYY-MM-DD` 用来配置显示的时间格式。
   */
  inputFormat?: string;

  /**
   * 开启后将选中的选项 value 的值用连接符拼接起来，作为当前表单项的值。如： `value1,value2` 否则为 `[value1, value2]`
   */
  joinValues?: boolean;

  /**
   * 最大日期限制，支持变量 $xxx 来取值，或者用相对值如：* `-2mins` 2分钟前\n * `+2days` 2天后\n* `-10week` 十周前\n可用单位： `min`、`hour`、`day`、`week`、`month`、`year`。所有单位支持复数形式。
   */
  maxDate?: string;

  /**
   * 最小日期限制，支持变量 $xxx 来取值，或者用相对值如：* `-2mins` 2分钟前\n * `+2days` 2天后\n* `-10week` 十周前\n可用单位： `min`、`hour`、`day`、`week`、`month`、`year`。所有单位支持复数形式。
   */
  minDate?: string;

  /**
   * 最大跨度，比如 2days
   */
  maxDuration?: string;

  /**
   * 最小跨度，比如 2days
   */
  minDuration?: string;

  /**
   * 这里面 value 需要特殊说明一下，因为支持相对值。* `-2mins` 2分钟前\n * `+2days` 2天后\n* `-10week` 十周前\n可用单位： `min`、`hour`、`day`、`week`、`month`、`year`。所有单位支持复数形式。
   */
  value?: any;

  /**
   * 开启后变成非弹出模式，即内联模式。
   */
  embed?: boolean;
}

export interface DateRangeProps
  extends FormControlProps,
    Omit<
      DateRangeControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {
  delimiter: string;
  format: string;
  joinValues: boolean;
}

export default class DateRangeControl extends React.Component<DateRangeProps> {
  static defaultProps = {
    format: 'X',
    joinValues: true,
    delimiter: ','
  };

  componentWillMount() {
    const {
      defaultValue,
      setPrinstineValue,
      delimiter,
      format,
      data,
      value,
      joinValues,
      utc
    } = this.props;

    if (defaultValue && value === defaultValue) {
      let arr =
        typeof defaultValue === 'string'
          ? defaultValue.split(delimiter)
          : defaultValue;
      setPrinstineValue(
        BaseDateRangePicker.formatValue(
          {
            startDate: filterDate(arr[0], data, format),
            endDate: filterDate(arr[1], data, format)
          },
          format,
          joinValues,
          delimiter,
          utc
        )
      );
    }
  }

  componentDidUpdate(prevProps: DateRangeProps) {
    const {
      defaultValue,
      delimiter,
      joinValues,
      setPrinstineValue,
      data,
      utc,
      format
    } = this.props;

    if (prevProps.defaultValue !== defaultValue) {
      let arr =
        typeof defaultValue === 'string'
          ? defaultValue.split(delimiter)
          : defaultValue;

      setPrinstineValue(
        arr
          ? BaseDateRangePicker.formatValue(
              {
                startDate: filterDate(arr[0], data, format),
                endDate: filterDate(arr[1], data, format)
              },
              format,
              joinValues,
              delimiter,
              utc
            )
          : undefined
      );
    }
  }

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
      ...rest
    } = this.props;

    return (
      <div className={cx(`${ns}DateRangeControl`, className)}>
        <DateRangePicker
          {...rest}
          classPrefix={ns}
          data={data}
          format={format}
          minDate={minDate ? filterDate(minDate, data, format) : undefined}
          maxDate={maxDate ? filterDate(maxDate, data, format) : undefined}
          minDuration={minDuration ? parseDuration(minDuration) : undefined}
          maxDuration={maxDuration ? parseDuration(maxDuration) : undefined}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'date-range'
})
export class DateRangeControlRenderer extends DateRangeControl {
  static defaultProps = {
    ...DateRangeControl.defaultProps,
    timeFormat: ''
  };
}

@FormItem({
  type: 'datetime-range',
  sizeMutable: false
})
export class DateTimeRangeControlRenderer extends DateRangeControl {
  static defaultProps = {
    ...DateRangeControl.defaultProps,
    timeFormat: 'HH:mm',
    inputFormat: 'YYYY-MM-DD HH:mm'
  };
}

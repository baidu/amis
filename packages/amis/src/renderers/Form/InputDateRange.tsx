import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData
} from 'amis-core';
import cx from 'classnames';
import {filterDate, parseDuration} from 'amis-core';
import {DateRangePicker} from 'amis-ui';
import {isMobile, createObject, autobind} from 'amis-core';
import {ActionObject} from 'amis-core';
import type {ShortCuts} from 'amis-ui/lib/components/DatePicker';
import {FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
import type {TestIdBuilder} from 'amis-core';
/**
 * DateRange 日期范围控件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/date-range
 */
export interface DateRangeControlSchema extends FormBaseControlSchema {
  /**
   * 指定为日期范围控件
   */
  type: 'input-date-range' | 'input-datetime-range' | 'input-time-range';

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
   * 用来提交的时间格式。更多格式类型请参考 moment.（新：同format）
   */
  valueFormat?: string;

  /**
   * 默认 `YYYY-MM-DD` 用来配置显示的时间格式。
   */
  inputFormat?: string;

  /**
   * 用来配置显示的时间格式（新：同inputFormat）
   */
  displayFormat?: string;

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
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 开启后变成非弹出模式，即内联模式。
   */
  embed?: boolean;

  /**
   * 日期范围快捷键
   * @deprecated 3.1.0及以后版本废弃，建议用 shortcuts 属性。
   */
  ranges?: string | Array<ShortCuts>;

  /**
   * 日期范围快捷键
   */
  shortcuts?: string | Array<ShortCuts>;

  /**
   * 日期范围开始时间-占位符
   */
  startPlaceholder?: string;

  /**
   * 日期范围结束时间-占位符
   */
  endPlaceholder?: string;

  /**
   * 是否启用游标动画，默认开启
   */
  animation?: boolean;

  /**
   * 日期数据处理函数，用来处理选择日期之后的的值
   *
   * (value: moment.Moment, config: {type: 'start' | 'end'; originValue: moment.Moment, timeFormat: string}, props: any, data: any, moment: moment) => moment.Moment;
   */
  transform?: string;

  /**
   * 弹窗容器选择器
   */
  popOverContainerSelector?: string;
}

export interface DateRangeProps
  extends FormControlProps,
    Omit<
      DateRangeControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {
  delimiter: string;
  format: string;
  valueFormat: string;
  joinValues: boolean;
  testIdBuilder?: TestIdBuilder;
}

export default class DateRangeControl extends React.Component<DateRangeProps> {
  static defaultProps = {
    format: 'X',
    joinValues: true,
    delimiter: ',',
    animation: true
  };

  dateRef?: any;

  constructor(props: DateRangeProps) {
    super(props);

    const {
      defaultValue,
      setPrinstineValue,
      delimiter,
      format,
      valueFormat,
      data,
      value,
      joinValues,
      utc
    } = props;

    if (defaultValue && value === defaultValue) {
      let arr =
        typeof defaultValue === 'string'
          ? defaultValue.split(delimiter)
          : defaultValue;
      setPrinstineValue(
        DateRangePicker.formatValue(
          {
            startDate: filterDate(arr[0], data, valueFormat || format),
            endDate: filterDate(arr[1], data, valueFormat || format)
          },
          valueFormat || format,
          joinValues,
          delimiter,
          utc
        )
      );
    }
    // todo 支持值格式的自动纠正
  }

  componentDidUpdate(prevProps: DateRangeProps) {
    const {
      defaultValue,
      delimiter,
      joinValues,
      setPrinstineValue,
      data,
      utc,
      format,
      valueFormat
    } = this.props;
    if (prevProps.defaultValue !== defaultValue) {
      let arr =
        typeof defaultValue === 'string'
          ? defaultValue.split(delimiter)
          : defaultValue;

      setPrinstineValue(
        arr
          ? DateRangePicker.formatValue(
              {
                startDate: filterDate(arr[0], data, valueFormat || format),
                endDate: filterDate(arr[1], data, valueFormat || format)
              },
              valueFormat || format,
              joinValues,
              delimiter,
              utc
            )
          : undefined
      );
    }
  }

  @autobind
  getRef(ref: any) {
    while (ref && ref.getWrappedInstance) {
      ref = ref.getWrappedInstance();
    }
    this.dateRef = ref;
  }

  // 派发有event的事件
  @autobind
  dispatchEvent(eventName: string) {
    const {dispatchEvent, data, value} = this.props;

    dispatchEvent(eventName, resolveEventData(this.props, {value}));
  }

  // 动作
  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {resetValue} = this.props;

    if (action.actionType === 'clear') {
      this.dateRef?.clear();
      return;
    }

    if (action.actionType === 'reset' && resetValue) {
      this.dateRef?.reset();
    }
  }

  setData(value: any) {
    const {data, delimiter, valueFormat, format, joinValues, utc, onChange} =
      this.props;

    if (typeof value === 'string') {
      let arr = typeof value === 'string' ? value.split(delimiter) : value;
      value = DateRangePicker.formatValue(
        {
          startDate: filterDate(arr[0], data, valueFormat || format),
          endDate: filterDate(arr[1], data, valueFormat || format)
        },
        valueFormat || format,
        joinValues,
        delimiter,
        utc
      );
    }

    onChange(value);
  }

  // 值的变化
  @autobind
  async handleChange(nextValue: any) {
    const {dispatchEvent, data} = this.props;
    const dispatcher = dispatchEvent(
      'change',
      resolveEventData(this.props, {value: nextValue})
    );
    // 因为前面没有 await，所以这里的 dispatcher.prevented 是不准确的。
    // 为什么没写 onChange，我估计是不能让 onChange 太慢执行
    // if (dispatcher?.prevented) {
    //   return;
    // }
    this.props.onChange(nextValue);
  }

  @supportStatic()
  render() {
    const {
      className,
      style,
      classPrefix: ns,
      defaultValue,
      defaultData,
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

    const comptType = this.props?.type;

    return (
      <div
        className={cx(
          `${ns}DateRangeControl`,
          {
            'is-date': /date-/.test(comptType),
            'is-datetime': /datetime-/.test(comptType)
          },
          className
        )}
      >
        <DateRangePicker
          {...rest}
          mobileUI={mobileUI}
          classPrefix={ns}
          popOverContainer={
            mobileUI
              ? env?.getModalContainer
              : rest.popOverContainer || env.getModalContainer
          }
          popOverContainerSelector={rest.popOverContainerSelector}
          onRef={this.getRef}
          data={data}
          valueFormat={valueFormat || format}
          displayFormat={displayFormat || inputFormat}
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
          minDateRaw={minDate}
          maxDateRaw={maxDate}
          minDuration={minDuration ? parseDuration(minDuration) : undefined}
          maxDuration={maxDuration ? parseDuration(maxDuration) : undefined}
          onChange={this.handleChange}
          onFocus={() => this.dispatchEvent('focus')}
          onBlur={() => this.dispatchEvent('blur')}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'input-date-range'
})
export class DateRangeControlRenderer extends DateRangeControl {
  static defaultProps = {
    ...DateRangeControl.defaultProps
  };
}

@FormItem({
  type: 'input-datetime-range',
  sizeMutable: false
})
export class DateTimeRangeControlRenderer extends DateRangeControl {
  static defaultProps = {
    ...DateRangeControl.defaultProps,
    inputFormat: 'YYYY-MM-DD HH:mm'
  };
}

@FormItem({
  type: 'input-time-range',
  sizeMutable: false
})
export class TimeRangeControlRenderer extends DateRangeControl {
  static defaultProps = {
    ...DateRangeControl.defaultProps,
    format: 'HH:mm',
    inputFormat: 'HH:mm',
    viewMode: 'time',
    /** shortcuts的兼容配置 */
    ranges: '',
    shortcuts: ''
  };
}

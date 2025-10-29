import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData,
  getVariable
} from 'amis-core';
import cx from 'classnames';
import {filterDate, parseDuration} from 'amis-core';
import {DateRangePicker} from 'amis-ui';
import {isMobile, createObject, autobind} from 'amis-core';
import {ActionObject} from 'amis-core';
import type {ShortCuts} from 'amis-ui/lib/components/DatePicker';
import {FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
import type {AMISFormItem, TestIdBuilder} from 'amis-core';

export interface AMISDateRangeSchemaBase extends AMISFormItem {
  /**
   * 分隔符
   */
  delimiter?: string;

  /**
   * 存储格式
   * @default X
   */
  format?: string;

  /**
   * 存储格式（新版）
   */
  valueFormat?: string;

  /**
   * 显示格式
   * @default YYYY-MM-DD
   */
  inputFormat?: string;

  /**
   * 显示格式（新版）
   */
  displayFormat?: string;

  /**
   * 是否拼接值
   */
  joinValues?: boolean;

  /**
   * 最大日期
   */
  maxDate?: string;

  /**
   * 最小日期
   */
  minDate?: string;

  /**
   * 最大跨度
   */
  maxDuration?: string;

  /**
   * 最小跨度
   */
  minDuration?: string;

  /**
   * 默认值
   */
  value?: any;

  /**
   * 边框模式
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 是否为内联模式
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
   * 开始时间占位符
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
   * 日期数据处理函数，用来处理选择日期之后的值
   *
   * (value: moment.Moment, config: {type: 'start' | 'end'; originValue: moment.Moment, timeFormat: string}, props: any, data: any, moment: moment) => moment.Moment;
   */
  transform?: string;

  /**
   * 弹窗容器选择器
   */
  popOverContainerSelector?: string;
}

/**
 * DateRange 日期范围控件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/date-range
 */
/**
 * 日期范围控件，支持选择开始和结束日期，可配置快捷键、占位符、时间格式等，适用于表单中的时间段选择
 */
export interface AMISInputDateRangeSchema extends AMISDateRangeSchemaBase {
  /**
   * 指定为日期范围控件
   */
  type: 'input-date-range' | 'input-datetime-range' | 'input-time-range';
}

export interface DateRangeProps
  extends FormControlProps,
    Omit<
      AMISInputDateRangeSchema,
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
    const {resetValue, formStore, store, name} = this.props;

    if (action.actionType === 'clear') {
      this.dateRef?.clear();
      return;
    }

    if (action.actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      this.dateRef?.reset(pristineVal);
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

import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData,
  str2function,
  normalizeDate,
  getVariable
} from 'amis-core';
import cx from 'classnames';
import {filterDate, isPureVariable, resolveVariableAndFilter} from 'amis-core';
import moment from 'moment';
import {DatePicker} from 'amis-ui';
import {FormBaseControlSchema, SchemaObject} from '../../Schema';
import {createObject, anyChanged, isMobile, autobind} from 'amis-core';
import {ActionObject} from 'amis-core';
import {supportStatic} from './StaticHoc';

import type {ShortCuts} from 'amis-ui/lib/components/DatePicker';

export interface InputDateBaseControlSchema extends FormBaseControlSchema {
  /**
   * 指定为日期选择控件
   */
  type:
    | 'input-date'
    | 'input-datetime'
    | 'input-time'
    | 'input-month'
    | 'input-quarter'
    | 'input-year';

  /**
   * 是否显示清除按钮
   */
  clearable?: boolean;

  /**
   * 日期存储格式
   */
  format?: string;

  /**
   * 替代format
   */
  valueFormat?: string;

  /**
   * 日期展示格式
   */
  inputFormat?: string;

  /**
   * 日期展示格式(新：替代inputFormat)
   */
  displayFormat?: string;
  /**
   * 设定是否存储 utc 时间。
   */
  utc?: boolean;

  /**
   * 是否为内联模式？
   */
  emebed?: boolean;

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 日期快捷键
   */
  shortcuts?: string | ShortCuts[];

  /**
   * 字符串函数，用来决定是否禁用某个日期。
   *
   * (currentDate: moment.Moment, props: any) => boolean;
   */
  disabledDate?: string;

  /* * 是否禁止输入
   */
  inputForbid?: boolean;
}

/**
 * Date日期选择控件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/date
 */
export interface DateControlSchema extends InputDateBaseControlSchema {
  /**
   * 指定为日期选择控件
   */
  type: 'input-date';

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
   * 替代format
   */
  valueFormat?: string;

  /**
   * 日期展示格式(新：替代inputFormat)
   */
  displayFormat?: string;

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

  /**
   * 弹窗容器选择器
   */
  popOverContainerSelector?: string;
}

/**
 * Datetime日期时间选择控件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/datetime
 */
export interface DateTimeControlSchema extends InputDateBaseControlSchema {
  /**
   * 指定为日期时间选择控件
   */
  type: 'input-datetime';

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
   * 替代format
   */
  valueFormat?: string;

  /**
   * 日期展示格式(新：替代inputFormat)
   */
  displayFormat?: string;

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
   * 时间输入范围限制
   */
  timeConstraints?: any;

  /**
   * 是否为结束时间，如果是，那么会自动加上 23:59:59
   */
  isEndDate?: boolean;
}

/**
 * Time 时间选择控件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/time
 */
export interface TimeControlSchema extends InputDateBaseControlSchema {
  /**
   * 指定为日期时间选择控件
   */
  type: 'input-time';

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
   * 替代format
   */
  valueFormat?: string;

  /**
   * 日期展示格式(新：替代inputFormat)
   */
  displayFormat?: string;

  /**
   * 时间的格式。
   *
   * @default HH:mm
   */
  timeFormat?: string;

  /**
   * 时间输入范围限制
   */
  timeConstraints?: any;
}

/**
 * Month 月份选择控件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/Month
 */
export interface MonthControlSchema extends InputDateBaseControlSchema {
  /**
   * 指定为月份时间选择控件
   */
  type: 'input-month';

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

  /**
   * 替代format
   */
  valueFormat?: string;

  /**
   * 日期展示格式(新：替代inputFormat)
   */
  displayFormat?: string;
}

/**
 * 季度选择控件
 */
export interface QuarterControlSchema extends InputDateBaseControlSchema {
  /**
   * 指定为月份时间选择控件
   */
  type: 'input-quarter';

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

  /**
   * 替代format
   */
  valueFormat?: string;

  /**
   * 日期展示格式(新：替代inputFormat)
   */
  displayFormat?: string;
}

/**
 * 年份选择控件
 */
export interface YearControlSchema extends InputDateBaseControlSchema {
  /**
   * 指定为月份时间选择控件
   */
  type: 'input-year';

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

  /**
   * 替代format
   */
  valueFormat?: string;

  /**
   * 日期展示格式(新：替代inputFormat)
   */
  displayFormat?: string;
}

export interface DateProps extends FormControlProps {
  inputFormat?: string;
  timeFormat?: string;
  format?: string;
  valueFormat?: string;
  displayFormat?: string;
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
  schedules?: Array<{
    startTime: Date;
    endTime: Date;
    content: any;
    className?: string;
  }>;
}

export default class DateControl extends React.PureComponent<
  DateProps,
  DateControlState
> {
  placeholder: string = '';
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

  dateRef?: any;

  constructor(props: DateProps) {
    super(props);

    const {
      minDate,
      maxDate,
      value,
      defaultValue,
      setPrinstineValue,
      data,
      format,
      valueFormat,
      utc,
      changeMotivation
    } = props;

    if (defaultValue && value === defaultValue) {
      const date = filterDate(defaultValue, data, valueFormat || format);
      setPrinstineValue(
        (utc ? moment.utc(date) : date).format(valueFormat || format)
      );
    } else if (changeMotivation === 'formulaChanged' && defaultValue && value) {
      const date = normalizeDate(value, valueFormat || format);
      if (date && date.format(valueFormat || format) !== value) {
        setPrinstineValue(date.format(valueFormat || format));
      }
    }

    let schedulesData = props.schedules;
    if (typeof schedulesData === 'string') {
      const resolved = resolveVariableAndFilter(schedulesData, data, '| raw');
      if (Array.isArray(resolved)) {
        schedulesData = resolved;
      }
    }

    this.state = {
      minDate: minDate
        ? filterDate(minDate, data, valueFormat || format)
        : undefined,
      maxDate: maxDate
        ? filterDate(maxDate, data, valueFormat || format)
        : undefined,
      schedules: schedulesData
    };
  }

  componentDidUpdate(prevProps: DateProps) {
    const props = this.props;

    if (prevProps.defaultValue !== props.defaultValue) {
      const date = filterDate(
        props.defaultValue,
        props.data,
        props.valueFormat || props.format
      );
      props.setPrinstineValue(
        (props.utc ? moment.utc(date) : date).format(
          props.valueFormat || props.format
        )
      );
    }

    if (
      prevProps.minDate !== props.minDate ||
      prevProps.maxDate !== props.maxDate ||
      prevProps.data !== props.data
    ) {
      this.setState({
        minDate: props.minDate
          ? filterDate(
              props.minDate,
              props.data,
              this.props.valueFormat || this.props.format
            )
          : undefined,
        maxDate: props.maxDate
          ? filterDate(
              props.maxDate,
              props.data,
              this.props.valueFormat || this.props.format
            )
          : undefined
      });
    }

    if (
      anyChanged(['schedules', 'data'], prevProps, props) &&
      typeof props.schedules === 'string' &&
      isPureVariable(props.schedules)
    ) {
      const schedulesData = resolveVariableAndFilter(
        props.schedules,
        props.data,
        '| raw'
      );
      const preSchedulesData = resolveVariableAndFilter(
        prevProps.schedules,
        prevProps.data,
        '| raw'
      );
      if (Array.isArray(schedulesData) && preSchedulesData !== schedulesData) {
        this.setState({
          schedules: schedulesData
        });
      }
    }
  }

  // 日程点击事件
  onScheduleClick(scheduleData: any) {
    const {scheduleAction, onAction, data, translate: __} = this.props;
    const defaultscheduleAction = {
      actionType: 'dialog',
      dialog: {
        title: __('Schedule'),
        actions: [],
        closeOnEsc: true,
        body: {
          type: 'table',
          columns: [
            {
              name: 'time',
              label: __('Time')
            },
            {
              name: 'content',
              label: __('Content')
            }
          ],
          data: '${scheduleData}'
        }
      }
    };

    onAction &&
      onAction(
        null,
        scheduleAction || defaultscheduleAction,
        createObject(data, scheduleData)
      );
  }

  @autobind
  getRef(ref: any) {
    while (ref && ref.getWrappedInstance) {
      ref = ref.getWrappedInstance();
    }
    this.dateRef = ref;
  }

  focus() {
    this.dateRef?.focus?.();
  }

  // 派发有event的事件
  @autobind
  dispatchEvent(e: string | React.MouseEvent<any>) {
    const {dispatchEvent, value} = this.props;
    dispatchEvent(e, resolveEventData(this.props, {value}));
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
    const {data, valueFormat, format, utc, onChange} = this.props;

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      value instanceof Date
    ) {
      const date = filterDate(value as any, data, valueFormat || format);
      value = (utc ? moment.utc(date) : date).format(valueFormat || format);
    }

    onChange(value);
  }

  // 值的变化
  @autobind
  async handleChange(nextValue: any) {
    const {dispatchEvent} = this.props;
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

  // 点击日期事件
  @autobind
  async handleClick(date: moment.Moment) {
    const {dispatchEvent, utc, valueFormat, format} = this.props;
    dispatchEvent(
      'click',
      resolveEventData(this.props, {
        value: (utc ? moment.utc(date) : date).format(valueFormat || format)
      })
    );
  }

  // 鼠标移入日期事件
  @autobind
  async handleMouseEnter(date: moment.Moment) {
    const {dispatchEvent, utc, valueFormat, format} = this.props;
    dispatchEvent(
      'mouseenter',
      resolveEventData(this.props, {
        value: (utc ? moment.utc(date) : date).format(valueFormat || format)
      })
    );
  }

  // 鼠标移出日期事件
  @autobind
  async handleMouseLeave(date: moment.Moment) {
    const {dispatchEvent, utc, valueFormat, format} = this.props;
    dispatchEvent(
      'mouseleave',
      resolveEventData(this.props, {
        value: (utc ? moment.utc(date) : date).format(valueFormat || format)
      })
    );
  }

  @autobind
  isDisabledDate(currentDate: moment.Moment) {
    const {disabledDate} = this.props;
    const fn =
      typeof disabledDate === 'string'
        ? str2function(disabledDate, 'currentDate', 'props')
        : disabledDate;

    if (typeof fn === 'function') {
      return fn(currentDate, this.props);
    }

    return false;
  }

  @supportStatic()
  render() {
    let {
      className,
      style,
      defaultValue,
      defaultData,
      classnames: cx,
      minDate,
      maxDate,
      type,
      format,
      timeFormat,
      valueFormat,
      env,
      largeMode,
      render,
      mobileUI,
      placeholder,
      ...rest
    } = this.props;

    if (type === 'time' && timeFormat) {
      valueFormat = format = timeFormat;
    }

    return (
      <div
        className={cx(
          `DateControl`,
          {
            'is-date': /date$/.test(type),
            'is-datetime': /datetime$/.test(type)
          },
          className
        )}
      >
        <DatePicker
          {...rest}
          env={env}
          placeholder={placeholder ?? this.placeholder}
          mobileUI={mobileUI}
          popOverContainer={
            mobileUI
              ? env?.getModalContainer
              : rest.popOverContainer || env.getModalContainer
          }
          popOverContainerSelector={rest.popOverContainerSelector}
          {...this.state}
          valueFormat={valueFormat || format}
          minDateRaw={this.props.minDate}
          maxDateRaw={this.props.maxDate}
          classnames={cx}
          onRef={this.getRef}
          schedules={this.state.schedules}
          largeMode={largeMode}
          onScheduleClick={this.onScheduleClick.bind(this)}
          onChange={this.handleChange}
          onFocus={this.dispatchEvent}
          onBlur={this.dispatchEvent}
          disabledDate={this.isDisabledDate}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'input-date',
  weight: -150
})
export class DateControlRenderer extends DateControl {
  placeholder = this.props.translate('Date.placeholder');
  static defaultProps = {
    ...DateControl.defaultProps,
    strictMode: false
  };
}

@FormItem({
  type: 'input-datetime'
})
export class DatetimeControlRenderer extends DateControl {
  placeholder = this.props.translate('DateTime.placeholder');
  static defaultProps = {
    ...DateControl.defaultProps,
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    closeOnSelect: true,
    strictMode: false
  };
}

@FormItem({
  type: 'input-time'
})
export class TimeControlRenderer extends DateControl {
  placeholder = this.props.translate('Time.placeholder');
  static defaultProps = {
    ...DateControl.defaultProps,
    inputFormat: 'HH:mm',
    viewMode: 'time',
    closeOnSelect: true
  };
}

@FormItem({
  type: 'input-month'
})
export class MonthControlRenderer extends DateControl {
  placeholder = this.props.translate('Month.placeholder');
  static defaultProps = {
    ...DateControl.defaultProps,
    inputFormat: 'YYYY-MM',
    viewMode: 'months',
    closeOnSelect: true,
    strictMode: false
  };
}

@FormItem({
  type: 'input-quarter'
})
export class QuarterControlRenderer extends DateControl {
  placeholder = this.props.translate('Quarter.placeholder');
  static defaultProps = {
    ...DateControl.defaultProps,
    inputFormat: 'YYYY [Q]Q',
    viewMode: 'quarters',
    closeOnSelect: true,
    strictMode: false
  };
}

@FormItem({
  type: 'input-year'
})
export class YearControlRenderer extends DateControl {
  placeholder = this.props.translate('Year.placeholder');
  static defaultProps = {
    ...DateControl.defaultProps,
    inputFormat: 'YYYY',
    viewMode: 'years',
    closeOnSelect: true,
    strictMode: false
  };
}

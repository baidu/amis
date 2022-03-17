import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import {
  filterDate,
  isPureVariable,
  resolveVariableAndFilter
} from '../../utils/tpl-builtin';
import moment from 'moment';
import 'moment/locale/zh-cn';
import DatePicker from '../../components/DatePicker';
import {SchemaObject} from '../../Schema';
import {createObject, anyChanged, isMobile, autobind} from '../../utils/helper';
import {Action} from '../../types';

export interface InputDateBaseControlSchema extends FormBaseControl {
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

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';
}

/**
 * Date日期选择控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/date
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
}

export interface DateProps extends FormControlProps {
  inputFormat?: string;
  timeFormat?: string;
  format?: string;
  valueFormat?: string;
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

  ref: React.RefObject<DatePicker>;

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
      utc
    } = props;

    this.ref = React.createRef();

    if (defaultValue && value === defaultValue) {
      const date = filterDate(defaultValue, data, format);
      setPrinstineValue((utc ? moment.utc(date) : date).format(format));
    }

    let schedulesData = props.schedules;
    if (typeof schedulesData === 'string') {
      const resolved = resolveVariableAndFilter(schedulesData, data, '| raw');
      if (Array.isArray(resolved)) {
        schedulesData = resolved;
      }
    }

    this.state = {
      minDate: minDate ? filterDate(minDate, data, format) : undefined,
      maxDate: maxDate ? filterDate(maxDate, data, format) : undefined,
      schedules: schedulesData
    };
  }

  componentDidUpdate(prevProps: DateProps) {
    const props = this.props;

    if (prevProps.defaultValue !== props.defaultValue) {
      const date = filterDate(props.defaultValue, props.data, props.format);
      props.setPrinstineValue(
        (props.utc ? moment.utc(date) : date).format(props.format)
      );
    }

    if (
      prevProps.minDate !== props.minDate ||
      prevProps.maxDate !== props.maxDate ||
      prevProps.data !== props.data
    ) {
      this.setState({
        minDate: props.minDate
          ? filterDate(props.minDate, props.data, this.props.format)
          : undefined,
        maxDate: props.maxDate
          ? filterDate(props.maxDate, props.data, this.props.format)
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

  // 派发有event的事件
  @autobind
  dispatchEvent(e: React.SyntheticEvent<HTMLElement>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  // 动作
  doAction(action: Action, data: object, throwErrors: boolean) {
    const {resetValue, onChange} = this.props;
    const current = this.ref?.current;
    if (action.actionType === 'clear') {
      onChange('');
      current.setState({inputValue: ''});
      return;
    }

    if (action.actionType === 'reset' && resetValue) {
      current.handleChange(moment(resetValue));
    }
  }

  // 值的变化
  @autobind
  async handleChange(nextValue: any) {
    const {dispatchEvent, data} = this.props;
    const dispatcher = dispatchEvent('change', createObject(data, nextValue));
    if (dispatcher?.prevented) {
      return;
    }
    this.props.onChange(nextValue);
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
      valueFormat,
      env,
      largeMode,
      render,
      useMobileUI,
      ...rest
    } = this.props;

    if (type === 'time' && timeFormat) {
      format = timeFormat;
    }

    const mobileUI = useMobileUI && isMobile();

    return (
      <div className={cx(`DateControl`, className)}>
        <DatePicker
          forwardRef={this.ref}
          {...rest}
          useMobileUI={useMobileUI}
          popOverContainer={
            mobileUI && env && env.getModalContainer
              ? env.getModalContainer
              : mobileUI
              ? undefined
              : rest.popOverContainer
          }
          timeFormat={timeFormat}
          format={valueFormat || format}
          {...this.state}
          classnames={cx}
          schedules={this.state.schedules}
          largeMode={largeMode}
          onScheduleClick={this.onScheduleClick.bind(this)}
          onChange={this.handleChange}
          onFocus={this.dispatchEvent}
          onBlur={this.dispatchEvent}
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
  static defaultProps = {
    ...DateControl.defaultProps,
    placeholder: 'Date.placeholder',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '',
    strictMode: false
  };
}

@FormItem({
  type: 'input-datetime'
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
  type: 'input-time'
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
  type: 'input-month'
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
  type: 'input-quarter'
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
  type: 'input-year'
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

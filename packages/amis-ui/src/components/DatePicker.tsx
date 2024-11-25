/**
 * @file DatePicker
 * @description 时间选择器组件
 * @author fex
 */

import React from 'react';
import moment from 'moment';
import {Icon} from './icons';
import {
  normalizeDate,
  PopOver,
  isExpression,
  FormulaExec,
  filterDate,
  string2regExp,
  autobind
} from 'amis-core';
import PopUp from './PopUp';
import {Overlay} from 'amis-core';
import {themeable, ThemeProps} from 'amis-core';
import Calendar from './calendar/Calendar';
import {localeable, LocaleProps, TranslateFn} from 'amis-core';
import {ucFirst} from 'amis-core';
import CalendarMobile from './CalendarMobile';
import Input from './Input';
import Button from './Button';

import type {Moment} from 'moment';
import type {PlainObject, RendererEnv, TestIdBuilder} from 'amis-core';
import type {ChangeEventViewMode, MutableUnitOfTime} from './calendar/Calendar';

const availableShortcuts: {[propName: string]: any} = {
  now: {
    label: 'Date.now',
    date: (now: moment.Moment) => {
      return now;
    }
  },
  today: {
    label: 'Date.today',
    date: (now: moment.Moment) => {
      return now.startOf('day');
    }
  },

  yesterday: {
    label: 'Date.yesterday',
    date: (now: moment.Moment) => {
      return now.add(-1, 'days').startOf('day');
    }
  },

  thisweek: {
    label: 'Date.monday',
    date: (now: moment.Moment) => {
      return now.startOf('week').startOf('day');
    }
  },

  thismonth: {
    label: 'Date.startOfMonth',
    date: (now: moment.Moment) => {
      return now.startOf('month');
    }
  },

  prevmonth: {
    label: 'Date.startOfLastMonth',
    date: (now: moment.Moment) => {
      return now.startOf('month').add(-1, 'month');
    }
  },

  prevquarter: {
    label: 'Date.startOfLastQuarter',
    date: (now: moment.Moment) => {
      return now.startOf('quarter').add(-1, 'quarter');
    }
  },

  thisquarter: {
    label: 'Date.startOfQuarter',
    date: (now: moment.Moment) => {
      return now.startOf('quarter');
    }
  },

  tomorrow: {
    label: 'Date.tomorrow',
    date: (now: moment.Moment) => {
      return now.add(1, 'days').startOf('day');
    }
  },

  endofthisweek: {
    label: 'Date.endOfWeek',
    date: (now: moment.Moment) => {
      return now.endOf('week');
    }
  },

  endofthismonth: {
    label: 'Date.endOfMonth',
    date: (now: moment.Moment) => {
      return now.endOf('month');
    }
  },

  endoflastmonth: {
    label: 'Date.endOfLastMonth',
    date: (now: moment.Moment) => {
      return now.add(-1, 'month').endOf('month');
    }
  }
};

const advancedShortcuts = [
  {
    regexp: /^(\d+)hoursago$/,
    resolve: (__: TranslateFn, _: string, hours: string) => {
      return {
        label: __('Date.hoursago', {hours}),
        date: (now: moment.Moment) => {
          return now.subtract(hours, 'hours');
        }
      };
    }
  },
  {
    regexp: /^(\d+)hourslater$/,
    resolve: (__: TranslateFn, _: string, hours: string) => {
      return {
        label: __('Date.hourslater', {hours}),
        date: (now: moment.Moment) => {
          return now.add(hours, 'hours');
        }
      };
    }
  },
  {
    regexp: /^(\d+)daysago$/,
    resolve: (__: TranslateFn, _: string, days: string) => {
      return {
        label: __('Date.daysago', {days}),
        date: (now: moment.Moment) => {
          return now.subtract(days, 'days');
        }
      };
    }
  },
  {
    regexp: /^(\d+)dayslater$/,
    resolve: (__: TranslateFn, _: string, days: string) => {
      return {
        label: __('Date.dayslater', {days}),
        date: (now: moment.Moment) => {
          return now.add(days, 'days');
        }
      };
    }
  },
  {
    regexp: /^(\d+)weeksago$/,
    resolve: (__: TranslateFn, _: string, weeks: string) => {
      return {
        label: __('Date.weeksago', {weeks}),
        date: (now: moment.Moment) => {
          return now.subtract(weeks, 'weeks');
        }
      };
    }
  },
  {
    regexp: /^(\d+)weekslater$/,
    resolve: (__: TranslateFn, _: string, weeks: string) => {
      return {
        label: __('Date.weekslater', {weeks}),
        date: (now: moment.Moment) => {
          return now.add(weeks, 'weeks');
        }
      };
    }
  },
  {
    regexp: /^(\d+)monthsago$/,
    resolve: (__: TranslateFn, _: string, months: string) => {
      return {
        label: __('Date.monthsago', {months}),
        date: (now: moment.Moment) => {
          return now.subtract(months, 'months');
        }
      };
    }
  },
  {
    regexp: /^(\d+)monthslater$/,
    resolve: (__: TranslateFn, _: string, months: string) => {
      return {
        label: __('Date.monthslater', {months}),
        date: (now: moment.Moment) => {
          return now.add(months, 'months');
        }
      };
    }
  },
  {
    regexp: /^(\d+)quartersago$/,
    resolve: (__: TranslateFn, _: string, quarters: string) => {
      return {
        label: __('Date.quartersago', {quarters}),
        date: (now: moment.Moment) => {
          return now.subtract(quarters, 'quarters');
        }
      };
    }
  },
  {
    regexp: /^(\d+)quarterslater$/,
    resolve: (__: TranslateFn, _: string, quarters: string) => {
      return {
        label: __('Date.quarterslater', {quarters}),
        date: (now: moment.Moment) => {
          return now.add(quarters, 'quarters');
        }
      };
    }
  }
];

const dateFormats = {
  Y: {format: 'YYYY'},
  Q: {format: 'YYYY [Q]Q'},
  M: {format: 'YYYY-MM'},
  D: {format: 'YYYY-MM-DD'}
} as Record<string, {format: string}>;

const timeFormats = {
  h: {format: 'HH'},
  H: {format: 'HH'},
  m: {format: 'mm'},
  s: {format: 'ss'},
  S: {format: 'ss'}
} as Record<string, {format: string}>;

export type ShortCutDate = {
  label: string;
  /** 支持表达式 */
  date: moment.Moment | string;
};

export type ShortCutDateRange = {
  label: string;
  startDate?: moment.Moment | string;
  endDate?: moment.Moment | string;
};

export type ShortCuts =
  | {
      label: string;
      value: string;
    }
  | ShortCutDate
  | ShortCutDateRange;

export interface DateProps extends LocaleProps, ThemeProps {
  viewMode: 'years' | 'months' | 'days' | 'time' | 'quarters';
  className?: string;
  popoverClassName?: string;
  placeholder?: string;
  inputFormat?: string;
  displayFormat?: string;
  timeFormat?: string;
  format?: string;
  valueFormat?: string;
  closeOnSelect: boolean;
  disabled?: boolean;
  /* * 是否禁止输入
   */
  inputForbid?: boolean;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  minDateRaw?: string;
  maxDateRaw?: string;
  clearable?: boolean;
  defaultValue?: any;
  utc?: boolean;
  onChange: (value: any) => void;
  value?: any;
  shortcuts: string | Array<ShortCuts>;
  overlayPlacement: string;
  // minTime?: moment.Moment;
  // maxTime?: moment.Moment;
  dateFormat?: string;
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
  popOverContainer?: any;
  popOverContainerSelector?: string;
  label?: string | false;
  borderMode?: 'full' | 'half' | 'none';
  // 是否为内嵌模式，如果开启就不是 picker 了，直接页面点选。
  embed?: boolean;
  schedules?: Array<{
    startTime: Date;
    endTime: Date;
    content: any;
    className?: string;
  }>;
  scheduleClassNames?: Array<string>;
  env?: RendererEnv;
  largeMode?: boolean;
  todayActiveStyle?: React.CSSProperties;
  onScheduleClick?: (scheduleData: any) => void;
  // 在移动端日期展示有多种形式，一种是picker 滑动选择，一种是日历展开选择，mobileCalendarMode为calendar表示日历展开选择
  mobileCalendarMode?: 'picker' | 'calendar';

  // 下面那个千万不要写，写了就会导致 keyof DateProps 得到的结果是 string | number;
  // [propName: string]: any;
  onFocus?: Function;
  onBlur?: Function;
  onRef?: any;
  data?: any;

  // 是否为结束时间
  isEndDate?: boolean;
  testIdBuilder?: TestIdBuilder;

  disabledDate?: (date: moment.Moment) => any;
  onClick?: (date: moment.Moment) => any;
  onMouseEnter?: (date: moment.Moment) => any;
  onMouseLeave?: (date: moment.Moment) => any;
}

export interface DatePickerState {
  isOpened: boolean;
  isFocused: boolean;
  value: moment.Moment | undefined;
  inputValue: string | undefined; // 手动输入的值
  curTimeFormat: string; // 根据displayFormat / inputFormat 计算展示的时间粒度
  curDateFormat: string; // 根据displayFormat / inputFormat 计算展示的日期粒度
  isModified: boolean;
}

export class DatePicker extends React.Component<DateProps, DatePickerState> {
  static defaultProps = {
    viewMode: 'days' as 'years' | 'months' | 'days' | 'time',
    shortcuts: '',
    closeOnSelect: true,
    overlayPlacement: 'auto',
    scheduleClassNames: [
      'bg-warning',
      'bg-danger',
      'bg-success',
      'bg-info',
      'bg-secondary'
    ]
  };

  constructor(props: DateProps) {
    super(props);
    this.inputRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.selectShortcut = this.selectShortcut.bind(this);
    this.checkIsValidDate = this.checkIsValidDate.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.getParent = this.getParent.bind(this);
    this.getTarget = this.getTarget.bind(this);
    this.handlePopOverClick = this.handlePopOverClick.bind(this);
    this.renderShortCuts = this.renderShortCuts.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);

    const {
      value,
      format,
      valueFormat,
      displayFormat,
      inputFormat,
      dateFormat,
      timeFormat
    } = this.props;

    let curDateFormat = dateFormat ?? '';
    let curTimeFormat = timeFormat ?? '';
    let curTimeFormatArr = [] as string[];

    !dateFormat &&
      Object.keys(dateFormats).forEach((item: string) => {
        if ((displayFormat || inputFormat)?.includes(item)) {
          curDateFormat = dateFormats[item].format;
        }
      });
    !timeFormat &&
      Object.keys(timeFormats).forEach((item: string) => {
        if ((displayFormat || inputFormat)?.includes(item)) {
          curTimeFormatArr.push(timeFormats[item].format);
        }
      });
    curTimeFormat = curTimeFormatArr.length
      ? curTimeFormatArr.join(':')
      : curTimeFormat;

    this.state = {
      isOpened: false,
      isFocused: false,
      value: normalizeDate(value, valueFormat || format),
      inputValue:
        normalizeDate(value, valueFormat || format)?.format(
          displayFormat || inputFormat
        ) || '',
      curTimeFormat,
      curDateFormat,
      isModified: false
    } as DatePickerState;
  }

  dom: HTMLDivElement;

  inputRef: React.RefObject<HTMLInputElement>;
  // 缓存上一次的input值
  inputValueCache: string;

  componentDidMount() {
    this.props?.onRef?.(this);
    const {
      value,
      format,
      valueFormat,
      inputFormat,
      displayFormat,
      dateFormat,
      timeFormat
    } = this.props;
    if (value) {
      let valueCache = normalizeDate(value, valueFormat || format);
      this.inputValueCache =
        valueCache?.format(displayFormat || inputFormat) || '';
    }

    let curDateFormat = dateFormat ?? '';
    let curTimeFormat = timeFormat ?? '';
    let curTimeFormatArr = [] as string[];

    !dateFormat &&
      Object.keys(dateFormats).forEach((item: string) => {
        if ((displayFormat || inputFormat)?.includes(item)) {
          curDateFormat = dateFormats[item].format;
        }
      });
    !timeFormat &&
      Object.keys(timeFormats).forEach((item: string) => {
        if ((displayFormat || inputFormat)?.includes(item)) {
          curTimeFormatArr.push(timeFormats[item].format);
        }
      });
    curTimeFormat = curTimeFormatArr.length
      ? curTimeFormatArr.join(':')
      : curTimeFormat;

    this.setState({curDateFormat, curTimeFormat});
  }

  componentDidUpdate(prevProps: DateProps) {
    const props = this.props;

    const prevValue = prevProps.value;

    if (prevValue !== props.value) {
      const newState: any = {
        value: normalizeDate(props.value, props.valueFormat || props.format, {
          utc: props.utc
        })
      };

      newState.inputValue =
        newState.value?.format(
          this.props.displayFormat || this.props.inputFormat
        ) || '';
      this.inputValueCache = newState.inputValue;

      this.setState(newState);
    }
  }

  isConfirmMode() {
    const {closeOnSelect, embed, mobileUI} = this.props;
    const {curTimeFormat} = this.state;

    /** 日期时间选择器才支持confirm */
    return closeOnSelect === false && !!curTimeFormat && !embed && !mobileUI;
  }

  focus() {
    if (!this.dom) {
      return;
    }

    this.dom.focus();
  }

  handleFocus(e: React.SyntheticEvent<HTMLDivElement>) {
    this.setState({
      isFocused: true
    });
    const {onFocus} = this.props;
    onFocus && onFocus(e);
  }

  handleBlur(e: React.SyntheticEvent<HTMLDivElement>) {
    const targetElement = (e.nativeEvent as FocusEvent).relatedTarget;
    if (targetElement === this.dom || targetElement === this.inputRef.current) {
      return;
    }
    this.setState({
      isFocused: false
    });
    const {onBlur} = this.props;
    onBlur && onBlur(e);
  }

  handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === ' ') {
      this.handleClick();
      e.preventDefault();
    }
  }

  handleClick() {
    this.state.isOpened ? this.close() : this.open();
  }

  handlePopOverClick(e: React.MouseEvent<any>) {
    e.stopPropagation();
    e.preventDefault();
  }

  open(fn?: () => void) {
    if (this.props.disabled) {
      return;
    }
    this.setState(
      {
        isOpened: true
      },
      fn
    );
    const input = this.inputRef.current;
    input && input.focus();
  }

  close() {
    const isConfirmMode = this.isConfirmMode();

    if (isConfirmMode) {
      const {value, valueFormat, format, displayFormat, inputFormat} =
        this.props;

      this.setState({
        value: normalizeDate(value, valueFormat || format),
        inputValue:
          normalizeDate(value, valueFormat || format)?.format(
            displayFormat || inputFormat
          ) || ''
      });
    }

    this.setState({isOpened: false, isModified: false});
  }

  clearValue(e: React.MouseEvent<any>) {
    e.preventDefault();
    e.stopPropagation();
    const onChange = this.props.onChange;
    onChange('');
    this.setState({inputValue: '', isModified: false});
  }

  // 清空
  clear() {
    const onChange = this.props.onChange;
    onChange('');
    this.setState({inputValue: '', isModified: false});
  }

  // 重置
  reset(resetValue?: any) {
    if (!resetValue) {
      return;
    }
    const {format, valueFormat, inputFormat, displayFormat, onChange} =
      this.props;
    onChange(resetValue);
    this.setState({
      inputValue: normalizeDate(resetValue, valueFormat || format)?.format(
        displayFormat || inputFormat || ''
      ),
      isModified: false
    });
  }

  /**
   * 如果为日期时间选择器，则单独处理时间选择事件，点击确认的时候才触发onChange
   */
  @autobind
  handleConfirm() {
    const {
      onChange,
      format,
      valueFormat,
      minDate,
      maxDate,
      inputFormat,
      displayFormat,
      utc
    } = this.props;
    let value = this.state.value;
    const isConfirmMode = this.isConfirmMode();

    if (!isConfirmMode || !value) {
      return;
    }

    if (minDate && value && value.isBefore(minDate, 'second')) {
      value = minDate;
    } else if (maxDate && value && value.isAfter(maxDate, 'second')) {
      value = maxDate;
    }

    onChange(
      utc
        ? moment.utc(value).format(valueFormat || format)
        : value.format(valueFormat || format)
    );

    this.setState({
      inputValue: utc
        ? moment.utc(value).format(displayFormat || inputFormat)
        : value.format(displayFormat || inputFormat),
      isOpened: false,
      isModified: true
    });
  }

  handleChange(value: Moment, viewMode?: ChangeEventViewMode) {
    const {
      onChange,
      format,
      valueFormat,
      minDate,
      maxDate,
      inputFormat,
      displayFormat,
      closeOnSelect,
      utc,
      value: defaultValue
    } = this.props;
    const {curDateFormat, curTimeFormat, isModified} = this.state;
    const isConfirmMode = this.isConfirmMode();

    if (!moment.isMoment(value)) {
      return;
    }

    if (minDate && value && value.isBefore(minDate, 'second')) {
      value = minDate;
    } else if (maxDate && value && value.isAfter(maxDate, 'second')) {
      value = maxDate;
    }

    //  这段逻辑会导致视图上看着选择了0，但实际上是选择了当前时间
    /** 首次选择且当前未绑定值，则默认使用当前时间 */
    // if (!defaultValue && !!curTimeFormat && !isModified) {
    //   const now = moment();
    //   const timePart: Record<MutableUnitOfTime, number> = {
    //     date: value.get('date'),
    //     hour: value.get('hour'),
    //     minute: value.get('minute'),
    //     second: value.get('second'),
    //     millisecond: value.get('millisecond')
    //   };

    //   Object.keys(timePart).forEach((unit: MutableUnitOfTime) => {
    //     /** 首次选择时间，日期使用当前时间; 将未设置过的时间字段设置为当前值 */
    //     if (
    //       (unit === 'date' && viewMode === 'time') ||
    //       (unit !== 'date' && timePart[unit] === 0)
    //     ) {
    //       timePart[unit] = now.get(unit);
    //     }
    //   });

    //   value.set(timePart);
    // }

    const updatedValue = utc
      ? moment.utc(value).format(valueFormat || format)
      : value.format(valueFormat || format);
    const updatedInputValue = value.format(displayFormat || inputFormat);

    if (isConfirmMode) {
      this.setState({value, inputValue: updatedInputValue});
      this.inputValueCache = updatedInputValue;
    } else {
      onChange(updatedValue);

      if (closeOnSelect && curDateFormat && !curTimeFormat) {
        this.close();
      }

      this.setState({inputValue: updatedInputValue});
    }
    this.setState({isModified: true});
  }

  // 手动输入日期
  inputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {
      onChange,
      inputFormat,
      format,
      displayFormat,
      valueFormat,
      utc,
      minDate,
      maxDate
    } = this.props;
    const value = e.currentTarget.value;
    this.setState({inputValue: value});
    if (value === '') {
      onChange('');
    } else {
      // 将输入的格式转成正则匹配，比如 YYYY-MM-DD HH:mm:ss 改成 \d\d\d\d\-
      // 只有匹配成功才更新
      const inputCheckRegex = new RegExp(
        (inputFormat || displayFormat)!
          .replace(/[ymdhs]/gi, '\\d')
          .replace(/-/gi, '\\-')
      );

      if (inputCheckRegex.test(value)) {
        const newDate = moment(value, displayFormat || inputFormat);
        const dateValue = utc
          ? moment.utc(newDate).format(valueFormat || format)
          : newDate.format(valueFormat || format);

        // 判断大小值是否是合法的日期，并且当前日期在范围内
        const isMinDateValid = minDate?.isValid()
          ? newDate.isSameOrAfter(minDate)
          : true;
        const isMaxDateValid = maxDate?.isValid()
          ? newDate.isSameOrBefore(maxDate)
          : true;
        // 小于 0 的日期丢弃
        if (!dateValue.startsWith('-') && isMinDateValid && isMaxDateValid) {
          onChange(dateValue);
        }
      }
    }
  }

  onInputBlur() {
    this.setState({
      inputValue: this.inputValueCache
    });
  }

  selectShortcut(shortcut: any) {
    const {closeOnSelect, minDateRaw, maxDateRaw, data, format, valueFormat} =
      this.props;
    const now = moment();
    /** minDate和maxDate要实时计算，因为用户可能设置为${NOW()}，暂时不考虑毫秒级的时间差 */
    const minDate = minDateRaw
      ? filterDate(minDateRaw, data, valueFormat || format)
      : undefined;
    const maxDate = maxDateRaw
      ? filterDate(maxDateRaw, data, valueFormat || format)
      : undefined;
    let date = shortcut.date(now.clone());

    if (minDate && moment.isMoment(minDate) && minDate?.isValid()) {
      date = moment.max(date, minDate);
    }

    if (maxDate && moment.isMoment(maxDate) && maxDate?.isValid()) {
      date = moment.min(maxDate, date);
    }

    this.handleChange(date);
    closeOnSelect && this.close();
  }

  checkIsValidDate(currentDate: moment.Moment) {
    const {minDate, maxDate, disabledDate} = this.props;

    if (minDate && currentDate.isBefore(minDate, 'day')) {
      return false;
    } else if (maxDate && currentDate.isAfter(maxDate, 'day')) {
      return false;
    }

    if (typeof disabledDate === 'function') {
      return !disabledDate(currentDate);
    }

    return true;
  }

  getTarget() {
    return this.dom;
  }

  getParent() {
    return this.dom;
  }

  domRef = (ref: HTMLDivElement) => {
    this.dom = ref;
  };

  getAvailableShortcuts(key: string) {
    if (availableShortcuts[key]) {
      return availableShortcuts[key];
    }

    const __ = this.props.translate;

    for (let i = 0, len = advancedShortcuts.length; i < len; i++) {
      let item = advancedShortcuts[i];
      const m = item.regexp.exec(key);

      if (m) {
        return item.resolve.apply(item, [__, ...m]);
      }
    }

    return null;
  }

  renderShortCuts(shortcuts: string | Array<ShortCuts>) {
    if (!shortcuts) {
      return null;
    }
    const {
      classPrefix: ns,
      classnames: cx,
      translate: __,
      format,
      valueFormat,
      data
    } = this.props;
    let shortcutArr: Array<string | ShortCuts>;

    if (typeof shortcuts === 'string') {
      shortcutArr = shortcuts.split(',');
    } else {
      shortcutArr = shortcuts;
    }

    return (
      <ul className={cx(`DatePicker-shortcuts`)}>
        {shortcutArr.map((item, index) => {
          if (!item) {
            return null;
          }

          let shortcut: PlainObject = {};

          if (typeof item === 'string') {
            shortcut = this.getAvailableShortcuts(item);
            shortcut.key = item;
          } else if ((item as ShortCutDate).date) {
            const shortcutRaw = {...item} as ShortCutDate;

            shortcut = {
              ...item,
              date: () => {
                const date = isExpression(shortcutRaw.date)
                  ? moment(
                      FormulaExec['formula'](shortcutRaw.date, data),
                      valueFormat || format
                    )
                  : shortcutRaw.date;

                return date && moment.isMoment(date) && date?.isValid()
                  ? date
                  : (item as ShortCutDate).date;
              }
            };
          }
          return (
            <li
              className={cx(`DatePicker-shortcut`)}
              onClick={() => this.selectShortcut(shortcut)}
              key={index}
            >
              <a>{__(shortcut.label)}</a>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const {
      classPrefix: ns,
      classnames: cx,
      className,
      popoverClassName,
      value,
      placeholder,
      disabled,
      inputFormat,
      displayFormat,
      dateFormat,
      timeFormat,
      viewMode,
      timeConstraints,
      popOverContainer,
      popOverContainerSelector,
      clearable,
      shortcuts,
      utc,
      isEndDate,
      overlayPlacement,
      locale,
      format,
      valueFormat,
      borderMode,
      embed,
      minDate,
      mobileUI,
      maxDate,
      schedules,
      largeMode,
      scheduleClassNames,
      todayActiveStyle,
      onScheduleClick,
      mobileCalendarMode,
      label,
      env,
      testIdBuilder,
      onClick,
      onMouseEnter,
      onMouseLeave,
      inputForbid,
      closeOnSelect
    } = this.props;

    const __ = this.props.translate;
    const {curTimeFormat, curDateFormat, isOpened} = this.state;
    const isConfirmMode = this.isConfirmMode();
    let date: moment.Moment | undefined = this.state.value;
    let isConfirmBtnDisbaled = false;

    if (isConfirmMode) {
      const lastModifiedValue = normalizeDate(value, valueFormat || format);

      isConfirmBtnDisbaled =
        date && lastModifiedValue
          ? moment(date).isSame(lastModifiedValue, 'second')
          : date === lastModifiedValue;
    }

    const calendarMobile = (
      <CalendarMobile
        isDatePicker={true}
        timeFormat={curTimeFormat}
        displayForamt={displayFormat || inputFormat}
        startDate={date}
        defaultDate={date}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat={curDateFormat}
        embed={embed}
        viewMode={viewMode}
        close={this.close}
        confirm={this.handleChange}
        footerExtra={this.renderShortCuts(shortcuts)}
        showViewMode={
          viewMode === 'quarters' || viewMode === 'months' ? 'years' : 'months'
        }
        timeConstraints={timeConstraints}
        isEndDate={isEndDate}
      />
    );
    const CalendarMobileTitle = (
      <div className={`${ns}CalendarMobile-title`}>
        {label && typeof label === 'string' ? label : __('Calendar.datepicker')}
      </div>
    );
    const useCalendarMobile =
      mobileUI && ['days', 'months', 'quarters'].indexOf(viewMode) > -1;

    if (embed) {
      let schedulesData: DateProps['schedules'] = undefined;
      if (schedules && Array.isArray(schedules)) {
        // 设置日程颜色
        let index = 0;
        schedulesData = schedules.map((schedule: any) => {
          let className = schedule.className;
          if (!className && scheduleClassNames) {
            className = scheduleClassNames[index];
            index++;
            if (index >= scheduleClassNames.length) {
              index = 0;
            }
          }
          return {
            ...schedule,
            className
          };
        });
      }
      return (
        <div
          className={cx(
            `DateCalendar`,
            {
              'is-disabled': disabled,
              'ScheduleCalendar': schedulesData,
              'ScheduleCalendar-large': largeMode
            },
            className
          )}
        >
          <Calendar
            value={date}
            onChange={this.handleChange}
            requiredConfirm={false}
            dateFormat={curDateFormat}
            timeFormat={curTimeFormat}
            isValidDate={this.checkIsValidDate}
            viewMode={viewMode}
            timeConstraints={timeConstraints}
            input={false}
            onClose={this.close}
            locale={locale}
            minDate={minDate}
            maxDate={maxDate}
            // utc={utc}
            schedules={schedulesData}
            env={env}
            largeMode={largeMode}
            todayActiveStyle={todayActiveStyle}
            onScheduleClick={onScheduleClick}
            embed={embed}
            mobileUI={mobileUI}
            isEndDate={isEndDate}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            testIdBuilder={testIdBuilder?.getChild('calendar')}
          />
        </div>
      );
    }

    return (
      <div
        tabIndex={0}
        onKeyPress={this.handleKeyPress}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={cx(
          `DatePicker`,
          {
            'is-disabled': disabled,
            'is-focused': !disabled && this.state.isFocused,
            [`DatePicker--border${ucFirst(borderMode)}`]: borderMode,
            'is-mobile': mobileUI
          },
          className
        )}
        ref={this.domRef}
        onClick={this.handleClick}
        {...testIdBuilder?.getTestId()}
      >
        <Input
          className={cx('DatePicker-input')}
          onChange={this.inputChange}
          onBlur={this.onInputBlur}
          ref={this.inputRef}
          placeholder={placeholder}
          autoComplete="off"
          value={this.state.inputValue || ''}
          disabled={disabled}
          readOnly={mobileUI || inputForbid}
          {...testIdBuilder?.getChild('input').getTestId()}
        />

        {clearable &&
        !disabled &&
        normalizeDate(value, valueFormat || format) ? (
          <a
            className={cx(`DatePicker-clear`)}
            onClick={this.clearValue}
            {...testIdBuilder?.getChild('clear').getTestId()}
          >
            <Icon icon="input-clear" className="icon" />
          </a>
        ) : null}

        <a
          className={cx(`DatePicker-toggler`)}
          {...testIdBuilder?.getChild('toggler').getTestId()}
        >
          <Icon
            icon={viewMode === 'time' ? 'clock' : 'date'}
            className="icon"
            iconContent={
              viewMode === 'time'
                ? 'DatePicker-toggler-clock'
                : 'DatePicker-toggler-date'
            }
          />
        </a>

        {!mobileUI && isOpened ? (
          <Overlay
            target={this.getTarget}
            container={popOverContainer || this.getParent}
            containerSelector={popOverContainerSelector}
            rootClose={false}
            placement={overlayPlacement}
            show
          >
            <PopOver
              classPrefix={ns}
              className={cx(`DatePicker-popover`, popoverClassName)}
              onHide={this.close}
              overlay
              testIdBuilder={testIdBuilder?.getChild('popover')}
              onClick={this.handlePopOverClick}
            >
              {this.renderShortCuts(shortcuts)}

              <Calendar
                value={date}
                onChange={this.handleChange}
                requiredConfirm={viewMode === 'time'}
                dateFormat={curDateFormat}
                displayForamt={displayFormat || inputFormat}
                timeFormat={curTimeFormat}
                isValidDate={this.checkIsValidDate}
                viewMode={viewMode}
                timeConstraints={timeConstraints}
                input={false}
                onClose={this.close}
                locale={locale}
                minDate={minDate}
                maxDate={maxDate}
                mobileUI={mobileUI}
                isEndDate={isEndDate}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                testIdBuilder={testIdBuilder?.getChild('calendar')}
                // utc={utc}
              />
              {isConfirmMode ? (
                <div className={`${ns}DateRangePicker-actions`}>
                  <Button size="sm" onClick={this.close}>
                    {__('cancel')}
                  </Button>
                  <Button
                    level="primary"
                    size="sm"
                    disabled={isConfirmBtnDisbaled}
                    className={cx('m-l-sm')}
                    onClick={this.handleConfirm}
                  >
                    {__('confirm')}
                  </Button>
                </div>
              ) : null}
            </PopOver>
          </Overlay>
        ) : null}
        {mobileUI ? (
          mobileCalendarMode === 'calendar' && useCalendarMobile ? (
            <PopUp
              isShow={isOpened}
              className={cx(`${ns}CalendarMobile-pop`)}
              onHide={this.close}
              header={CalendarMobileTitle}
            >
              {calendarMobile}
            </PopUp>
          ) : (
            <PopUp
              className={cx(`${ns}DatePicker-popup DatePicker-mobile`)}
              container={popOverContainer}
              isShow={isOpened}
              showClose={false}
              onHide={this.handleClick}
            >
              <Calendar
                value={date}
                onChange={this.handleChange}
                requiredConfirm={false}
                dateFormat={curDateFormat}
                displayForamt={displayFormat || inputFormat}
                timeFormat={curTimeFormat}
                isValidDate={this.checkIsValidDate}
                viewMode={viewMode}
                timeConstraints={timeConstraints}
                input={false}
                onClose={this.close}
                locale={locale}
                minDate={minDate}
                maxDate={maxDate}
                mobileUI={mobileUI}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                testIdBuilder={testIdBuilder?.getChild('calendar')}
                // utc={utc}
              />
            </PopUp>
          )
        ) : null}
      </div>
    );
  }
}

export default themeable(localeable(DatePicker));

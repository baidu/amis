/**
 * @file DateRangePicker
 * @description 自定义日期范围时间选择器组件
 * @author fex
 */

import React from 'react';
import moment from 'moment';
import {findDOMNode} from 'react-dom';
import {Icon} from './icons';
import {Overlay} from 'amis-core';
import {ShortCuts, ShortCutDateRange} from './DatePicker';
import Calendar from './calendar/Calendar';
import {PopOver} from 'amis-core';
import PopUp from './PopUp';
import {ClassNamesFn, themeable, ThemeProps} from 'amis-core';
import type {PlainObject} from 'amis-core';
import {isMobile, noop, ucFirst} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import CalendarMobile from './CalendarMobile';
import Input from './Input';

export interface DateRangePickerProps extends ThemeProps, LocaleProps {
  className?: string;
  popoverClassName?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  theme?: any;
  format: string;
  utc?: boolean;
  inputFormat?: string;
  ranges?: string | Array<ShortCuts>;
  clearable?: boolean;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  minDuration?: moment.Duration;
  maxDuration?: moment.Duration;
  joinValues: boolean;
  delimiter: string;
  value?: any;
  onChange: (value: any) => void;
  data?: any;
  disabled?: boolean;
  closeOnSelect?: boolean;
  overlayPlacement: string;
  timeFormat?: string;
  resetValue?: any;
  popOverContainer?: any;
  dateFormat?: string;
  embed?: boolean;
  viewMode?: 'days' | 'months' | 'years' | 'time' | 'quarters';
  borderMode?: 'full' | 'half' | 'none';
  useMobileUI?: boolean;
  onFocus?: Function;
  onBlur?: Function;
  type?: string;
  onRef?: any;
  label?: string | false;
}

export interface DateRangePickerState {
  isOpened: boolean;
  isFocused: boolean;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  oldStartDate?: moment.Moment;
  oldEndDate?: moment.Moment;
  editState?: 'start' | 'end'; // 编辑开始时间还是结束时间
  startInputValue?: string;
  endInputValue?: string;
  endDateOpenedFirst: boolean;
}

export const availableRanges: {[propName: string]: any} = {
  'today': {
    label: 'Date.today',
    startDate: (now: moment.Moment) => {
      return now.startOf('day');
    },
    endDate: (now: moment.Moment) => {
      return now;
    }
  },

  'yesterday': {
    label: 'Date.yesterday',
    startDate: (now: moment.Moment) => {
      return now.add(-1, 'days').startOf('day');
    },
    endDate: (now: moment.Moment) => {
      return now.add(-1, 'days').endOf('day');
    }
  },

  'tomorrow': {
    label: 'Date.tomorrow',
    startDate: (now: moment.Moment) => {
      return now.add(1, 'days').startOf('day');
    },
    endDate: (now: moment.Moment) => {
      return now.add(1, 'days').endOf('day');
    }
  },

  // 兼容一下错误的用法
  '1daysago': {
    label: 'DateRange.1daysago',
    startDate: (now: moment.Moment) => {
      return now.add(-1, 'days');
    },
    endDate: (now: moment.Moment) => {
      return now;
    }
  },

  '1dayago': {
    label: 'DateRange.1daysago',
    startDate: (now: moment.Moment) => {
      return now.add(-1, 'days');
    },
    endDate: (now: moment.Moment) => {
      return now;
    }
  },

  '7daysago': {
    label: 'DateRange.7daysago',
    startDate: (now: moment.Moment) => {
      return now.add(-7, 'days').startOf('day');
    },
    endDate: (now: moment.Moment) => {
      return now.add(-1, 'days').endOf('day');
    }
  },

  '30daysago': {
    label: 'DateRange.30daysago',
    startDate: (now: moment.Moment) => {
      return now.add(-30, 'days').startOf('day');
    },
    endDate: (now: moment.Moment) => {
      return now.add(-1, 'days').endOf('day');
    }
  },

  '90daysago': {
    label: 'DateRange.90daysago',
    startDate: (now: moment.Moment) => {
      return now.add(-90, 'days').startOf('day');
    },
    endDate: (now: moment.Moment) => {
      return now.add(-1, 'days').endOf('day');
    }
  },

  'prevweek': {
    label: 'DateRange.lastWeek',
    startDate: (now: moment.Moment) => {
      return now.startOf('week').add(-1, 'weeks');
    },
    endDate: (now: moment.Moment) => {
      return now.startOf('week').add(-1, 'days').endOf('day');
    }
  },

  'thisweek': {
    label: 'DateRange.thisWeek',
    startDate: (now: moment.Moment) => {
      return now.startOf('week');
    },
    endDate: (now: moment.Moment) => {
      return now.endOf('week');
    }
  },

  'thismonth': {
    label: 'DateRange.thisMonth',
    startDate: (now: moment.Moment) => {
      return now.startOf('month');
    },
    endDate: (now: moment.Moment) => {
      return now.endOf('month');
    }
  },

  'thisquarter': {
    label: 'DateRange.thisQuarter',
    startDate: (now: moment.Moment) => {
      return now.startOf('quarter');
    },
    endDate: (now: moment.Moment) => {
      return now.endOf('quarter');
    }
  },

  'prevmonth': {
    label: 'DateRange.lastMonth',
    startDate: (now: moment.Moment) => {
      return now.startOf('month').add(-1, 'month');
    },
    endDate: (now: moment.Moment) => {
      return now.startOf('month').add(-1, 'day').endOf('day');
    }
  },

  'prevquarter': {
    label: 'DateRange.lastQuarter',
    startDate: (now: moment.Moment) => {
      return now.startOf('quarter').add(-1, 'quarter');
    },
    endDate: (now: moment.Moment) => {
      return now.startOf('quarter').add(-1, 'day').endOf('day');
    }
  },

  'thisyear': {
    label: 'DateRange.thisYear',
    startDate: (now: moment.Moment) => {
      return now.startOf('year');
    },
    endDate: (now: moment.Moment) => {
      return now.endOf('year');
    }
  },

  // 兼容一下之前的用法 'lastYear'
  'prevyear': {
    label: 'DateRange.lastYear',
    startDate: (now: moment.Moment) => {
      return now.startOf('year').add(-1, 'year');
    },
    endDate: (now: moment.Moment) => {
      return now.endOf('year').add(-1, 'year').endOf('day');
    }
  },

  'lastYear': {
    label: 'DateRange.lastYear',
    startDate: (now: moment.Moment) => {
      return now.startOf('year').add(-1, 'year');
    },
    endDate: (now: moment.Moment) => {
      return now.endOf('year').add(-1, 'year').endOf('day');
    }
  }
};

export const advancedRanges = [
  {
    regexp: /^(\d+)hoursago$/,
    resolve: (__: any, _: string, hours: string) => {
      return {
        label: __('DateRange.hoursago', {hours}),
        startDate: (now: moment.Moment) => {
          return now.add(-hours, 'hours').startOf('hour');
        },
        endDate: (now: moment.Moment) => {
          return now.add(-1, 'hours').endOf('hours');
        }
      };
    }
  },
  {
    regexp: /^(\d+)hourslater$/,
    resolve: (__: any, _: string, hours: string) => {
      return {
        label: __('DateRange.hourslater', {hours}),
        startDate: (now: moment.Moment) => {
          return now.startOf('hour');
        },
        endDate: (now: moment.Moment) => {
          return now.add(hours, 'hours').endOf('hour');
        }
      };
    }
  },
  {
    regexp: /^(\d+)daysago$/,
    resolve: (__: any, _: string, days: string) => {
      return {
        label: __('DateRange.daysago', {days}),
        startDate: (now: moment.Moment) => {
          return now.add(-days, 'days').startOf('day');
        },
        endDate: (now: moment.Moment) => {
          return now.add(-1, 'days').endOf('day');
        }
      };
    }
  },
  {
    regexp: /^(\d+)dayslater$/,
    resolve: (__: any, _: string, days: string) => {
      return {
        label: __('DateRange.dayslater', {days}),
        startDate: (now: moment.Moment) => {
          return now.startOf('day');
        },
        endDate: (now: moment.Moment) => {
          return now.add(days, 'days').endOf('day');
        }
      };
    }
  },
  {
    regexp: /^(\d+)weeksago$/,
    resolve: (__: any, _: string, weeks: string) => {
      return {
        label: __('DateRange.weeksago', {weeks}),
        startDate: (now: moment.Moment) => {
          return now.startOf('week').add(-weeks, 'weeks');
        },
        endDate: (now: moment.Moment) => {
          return now.startOf('week').add(-1, 'days').endOf('day');
        }
      };
    }
  },
  {
    regexp: /^(\d+)weekslater$/,
    resolve: (__: any, _: string, weeks: string) => {
      return {
        label: __('DateRange.weekslater', {weeks}),
        startDate: (now: moment.Moment) => {
          return now.startOf('week');
        },
        endDate: (now: moment.Moment) => {
          return now.startOf('week').add(weeks, 'weeks').endOf('day');
        }
      };
    }
  },
  {
    regexp: /^(\d+)monthsago$/,
    resolve: (__: any, _: string, months: string) => {
      return {
        label: __('DateRange.monthsago', {months}),
        startDate: (now: moment.Moment) => {
          return now.startOf('months').add(-months, 'months');
        },
        endDate: (now: moment.Moment) => {
          return now.startOf('month').add(-1, 'days').endOf('day');
        }
      };
    }
  },
  {
    regexp: /^(\d+)monthslater$/,
    resolve: (__: any, _: string, months: string) => {
      return {
        label: __('DateRange.monthslater', {months}),
        startDate: (now: moment.Moment) => {
          return now.startOf('month');
        },
        endDate: (now: moment.Moment) => {
          return now.startOf('month').add(months, 'months').endOf('day');
        }
      };
    }
  },
  {
    regexp: /^(\d+)quartersago$/,
    resolve: (__: any, _: string, quarters: string) => {
      return {
        label: __('DateRange.quartersago', {quarters}),
        startDate: (now: moment.Moment) => {
          return now.startOf('quarters').add(-quarters, 'quarters');
        },
        endDate: (now: moment.Moment) => {
          return now.startOf('quarter').add(-1, 'days').endOf('day');
        }
      };
    }
  },
  {
    regexp: /^(\d+)quarterslater$/,
    resolve: (__: any, _: string, quarters: string) => {
      return {
        label: __('DateRange.quarterslater', {quarters}),
        startDate: (now: moment.Moment) => {
          return now.startOf('quarter');
        },
        endDate: (now: moment.Moment) => {
          return now.startOf('quarter').add(quarters, 'quarters').endOf('day');
        }
      };
    }
  },
  {
    regexp: /^(\d+)yearsago$/,
    resolve: (__: any, _: string, years: string) => {
      return {
        label: __('DateRange.yearsago', {years}),
        startDate: (now: moment.Moment) => {
          return now.startOf('years').add(-years, 'years');
        },
        endDate: (now: moment.Moment) => {
          return now.startOf('year').add(-1, 'days').endOf('day');
        }
      };
    }
  },
  {
    regexp: /^(\d+)yearslater$/,
    resolve: (__: any, _: string, years: string) => {
      return {
        label: __('DateRange.yearslater', {years}),
        startDate: (now: moment.Moment) => {
          return now.startOf('year');
        },
        endDate: (now: moment.Moment) => {
          return now.startOf('year').add(years, 'years').endOf('day');
        }
      };
    }
  }
];

export class DateRangePicker extends React.Component<
  DateRangePickerProps,
  DateRangePickerState
> {
  static defaultProps = {
    startPlaceholder: 'Calendar.startPick',
    endPlaceholder: 'Calendar.endPick',
    format: 'X',
    inputFormat: 'YYYY-MM-DD',
    joinValues: true,
    clearable: true,
    delimiter: ',',
    ranges: 'yesterday,7daysago,prevweek,thismonth,prevmonth,prevquarter',
    resetValue: '',
    closeOnSelect: true,
    overlayPlacement: 'auto',
    endDateOpenedFirst: false
  };

  innerDom: any;
  popover: any;
  input?: HTMLInputElement;

  // 是否是第一次点击，如果是第一次点击就可以点任意地址
  isFirstClick: boolean = true;

  static formatValue(
    newValue: any,
    format: string,
    joinValues: boolean,
    delimiter: string,
    utc = false
  ) {
    newValue = [
      (utc ? moment.utc(newValue.startDate) : newValue.startDate)?.format(
        format
      ),
      (utc ? moment.utc(newValue.endDate) : newValue.endDate)?.format(format)
    ];

    if (joinValues) {
      newValue = newValue.join(delimiter);
    }

    return newValue;
  }

  static unFormatValue(
    value: any,
    format: string,
    joinValues: boolean,
    delimiter: string
  ) {
    if (!value) {
      return {
        startDate: undefined,
        endDate: undefined
      };
    }

    if (joinValues && typeof value === 'string') {
      value = value.split(delimiter);
    }

    return {
      startDate: value[0] ? moment(value[0], format) : undefined,
      endDate: value[1] ? moment(value[1], format) : undefined
    };
  }

  dom: React.RefObject<HTMLDivElement>;
  calendarRef: React.RefObject<HTMLDivElement>;
  nextMonth = moment().add(1, 'months').startOf('day');
  currentMonth = moment().startOf('day');

  startInputRef: React.RefObject<HTMLInputElement>;
  endInputRef: React.RefObject<HTMLInputElement>;

  constructor(props: DateRangePickerProps) {
    super(props);

    this.startInputRef = React.createRef();
    this.endInputRef = React.createRef();
    this.calendarRef = React.createRef();
    this.open = this.open.bind(this);
    this.openStart = this.openStart.bind(this);
    this.openEnd = this.openEnd.bind(this);
    this.close = this.close.bind(this);
    this.startInputChange = this.startInputChange.bind(this);
    this.endInputChange = this.endInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handelEndDateChange = this.handelEndDateChange.bind(this);
    this.handleTimeStartChange = this.handleTimeStartChange.bind(this);
    this.handleTimeEndChange = this.handleTimeEndChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.checkStartIsValidDate = this.checkStartIsValidDate.bind(this);
    this.checkEndIsValidDate = this.checkEndIsValidDate.bind(this);
    this.confirm = this.confirm.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.dom = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePopOverClick = this.handlePopOverClick.bind(this);
    this.renderDay = this.renderDay.bind(this);
    this.renderMonth = this.renderMonth.bind(this);
    this.renderQuarter = this.renderQuarter.bind(this);
    this.renderYear = this.renderYear.bind(this);
    this.handleMobileChange = this.handleMobileChange.bind(this);
    this.handleOutClick = this.handleOutClick.bind(this);
    const {format, joinValues, delimiter, value, inputFormat} = this.props;
    const {startDate, endDate} = DateRangePicker.unFormatValue(
      value,
      format,
      joinValues,
      delimiter
    );
    this.state = {
      isOpened: false,
      isFocused: false,
      editState: 'start',
      startDate,
      endDate,
      oldStartDate: startDate,
      oldEndDate: endDate,
      startInputValue: startDate?.format(inputFormat),
      endInputValue: endDate?.format(inputFormat)
    };
  }
  componentDidMount() {
    document.body.addEventListener('click', this.handleOutClick, true);
    this.props?.onRef?.(this);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleOutClick, true);
  }

  handleOutClick(e: Event) {
    if (
      !e.target ||
      !this.dom.current ||
      this.dom.current.contains(e.target as HTMLElement) ||
      !this.calendarRef.current ||
      this.calendarRef.current.contains(e.target as HTMLElement)
    ) {
      return;
    }
    if (this.state.isOpened) {
      e.preventDefault();
      this.close();
    }
  }

  componentDidUpdate(prevProps: DateRangePickerProps) {
    const props = this.props;
    const {value, format, joinValues, inputFormat, delimiter} = props;

    if (prevProps.value !== value) {
      const {startDate, endDate} = DateRangePicker.unFormatValue(
        value,
        format,
        joinValues,
        delimiter
      );
      this.setState({
        startDate,
        endDate,
        startInputValue: startDate?.format(inputFormat),
        endInputValue: endDate?.format(inputFormat)
      });
    }
  }

  focus() {
    if (!this.dom.current || this.props.disabled) {
      return;
    }

    this.dom.current.focus();
  }

  blur() {
    if (!this.dom.current || this.props.disabled) {
      return;
    }

    this.dom.current.blur();
  }

  handleFocus(e: React.SyntheticEvent<HTMLDivElement>) {
    this.setState({
      isFocused: true
    });
    const {onFocus} = this.props;
    onFocus && onFocus(e);
  }

  handleBlur(e: React.SyntheticEvent<HTMLDivElement>) {
    this.setState({
      isFocused: false
    });
    const {onBlur} = this.props;
    onBlur && onBlur(e);
  }

  open() {
    if (this.props.disabled) {
      return;
    }

    this.setState({
      isOpened: true
    });
  }

  openStart() {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      isOpened: true,
      editState: 'start'
    });
  }

  openEnd() {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      isOpened: true,
      editState: 'end',
      endDateOpenedFirst: true
    });
  }

  close(isConfirm: boolean = false) {
    if (!isConfirm) {
      const {oldEndDate, oldStartDate} = this.state;
      const {inputFormat} = this.props;
      this.setState({
        endDate: oldEndDate,
        endInputValue: oldEndDate ? oldEndDate.format(inputFormat) : '',
        startDate: oldStartDate,
        startInputValue: oldStartDate ? oldStartDate.format(inputFormat) : ''
      });
    }
    this.setState(
      {
        isOpened: false,
        editState: undefined,
        endDateOpenedFirst: false
      },
      this.blur
    );
  }

  handleClick() {
    this.state.isOpened ? this.close() : this.open();
  }

  handlePopOverClick(e: React.MouseEvent<any>) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === ' ') {
      this.handleClick();
      e.preventDefault();
    }
  }

  confirm() {
    if (!this.state.startDate || !this.state.endDate) {
      return;
    } else if (
      this.state.endDate &&
      this.state.startDate?.isAfter(this.state.endDate)
    ) {
      return;
    }

    this.props.onChange(
      DateRangePicker.formatValue(
        {
          startDate: this.state.startDate,
          endDate: this.state.endDate
        },
        this.props.format,
        this.props.joinValues,
        this.props.delimiter,
        this.props.utc
      )
    );
    if (this.state.startDate && !this.state.endDate) {
      this.setState({editState: 'end', endDateOpenedFirst: false});
    } else {
      this.close(true);
    }
  }

  filterDate(
    date: moment.Moment,
    originValue?: moment.Moment,
    timeFormat?: string,
    type: 'start' | 'end' = 'start'
  ): moment.Moment {
    let value = date.clone();

    // 没有初始值
    if (!originValue) {
      value = value[type === 'start' ? 'startOf' : 'endOf']('day');
    } else if (typeof timeFormat === 'string' && /ss/.test(timeFormat)) {
      value = value[type === 'start' ? 'startOf' : 'endOf']('second');
    } else if (typeof timeFormat === 'string' && /mm/.test(timeFormat)) {
      value = value[type === 'start' ? 'startOf' : 'endOf']('minute');
    } else if (typeof timeFormat === 'string' && /HH/i.test(timeFormat)) {
      value = value[type === 'start' ? 'startOf' : 'endOf']('hour');
    } else if (typeof timeFormat === 'string' && /Q/i.test(timeFormat)) {
      value = value[type === 'start' ? 'startOf' : 'endOf']('quarter');
    } else {
      value = value[type === 'start' ? 'startOf' : 'endOf']('day');
    }

    return value;
  }

  handleDateChange(newValue: moment.Moment) {
    let {editState} = this.state;
    if (editState === 'start') {
      this.handleStartDateChange(newValue);
    } else if (editState === 'end') {
      this.handelEndDateChange(newValue);
    }
  }

  handleStartDateChange(newValue: moment.Moment) {
    const {timeFormat, minDate, inputFormat, type} = this.props;
    let {startDate, endDateOpenedFirst} = this.state;
    if (minDate && newValue.isBefore(minDate)) {
      newValue = minDate;
    }
    const date = this.filterDate(
      newValue,
      startDate || minDate,
      timeFormat,
      'start'
    );
    const newState = {
      startDate: date,
      oldStartDate: startDate,
      startInputValue: date.format(inputFormat)
    } as any;
    // 这些没有时间的选择点第一次后第二次就是选结束时间
    if (
      !endDateOpenedFirst &&
      (type === 'input-date-range' ||
        type === 'input-year-range' ||
        type === 'input-quarter-range' ||
        type === 'input-month-range')
    ) {
      newState.editState = 'end';
    }
    this.setState(newState);
  }

  handelEndDateChange(newValue: moment.Moment) {
    const {embed, timeFormat, inputFormat} = this.props;
    let {startDate, endDate, endDateOpenedFirst} = this.state;
    newValue = this.getEndDateByDuration(newValue);
    const editState = endDateOpenedFirst ? 'start' : 'end';
    // 如果结束时间在前面，需要清空开始时间
    if (startDate && newValue.isBefore(startDate)) {
      this.setState({
        startDate: undefined,
        oldStartDate: startDate,
        startInputValue: '',
        editState
      });
    }

    const date = this.filterDate(newValue, endDate, timeFormat, 'end');
    this.setState(
      {
        endDate: date,
        oldEndDate: endDate,
        endInputValue: date.format(inputFormat),
        editState
      },
      () => {
        embed && this.confirm();
      }
    );
  }

  // 手动控制输入时间
  startInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange, inputFormat, format, utc} = this.props;
    const value = e.currentTarget.value;
    this.setState({startInputValue: value});
    if (value === '') {
      onChange('');
    } else {
      let newDate = this.getStartDateByDuration(moment(value, inputFormat));
      this.setState({startDate: newDate});
    }
  }

  endInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange, inputFormat, format, utc} = this.props;
    const value = e.currentTarget.value;
    this.setState({endInputValue: value});
    if (value === '') {
      onChange('');
    } else {
      let newDate = this.getEndDateByDuration(moment(value, inputFormat));
      this.setState({endDate: newDate});
    }
  }

  // 根据 duration 修复结束时间
  getEndDateByDuration(newValue: moment.Moment) {
    const {minDuration, maxDuration, type} = this.props;
    let {startDate, endDate, editState} = this.state;
    if (!startDate) {
      return newValue;
    }

    // 时间范围必须统一成同一天，不然会不一致
    if (type === 'input-time-range' && startDate) {
      newValue.set({
        year: startDate.year(),
        month: startDate.month(),
        date: startDate.date()
      });
    }

    if (minDuration && newValue.isBefore(startDate.clone().add(minDuration))) {
      newValue = startDate.clone().add(minDuration);
    }

    if (maxDuration && newValue.isAfter(startDate.clone().add(maxDuration))) {
      newValue = startDate.clone().add(maxDuration);
    }

    return newValue;
  }

  // 根据 duration 修复起始时间
  getStartDateByDuration(newValue: moment.Moment) {
    const {minDuration, maxDuration, type} = this.props;
    let {endDate, editState} = this.state;
    if (!endDate) {
      return newValue;
    }
    // 时间范围必须统一成同一天，不然会不一致
    if (type === 'input-time-range' && endDate) {
      newValue.set({
        year: endDate.year(),
        month: endDate.month(),
        date: endDate.date()
      });
    }

    if (
      minDuration &&
      newValue.isBefore(endDate.clone().subtract(minDuration))
    ) {
      newValue = endDate.clone().subtract(minDuration);
    }

    if (
      maxDuration &&
      newValue.isAfter(endDate.clone().subtract(maxDuration))
    ) {
      newValue = endDate.clone().subtract(maxDuration);
    }

    return newValue;
  }

  // 主要用于处理时间的情况
  handleTimeStartChange(newValue: moment.Moment) {
    const {embed, timeFormat, inputFormat, minDuration, maxDuration, minDate} =
      this.props;
    const {startDate, endDate} = this.state;

    // 时间范围必须统一成同一天，不然会不一致
    if (endDate) {
      newValue.set({
        year: endDate.year(),
        month: endDate.month(),
        date: endDate.date()
      });
    }

    if (minDate && newValue && newValue.isBefore(minDate, 'second')) {
      newValue = minDate;
    }

    this.setState(
      {
        startDate: newValue,
        startInputValue: newValue.format(inputFormat)
      },
      () => {
        embed && this.confirm();
      }
    );
  }

  handleTimeEndChange(newValue: moment.Moment) {
    const {embed, timeFormat, inputFormat, minDuration, maxDuration, maxDate} =
      this.props;
    const {startDate, endDate} = this.state;
    if (startDate) {
      newValue.set({
        year: startDate.year(),
        month: startDate.month(),
        date: startDate.date()
      });
    }

    if (maxDate && newValue && newValue.isAfter(maxDate, 'second')) {
      newValue = maxDate;
    }

    if (
      startDate &&
      minDuration &&
      newValue.isBefore(startDate.clone().add(minDuration))
    ) {
      newValue = startDate.clone().add(minDuration);
    }
    if (
      startDate &&
      maxDuration &&
      newValue.isAfter(startDate.clone().add(maxDuration))
    ) {
      newValue = startDate.clone().add(maxDuration);
    }

    this.setState(
      {
        endDate: newValue,
        endInputValue: newValue.format(inputFormat)
      },
      () => {
        embed && this.confirm();
      }
    );
  }

  handleMobileChange(data: any, callback?: () => void) {
    this.setState(
      {
        startDate: data.startDate,
        endDate: data.endDate
      },
      callback
    );
  }

  selectRannge(range: PlainObject) {
    const {closeOnSelect, minDate, maxDate} = this.props;
    const now = moment();
    this.setState(
      {
        startDate:
          minDate && minDate.isValid()
            ? moment.max(range.startDate(now.clone()), minDate)
            : range.startDate(now.clone()),
        endDate:
          maxDate && maxDate.isValid()
            ? moment.min(maxDate, range.endDate(now.clone()))
            : range.endDate(now.clone())
      },
      closeOnSelect ? this.confirm : noop
    );
  }

  renderRanges(ranges: string | Array<ShortCuts> | undefined) {
    if (!ranges) {
      return null;
    }
    const {classPrefix: ns} = this.props;
    let rangeArr: Array<string | ShortCuts>;
    if (typeof ranges === 'string') {
      rangeArr = ranges.split(',');
    } else {
      rangeArr = ranges;
    }
    const __ = this.props.translate;

    return (
      <ul className={`${ns}DateRangePicker-rangers`}>
        {rangeArr.map(item => {
          if (!item) {
            return null;
          }
          let range: PlainObject = {};
          if (typeof item === 'string') {
            if (availableRanges[item]) {
              range = availableRanges[item];
              range.key = item;
            } else {
              // 通过正则尝试匹配
              for (let i = 0, len = advancedRanges.length; i < len; i++) {
                let value = advancedRanges[i];
                const m = value.regexp.exec(item);
                if (m) {
                  range = value.resolve.apply(item, [__, ...m]);
                  range.key = item;
                }
              }
            }
          } else if (
            (item as ShortCutDateRange).startDate &&
            (item as ShortCutDateRange).endDate
          ) {
            range = {
              ...item,
              startDate: () => (item as ShortCutDateRange).startDate,
              endDate: () => (item as ShortCutDateRange).endDate
            };
          }
          if (Object.keys(range).length) {
            return (
              <li
                className={`${ns}DateRangePicker-ranger`}
                onClick={() => this.selectRannge(range)}
                key={range.key || range.label}
              >
                <a>{__(range.label)}</a>
              </li>
            );
          } else {
            return null;
          }
        })}
      </ul>
    );
  }

  clearValue(e: React.MouseEvent<any>) {
    e.preventDefault();
    e.stopPropagation();
    const {onChange} = this.props;
    this.setState({startInputValue: '', endInputValue: ''});
    onChange('');
  }

  // 清空
  clear() {
    const {onChange} = this.props;
    this.setState({startInputValue: '', endInputValue: ''});
    onChange('');
  }

  // 重置
  reset() {
    const {resetValue, onChange, format, joinValues, delimiter, inputFormat} =
      this.props;
    if (!resetValue) {
      return;
    }
    const {startDate, endDate} = DateRangePicker.unFormatValue(
      resetValue,
      format,
      joinValues,
      delimiter
    );
    onChange(resetValue);
    this.setState({
      startInputValue: startDate?.format(inputFormat),
      endInputValue: endDate?.format(inputFormat)
    });
  }

  checkStartIsValidDate(currentDate: moment.Moment) {
    let {endDate, startDate} = this.state;
    let {minDate, maxDate, minDuration, maxDuration, viewMode} = this.props;
    const precision = viewMode === 'time' ? 'hours' : viewMode || 'day';

    maxDate =
      maxDate && endDate
        ? maxDate.isBefore(endDate)
          ? maxDate
          : endDate
        : undefined;

    if (minDate && currentDate.isBefore(minDate, precision)) {
      return false;
    } else if (maxDate && currentDate.isAfter(maxDate, precision)) {
      return false;
    } else if (
      // 如果配置了 minDuration 那么 EndDate - minDuration 之后的天数也不能选
      endDate &&
      minDuration &&
      currentDate.isAfter(endDate.clone().subtract(minDuration))
    ) {
      return false;
    } else if (
      endDate &&
      maxDuration &&
      currentDate.isBefore(endDate.clone().subtract(maxDuration))
    ) {
      return false;
    }

    return true;
  }

  checkEndIsValidDate(currentDate: moment.Moment) {
    let {startDate} = this.state;
    let {minDate, maxDate, minDuration, maxDuration, viewMode} = this.props;
    const precision = viewMode === 'time' ? 'hours' : viewMode || 'day';

    minDate =
      minDate && startDate
        ? minDate.isAfter(startDate)
          ? minDate
          : startDate
        : undefined;

    if (minDate && currentDate.isBefore(minDate, precision)) {
      return false;
    } else if (maxDate && currentDate.isAfter(maxDate, precision)) {
      return false;
    } else if (
      startDate &&
      minDuration &&
      currentDate.isBefore(startDate.clone().add(minDuration))
    ) {
      return false;
    } else if (
      startDate &&
      maxDuration &&
      currentDate.isAfter(startDate.clone().add(maxDuration))
    ) {
      return false;
    }

    return true;
  }

  renderDay(props: any, currentDate: moment.Moment) {
    let {startDate, endDate, endDateOpenedFirst, editState} = this.state;

    if (
      startDate &&
      endDate &&
      currentDate.isBetween(startDate, endDate, 'day', '[]')
    ) {
      props.className += ' rdtBetween';
    }

    if (startDate && currentDate.isSame(startDate, 'day')) {
      props.className += ' rdtActive rdtStartDay';
    }

    if (endDate && currentDate.isSame(endDate, 'day')) {
      props.className += ' rdtActive rdtEndDay';
    }

    const {className, ...others} = this.getDisabledElementProps(currentDate);
    props.className += className;

    return (
      <td {...props} {...others}>
        <span>{currentDate.date()}</span>
      </td>
    );
  }

  renderMonth(props: any, month: number, year: number, date: any) {
    const m = moment();
    const currentDate = m.year(year).month(month);
    const {startDate, endDate} = this.state;

    var localMoment = m.localeData().monthsShort(m.month(month));
    var strLength = 3;
    var monthStrFixedLength = localMoment.substring(0, strLength);

    if (
      startDate &&
      endDate &&
      currentDate.isBetween(startDate, endDate, 'month', '[]')
    ) {
      props.className += ' rdtBetween';
    }

    const {className, ...others} = this.getDisabledElementProps(currentDate);
    props.className += className;

    return (
      <td {...props} {...others}>
        <span>{monthStrFixedLength}</span>
      </td>
    );
  }

  renderQuarter(props: any, quarter: number, year: number) {
    const currentDate = moment().year(year).quarter(quarter);
    const {startDate, endDate} = this.state;

    if (
      startDate &&
      endDate &&
      currentDate.isBetween(startDate, endDate, 'quarter', '[]')
    ) {
      props.className += ' rdtBetween';
    }

    const {className, ...others} = this.getDisabledElementProps(currentDate);
    props.className += className;

    return (
      <td {...props} {...others}>
        <span>Q{quarter}</span>
      </td>
    );
  }
  renderYear(props: any, year: number) {
    const currentDate = moment().year(year);
    const {startDate, endDate} = this.state;

    if (
      startDate &&
      endDate &&
      currentDate.isBetween(startDate, endDate, 'year', '[]')
    ) {
      props.className += ' rdtBetween';
    }

    const {className, ...others} = this.getDisabledElementProps(currentDate);
    props.className += className;

    return (
      <td {...props} {...others}>
        <span>{year}</span>
      </td>
    );
  }

  renderCalendar() {
    const {
      classPrefix: ns,
      classnames: cx,
      dateFormat,
      timeFormat,
      inputFormat,
      ranges,
      locale,
      embed,
      type,
      viewMode = 'days',
      useMobileUI
    } = this.props;
    const __ = this.props.translate;

    const {startDate, endDate, editState} = this.state;

    const isDateTimeRange = type === 'input-datetime-range';
    // timeRange需要单独选择范围
    const isTimeRange = isDateTimeRange || viewMode === 'time';

    return (
      <div className={cx(`${ns}DateRangePicker-wrap`)} ref={this.calendarRef}>
        {this.renderRanges(ranges)}
        {(!isTimeRange || (editState === 'start' && !embed)) && (
          <Calendar
            className={`${ns}DateRangePicker-start`}
            value={startDate}
            // 区分的原因是 time-range 左侧就只能选起始时间，而其它都能在左侧同时同时选择起始和结束
            // TODO: 后续得把 time-range 代码拆分出来
            onChange={
              isDateTimeRange
                ? this.handleStartDateChange
                : viewMode === 'time'
                ? this.handleTimeStartChange
                : this.handleDateChange
            }
            requiredConfirm={false}
            dateFormat={dateFormat}
            inputFormat={inputFormat}
            timeFormat={timeFormat}
            isValidDate={this.checkStartIsValidDate}
            viewMode={viewMode}
            input={false}
            onClose={this.close}
            renderDay={this.renderDay}
            renderMonth={this.renderMonth}
            renderQuarter={this.renderQuarter}
            renderYear={this.renderYear}
            locale={locale}
            timeRangeHeader="开始时间"
          />
        )}
        {(!isTimeRange || (editState === 'end' && !embed)) && (
          <Calendar
            className={`${ns}DateRangePicker-end`}
            value={endDate}
            onChange={
              isDateTimeRange
                ? this.handelEndDateChange
                : viewMode === 'time'
                ? this.handleTimeEndChange
                : this.handleDateChange
            }
            requiredConfirm={false}
            dateFormat={dateFormat}
            inputFormat={inputFormat}
            timeFormat={timeFormat}
            viewDate={isDateTimeRange ? this.currentMonth : this.nextMonth}
            // isEndDate
            isValidDate={this.checkEndIsValidDate}
            viewMode={viewMode}
            input={false}
            onClose={this.close}
            renderDay={this.renderDay}
            renderMonth={this.renderMonth}
            renderQuarter={this.renderQuarter}
            renderYear={this.renderYear}
            locale={locale}
            timeRangeHeader="结束时间"
          />
        )}

        {embed ? null : (
          <div key="button" className={`${ns}DateRangePicker-actions`}>
            <a
              className={cx('Button', 'Button--default')}
              onClick={() => this.close()}
            >
              {__('cancel')}
            </a>
            <a
              className={cx('Button', 'Button--primary', 'm-l-sm', {
                'is-disabled':
                  (!this.state.startDate &&
                    isTimeRange &&
                    editState === 'start') ||
                  (!this.state.endDate && isTimeRange && editState === 'end') ||
                  this.state.endDate?.isBefore(this.state.startDate)
              })}
              onClick={this.confirm}
            >
              {__('confirm')}
            </a>
          </div>
        )}
      </div>
    );
  }

  getDisabledElementProps(currentDate: moment.Moment) {
    const {endDateOpenedFirst, endDate, startDate, editState} = this.state;
    const afterEndDate =
      editState === 'start' && endDateOpenedFirst && currentDate > endDate!;
    const beforeStartDate =
      editState === 'end' && !endDateOpenedFirst && currentDate < startDate!;

    if (afterEndDate || beforeStartDate) {
      return {
        className: ' is-disabled',
        onClick: undefined
      };
    }

    return {
      className: ''
    };
  }

  render() {
    const {
      className,
      popoverClassName,
      classPrefix: ns,
      classnames: cx,
      value,
      startPlaceholder,
      endPlaceholder,
      popOverContainer,
      inputFormat,
      format,
      joinValues,
      delimiter,
      clearable,
      disabled,
      embed,
      overlayPlacement,
      borderMode,
      useMobileUI,
      timeFormat,
      minDate,
      maxDate,
      minDuration,
      maxDuration,
      dateFormat,
      viewMode = 'days',
      ranges,
      label
    } = this.props;
    const useCalendarMobile =
      useMobileUI &&
      isMobile() &&
      ['days', 'months', 'quarters'].indexOf(viewMode) > -1;

    const {isOpened, isFocused, startDate, endDate} = this.state;

    const __ = this.props.translate;

    const calendarMobile = (
      <CalendarMobile
        timeFormat={timeFormat}
        inputFormat={inputFormat}
        startDate={startDate}
        endDate={endDate}
        minDate={minDate}
        maxDate={maxDate}
        minDuration={minDuration}
        maxDuration={maxDuration}
        dateFormat={dateFormat}
        embed={embed}
        viewMode={viewMode}
        close={this.close}
        confirm={this.confirm}
        onChange={this.handleMobileChange}
        footerExtra={this.renderRanges(ranges)}
        showViewMode={
          viewMode === 'quarters' || viewMode === 'months' ? 'years' : 'months'
        }
      />
    );

    if (embed) {
      return (
        <div
          className={cx(
            `${ns}DateRangeCalendar`,
            {
              'is-disabled': disabled
            },
            className
          )}
        >
          {useCalendarMobile ? calendarMobile : this.renderCalendar()}
        </div>
      );
    }

    const CalendarMobileTitle = (
      <div className={`${ns}CalendarMobile-title`}>
        {label && typeof label === 'string' ? label : __('Calendar.datepicker')}
      </div>
    );

    return (
      <div
        tabIndex={0}
        onKeyPress={this.handleKeyPress}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={cx(
          `${ns}DateRangePicker`,
          {
            'is-disabled': disabled,
            'is-focused': isFocused,
            [`${ns}DateRangePicker--border${ucFirst(borderMode)}`]: borderMode,
            'is-mobile': useMobileUI && isMobile()
          },
          className
        )}
        ref={this.dom}
      >
        <Input
          className={cx('DateRangePicker-input', {
            isActive: this.state.editState === 'start' && isOpened
          })}
          onChange={this.startInputChange}
          onClick={this.openStart}
          ref={this.startInputRef}
          placeholder={__(startPlaceholder)}
          autoComplete="off"
          value={this.state.startInputValue || ''}
          disabled={disabled}
        />
        <span className={cx('DateRangePicker-input-separator')}>-</span>
        <Input
          className={cx('DateRangePicker-input', {
            isActive: this.state.editState === 'end' && isOpened
          })}
          onChange={this.endInputChange}
          onClick={this.openEnd}
          ref={this.endInputRef}
          placeholder={__(endPlaceholder)}
          autoComplete="off"
          value={this.state.endInputValue || ''}
          disabled={disabled}
        />

        {clearable && !disabled && value ? (
          <a className={`${ns}DateRangePicker-clear`} onClick={this.clearValue}>
            <Icon icon="input-clear" className="icon" />
          </a>
        ) : null}

        <a className={`${ns}DateRangePicker-toggler`}>
          <Icon
            icon={viewMode === 'time' ? 'clock' : 'date'}
            className="icon"
          />
        </a>

        {isOpened ? (
          useMobileUI && isMobile() ? (
            <PopUp
              isShow={isOpened}
              container={popOverContainer}
              className={cx(
                `${ns}CalendarMobile-pop`,
                `${ns}CalendarMobile-pop--${viewMode}`
              )}
              onHide={this.close}
              header={CalendarMobileTitle}
            >
              {useCalendarMobile ? calendarMobile : this.renderCalendar()}
            </PopUp>
          ) : (
            <Overlay
              target={() => this.dom.current}
              onHide={this.close}
              container={popOverContainer || (() => findDOMNode(this))}
              rootClose={false}
              placement={overlayPlacement}
              show
            >
              <PopOver
                classPrefix={ns}
                className={cx(`${ns}DateRangePicker-popover`, popoverClassName)}
                onHide={this.close}
                onClick={this.handlePopOverClick}
              >
                {this.renderCalendar()}
              </PopOver>
            </Overlay>
          )
        ) : null}
      </div>
    );
  }
}

export default themeable(localeable(DateRangePicker));

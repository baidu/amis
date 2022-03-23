/**
 * @file DateRangePicker
 * @description 自定义日期范围时间选择器组件
 * @author fex
 */

import React from 'react';
import moment from 'moment';
import {findDOMNode} from 'react-dom';
import {Icon} from './icons';
import Overlay from './Overlay';
import {ShortCuts, ShortCutDateRange} from './DatePicker';
import Calendar from './calendar/Calendar';
import PopOver from './PopOver';
import PopUp from './PopUp';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {PlainObject} from '../types';
import {isMobile, noop, ucFirst} from '../utils/helper';
import {LocaleProps, localeable} from '../locale';
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
}

export interface DateRangePickerState {
  isOpened: boolean;
  isFocused: boolean;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  editState?: 'start' | 'end'; // 编辑开始时间还是结束时间
  startInputValue?: string;
  endInputValue?: string;
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
    overlayPlacement: 'auto'
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
      (utc ? moment.utc(newValue.startDate) : newValue.startDate).format(
        format
      ),
      (utc ? moment.utc(newValue.endDate) : newValue.endDate).format(format)
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
  nextMonth = moment().add(1, 'months');

  startInputRef: React.RefObject<HTMLInputElement>;
  endInputRef: React.RefObject<HTMLInputElement>;

  constructor(props: DateRangePickerProps) {
    super(props);

    this.startInputRef = React.createRef();
    this.endInputRef = React.createRef();
    this.open = this.open.bind(this);
    this.openStart = this.openStart.bind(this);
    this.openEnd = this.openEnd.bind(this);
    this.close = this.close.bind(this);
    this.startInputChange = this.startInputChange.bind(this);
    this.endInputChange = this.endInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
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
    this.renderQuarter = this.renderQuarter.bind(this);
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
      startDate,
      endDate,
      startInputValue: startDate?.format(inputFormat),
      endInputValue: endDate?.format(inputFormat)
    };
  }
  componentDidMount() {
    document.body.addEventListener('click', this.handleOutClick, true);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleOutClick, true);
  }

  handleOutClick(e: Event) {
    if (
      !e.target ||
      !this.dom.current ||
      this.dom.current.contains(e.target as HTMLElement)
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
      editState: 'end'
    });
  }

  close() {
    this.setState(
      {
        isOpened: false,
        editState: undefined
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
    } else if (this.state.startDate.isAfter(this.state.endDate)) {
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
    this.close();
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
    const {
      embed,
      viewMode = 'days',
      timeFormat,
      minDuration,
      maxDuration,
      minDate,
      inputFormat,
      type
    } = this.props;
    let {startDate, endDate, editState} = this.state;
    if (editState === 'start') {
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
        startInputValue: date.format(inputFormat)
      } as any;
      // 这些没有时间的选择点第一次后第二次就是选结束时间
      if (
        type === 'input-date-range' ||
        type === 'input-year-range' ||
        type === 'input-quarter-range'
      ) {
        newState.editState = 'end';
      }
      this.setState(newState);
    } else if (editState === 'end') {
      if (!startDate) {
        // 先设置了结束时间
        startDate = newValue;
      }

      if (minDuration && newValue.isAfter(startDate.clone().add(minDuration))) {
        newValue = startDate.clone().add(minDuration);
      }
      if (
        maxDuration &&
        newValue.isBefore(startDate.clone().add(maxDuration))
      ) {
        newValue = startDate.clone().add(maxDuration);
      }

      // 如果结束时间在前面，需要清空开始时间
      if (newValue.isBefore(startDate)) {
        this.setState({
          startDate: undefined,
          startInputValue: ''
        });
      }
      const date = this.filterDate(newValue, endDate, timeFormat, 'end');
      this.setState(
        {
          endDate: date,
          endInputValue: date.format(inputFormat)
        },
        () => {
          embed && this.confirm();
        }
      );
    }
  }

  // 主要用于处理时间的情况
  handleTimeStartChange(newValue: moment.Moment) {
    const {embed, timeFormat, inputFormat, minDuration, maxDuration, minDate} =
      this.props;
    const {startDate, endDate} = this.state;

    if (endDate) {
      newValue.set({
        year: endDate.year(),
        month: endDate.month(),
        day: endDate.day()
      });
    }

    if (minDate && newValue && newValue.isBefore(minDate, 'second')) {
      newValue = minDate;
    }

    const newStartDate = this.filterDate(
      newValue,
      startDate || minDate,
      timeFormat,
      'start'
    );

    // 时间范围必须统一成同一天，不然会出事

    this.setState(
      {
        startDate: newStartDate,
        startInputValue: newStartDate.format(inputFormat)
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
        day: startDate.day()
      });
    }

    if (maxDate && newValue && newValue.isAfter(maxDate, 'second')) {
      newValue = maxDate;
    }

    if (
      startDate &&
      minDuration &&
      newValue.isAfter(startDate.clone().add(minDuration))
    ) {
      newValue = startDate.clone().add(minDuration);
    }
    if (
      startDate &&
      maxDuration &&
      newValue.isBefore(startDate.clone().add(maxDuration))
    ) {
      newValue = startDate.clone().add(maxDuration);
    }

    const newEndDate = this.filterDate(
      newValue,
      endDate || maxDate,
      timeFormat,
      'end'
    );
    this.setState(
      {
        endDate: newEndDate,
        endInputValue: newEndDate.format(inputFormat)
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
          return (
            <li
              className={`${ns}DateRangePicker-ranger`}
              onClick={() => this.selectRannge(range)}
              key={range.key || range.label}
            >
              <a>{__(range.label)}</a>
            </li>
          );
        })}
      </ul>
    );
  }

  clearValue(e: React.MouseEvent<any>) {
    e.preventDefault();
    e.stopPropagation();
    const {resetValue, onChange} = this.props;
    this.setState({startInputValue: '', endInputValue: ''});
    onChange(resetValue);
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
    let {startDate, endDate} = this.state;

    if (
      startDate &&
      endDate &&
      currentDate.isBetween(startDate, endDate, 'day', '[]')
    ) {
      props.className += ' rdtBetween';
    }

    return <td {...props}>{currentDate.date()}</td>;
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

    return (
      <td {...props}>
        <span>Q{quarter}</span>
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
      viewMode = 'days'
    } = this.props;
    const __ = this.props.translate;

    const {startDate, endDate} = this.state;

    return (
      <div className={`${ns}DateRangePicker-wrap`}>
        {this.renderRanges(ranges)}
        <Calendar
          className={`${ns}DateRangePicker-start`}
          value={startDate}
          // 区分的原因是 time-range 左侧就只能选起始时间，而其它都能在左侧同时同时选择起始和结束
          // TODO: 后续得把 time-range 代码拆分出来
          onChange={
            viewMode === 'time'
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
          renderQuarter={this.renderQuarter}
          locale={locale}
        />
        <Calendar
          className={`${ns}DateRangePicker-end`}
          value={endDate}
          onChange={
            viewMode === 'time'
              ? this.handleTimeEndChange
              : this.handleDateChange
          }
          requiredConfirm={false}
          dateFormat={dateFormat}
          inputFormat={inputFormat}
          timeFormat={timeFormat}
          viewDate={this.nextMonth}
          isEndDate
          isValidDate={this.checkEndIsValidDate}
          viewMode={viewMode}
          input={false}
          onClose={this.close}
          renderDay={this.renderDay}
          renderQuarter={this.renderQuarter}
          locale={locale}
        />

        {embed ? null : (
          <div key="button" className={`${ns}DateRangePicker-actions`}>
            <a className={cx('Button', 'Button--default')} onClick={this.close}>
              {__('cancel')}
            </a>
            <a
              className={cx('Button', 'Button--primary', 'm-l-sm', {
                'is-disabled':
                  !this.state.startDate ||
                  !this.state.endDate ||
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

  // 手动控制输入时间
  startInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange, inputFormat, format, utc} = this.props;
    const value = e.currentTarget.value;
    this.setState({startInputValue: value});
    if (value === '') {
      onChange('');
    } else {
      const newDate = moment(value, inputFormat);
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
      const newDate = moment(value, inputFormat);
      this.setState({endDate: newDate});
    }
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
      ranges
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
        {__('Calendar.datepicker')}
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
            isActive: this.state.editState === 'start'
          })}
          onChange={this.startInputChange}
          onClick={this.openStart}
          ref={this.startInputRef}
          placeholder={__(startPlaceholder)}
          autoComplete="off"
          value={this.state.startInputValue || ''}
          disabled={disabled}
        />
        <span className={cx('DateRangePicker-input-separator')}>~</span>
        <Input
          className={cx('DateRangePicker-input', {
            isActive: this.state.editState === 'end'
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
          <Icon icon="clock" className="icon" />
        </a>

        {isOpened ? (
          useMobileUI && isMobile() ? (
            <PopUp
              isShow={isOpened}
              container={popOverContainer}
              className={cx(`${ns}CalendarMobile-pop`)}
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

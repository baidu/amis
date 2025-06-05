/**
 * @file DateRangePicker
 * @description 自定义日期范围时间选择器组件
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import moment, {locale, unitOfTime} from 'moment';
import omit from 'lodash/omit';
import kebabCase from 'lodash/kebabCase';
import {
  PopOver,
  Overlay,
  isExpression,
  FormulaExec,
  filterDate,
  themeable,
  getComputedStyle,
  noop,
  ucFirst,
  localeable,
  str2function
} from 'amis-core';
import {Icon} from './icons';
import {ShortCuts, ShortCutDateRange} from './DatePicker';
import Calendar from './calendar/Calendar';
import PopUp from './PopUp';
import CalendarMobile from './CalendarMobile';
import Input from './Input';
import Button from './Button';

import type {Moment} from 'moment';
import type {PlainObject, ThemeProps, LocaleProps} from 'amis-core';
import type {
  ViewMode,
  ChangeEventViewMode,
  MutableUnitOfTime,
  ChangeEventViewStatus
} from './calendar/Calendar';
import type {TestIdBuilder} from 'amis-core';

export interface DateRangePickerProps extends ThemeProps, LocaleProps {
  className?: string;
  popoverClassName?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  theme?: any;
  utc?: boolean;
  format?: string;
  inputFormat?: string;
  valueFormat: string;
  displayFormat?: string;
  /**
   * @deprecated 3.1.0后废弃，用shortcuts替代
   */
  ranges?: string | Array<ShortCuts>;
  shortcuts?: string | Array<ShortCuts>;
  clearable?: boolean;
  inputForbid?: boolean; // 禁用输入
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  minDateRaw?: string;
  maxDateRaw?: string;
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
  popOverContainerSelector?: string;
  dateFormat?: string;
  embed?: boolean;
  viewMode?: ViewMode;
  borderMode?: 'full' | 'half' | 'none';
  onFocus?: Function;
  onBlur?: Function;
  type?: string;
  onRef?: any;
  label?: string | false;
  /** 是否开启游标动画 */
  animation?: boolean;
  /** 日期处理函数，通常用于自定义处理绑定日期的值 */
  transform?: string;
  testIdBuilder?: TestIdBuilder;
}

export interface DateRangePickerState {
  isOpened: boolean;
  isFocused: boolean;
  /** 开始时间 */
  startDate?: moment.Moment;
  /** 结束时间 */
  endDate?: moment.Moment;
  /** 最近一次confirm的开始时间 */
  oldStartDate?: moment.Moment;
  /** 最近一次confirm的结束时间 */
  oldEndDate?: moment.Moment;
  /** 当前编辑的时间类型：开始时间 ｜ 结束时间 */
  editState?: 'start' | 'end';
  /** 开始时间输入值 */
  startInputValue?: string;
  /** 结束时间输入值 */
  endInputValue?: string;
  endDateOpenedFirst: boolean;
  curTimeFormat?: string;
  curDateFormat?: string;
}

export const availableShortcuts: {[propName: string]: any} = {
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
    ranges: '',
    shortcuts: 'yesterday,7daysago,prevweek,thismonth,prevmonth,prevquarter',
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
    valueFormat: string,
    joinValues: boolean,
    delimiter: string,
    utc = false
  ) {
    newValue = [
      (utc ? moment.utc(newValue.startDate) : newValue.startDate)?.format(
        valueFormat
      ),
      (utc ? moment.utc(newValue.endDate) : newValue.endDate)?.format(
        valueFormat
      )
    ];

    if (joinValues) {
      newValue = newValue.join(delimiter);
    }

    return newValue;
  }

  /* 将日期时间转化为momemnt格式，如果输入的内容不合法则返回undefined */
  static unFormatValue(
    value: any,
    format: string,
    joinValues: boolean,
    delimiter: string,
    data: any,
    utc?: boolean
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

    const startDate = filterDate(value?.[0], data, format, utc);
    const endDate = filterDate(value?.[1], data, format, utc);

    /**
     * 不合法的value输入都丢弃
     * 注意undefined被moment认为是合法的输入，moment会转化为now，所以需要结合在一起判断
     * @reference https://github.com/moment/moment/issues/1639
     */
    return {
      startDate: value[0] && startDate.isValid() ? startDate : undefined,
      endDate: value[1] && endDate.isValid() ? endDate : undefined
    };
  }

  dom: React.RefObject<HTMLDivElement>;
  calendarRef: React.RefObject<HTMLDivElement>;
  nextMonth = moment().add(1, 'months').startOf('day');
  currentMonth = moment().startOf('day');

  startInputRef: React.RefObject<HTMLInputElement>;
  endInputRef: React.RefObject<HTMLInputElement>;
  separatorRef: React.RefObject<HTMLSpanElement>;

  constructor(props: DateRangePickerProps) {
    super(props);

    this.startInputRef = React.createRef();
    this.endInputRef = React.createRef();
    this.separatorRef = React.createRef();
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
    const {
      format,
      valueFormat,
      joinValues,
      delimiter,
      value,
      inputFormat,
      displayFormat,
      dateFormat,
      timeFormat,
      data,
      utc
    } = this.props;
    const {startDate, endDate} = DateRangePicker.unFormatValue(
      value,
      valueFormat || (format as string),
      joinValues,
      delimiter,
      data,
      utc
    );

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
      editState: 'start',
      startDate,
      endDate,
      oldStartDate: startDate,
      oldEndDate: endDate,
      startInputValue: startDate?.format(displayFormat || inputFormat),
      endInputValue: endDate?.format(displayFormat || inputFormat),
      endDateOpenedFirst: false,
      curDateFormat,
      curTimeFormat
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
    const {
      value,
      format,
      valueFormat,
      joinValues,
      inputFormat,
      displayFormat,
      dateFormat,
      timeFormat,
      delimiter,
      data,
      utc
    } = props;
    if (
      prevProps.displayFormat != displayFormat ||
      prevProps.inputFormat != inputFormat
    ) {
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

      this.setState({
        curDateFormat,
        curTimeFormat: curTimeFormatArr.length
          ? curTimeFormatArr.join(':')
          : curTimeFormat
      });
    }
    if (prevProps.value !== value) {
      const {startDate, endDate} = DateRangePicker.unFormatValue(
        value,
        valueFormat || (format as string),
        joinValues,
        delimiter,
        data,
        utc
      );
      this.setState({
        startDate,
        endDate,
        startInputValue:
          startDate && startDate?.isValid()
            ? startDate?.format(displayFormat || inputFormat)
            : '',
        endInputValue:
          endDate && endDate?.isValid()
            ? endDate?.format(displayFormat || inputFormat)
            : ''
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
    const newState: any = {};
    if (!isConfirm) {
      /** 未点击确认关闭时，将日期恢复至未做任何选择的状态 */
      const {
        value,
        format,
        valueFormat,
        joinValues,
        delimiter,
        inputFormat,
        displayFormat,
        data,
        utc
      } = this.props;
      const {startDate, endDate} = DateRangePicker.unFormatValue(
        value,
        valueFormat || (format as string),
        joinValues,
        delimiter,
        data,
        utc
      );
      Object.assign(newState, {
        startDate,
        endDate,
        oldStartDate: startDate,
        oldEndDate: endDate,
        startInputValue:
          startDate && moment(startDate).isValid()
            ? startDate.format(displayFormat || inputFormat)
            : '',
        endInputValue:
          endDate && moment(endDate).isValid()
            ? endDate.format(displayFormat || inputFormat)
            : ''
      });
    } else {
      Object.assign(newState, {
        oldStartDate: this.state.startDate,
        oldEndDate: this.state.endDate
      });
    }
    this.setState(
      {
        ...newState,
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
    const {format, valueFormat, joinValues, delimiter, utc} = this.props;
    const {startDate, endDate} = this.state;

    if (!startDate && !endDate) {
      return;
    } else if (endDate && startDate?.isAfter(this.state.endDate)) {
      return;
    }

    this.props.onChange(
      DateRangePicker.formatValue(
        {startDate, endDate},
        valueFormat || (format as string),
        joinValues,
        delimiter,
        utc
      )
    );
    if (startDate && !endDate) {
      this.setState({editState: 'end', endDateOpenedFirst: false});
    } else {
      this.close(true);
    }
  }

  filterDate(
    date: moment.Moment,
    options: {
      type: 'start' | 'end';
      originValue?: moment.Moment;
      timeFormat?: string;
      subControlViewMode?: ChangeEventViewMode;
      /** 自动初始化绑定值，用于首次选择且当前未绑定值，默认使用当前时间 */
      autoInitDefaultValue?: boolean;
    } = {type: 'start'}
  ): moment.Moment {
    const {
      type,
      originValue,
      timeFormat,
      subControlViewMode,
      autoInitDefaultValue
    } = options || {
      type: 'start'
    };
    let value = date.clone();
    const {transform, data} = this.props;
    const {startDate, endDate} = this.state;

    /** 此时为点选后的值初始化设置，不应该被内部转化逻辑和transformFn限制 */
    if (autoInitDefaultValue === true) {
      const now = moment();

      /** 如果已经设置了结束时间且当前时间已经超出了结束时间，则开始时间不能超过结束时间 */
      if (!startDate && endDate && type === 'start' && now.isAfter(endDate)) {
        value = endDate.clone();
        return value;
      }

      const timePart: Record<MutableUnitOfTime, number> = {
        date: value.get('date'),
        hour: value.get('hour'),
        minute: value.get('minute'),
        second: value.get('second'),
        millisecond: value.get('millisecond')
      };

      Object.keys(timePart).forEach((unit: MutableUnitOfTime) => {
        /** 首次选择时间，日期使用当前时间; 将未设置过的时间字段设置为当前值 */
        if (
          (unit === 'date' && subControlViewMode === 'time') ||
          (unit !== 'date' && timePart[unit] === 0)
        ) {
          timePart[unit] = now.get(unit);
        }
      });

      value.set(timePart);
      return value;
    }

    /** 日期时间选择器组件支持用户选择时间，如果用户手动选择了时间，则不需要走默认处理 */
    if (subControlViewMode && subControlViewMode === 'time') {
      return value;
    }

    const transformFn =
      transform && typeof transform === 'string'
        ? str2function(transform, 'value', 'config', 'props', 'data', 'moment')
        : transform;

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

    if (typeof transformFn === 'function') {
      value = transformFn(
        value,
        {type, originValue, timeFormat},
        this.props,
        data,
        moment
      );
    }

    return value;
  }

  handleDateChange(
    newValue: moment.Moment,
    viewMode?: ChangeEventViewMode,
    status?: ChangeEventViewStatus
  ) {
    const {embed} = this.props;
    const editState = embed
      ? this.state.editState || status
      : this.state.editState;

    if (editState === 'start') {
      this.handleStartDateChange(newValue);
    } else if (editState === 'end') {
      this.handelEndDateChange(newValue);
    }
  }

  /**
   * @param {Moment} newValue 当前选择的日期时间值
   * @param {ViewMode=} subControlViewMode 子选择控件的类型，可选参数（'time'），用于区分datetime选择器的触发控件
   */
  handleStartDateChange(
    newValue: moment.Moment,
    subControlViewMode?: ChangeEventViewMode
  ) {
    const {
      minDate,
      inputFormat,
      displayFormat,
      type,
      value: defaultValue
    } = this.props;
    let {
      startDate,
      oldStartDate,
      endDateOpenedFirst,
      curTimeFormat: timeFormat
    } = this.state;
    if (minDate && newValue.isBefore(minDate)) {
      newValue = minDate;
    }
    const date = this.filterDate(newValue, {
      type: 'start',
      originValue: startDate || minDate,
      timeFormat,
      subControlViewMode,
      autoInitDefaultValue: !!timeFormat && newValue && !startDate
    });
    const newState = {
      startDate: date,
      startInputValue: date.format(displayFormat || inputFormat)
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

  /**
   * @param {Moment} newValue 当前选择的日期时间值
   * @param {string=} subControlViewMode 子选择控件的类型的类型，可选参数（'time'），用于区分datetime选择器的触发控件
   */
  handelEndDateChange(
    newValue: moment.Moment,
    subControlViewMode?: ChangeEventViewMode
  ) {
    const {
      embed,
      inputFormat,
      displayFormat,
      type,
      value: defaultValue
    } = this.props;
    let {
      startDate,
      endDate,
      oldEndDate,
      endDateOpenedFirst,
      curTimeFormat: timeFormat
    } = this.state;
    newValue = this.getEndDateByDuration(newValue);
    const editState = endDateOpenedFirst ? 'start' : 'end';
    const date = this.filterDate(newValue, {
      type: 'end',
      originValue: endDate,
      timeFormat,
      subControlViewMode,
      autoInitDefaultValue: !!timeFormat && newValue && !endDate
    });

    this.setState(
      {
        endDate: date,
        endInputValue: date.format(displayFormat || inputFormat)
      },
      () => {
        embed && this.confirm();
      }
    );

    if (type !== 'input-datetime-range') {
      this.setState({editState});
    }
  }

  // 手动控制输入时间
  startInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange, displayFormat, inputFormat, utc} = this.props;
    const value = e.currentTarget.value;
    this.setState({startInputValue: value});
    if (value === '') {
      onChange('');
    } else {
      let newDate = this.getStartDateByDuration(
        moment(value, displayFormat || inputFormat)
      );
      this.setState({startDate: newDate});
    }
  }

  endInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange, displayFormat, inputFormat, utc} = this.props;
    const value = e.currentTarget.value;
    this.setState({endInputValue: value});
    if (value === '') {
      onChange('');
    } else {
      let newDate = this.getEndDateByDuration(
        moment(value, displayFormat || inputFormat)
      );
      this.setState({endDate: newDate});
    }
  }

  // 根据 duration 修复结束时间
  getEndDateByDuration(newValue: moment.Moment) {
    const {minDuration, maxDuration, type, maxDate} = this.props;
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

    if (maxDate && newValue && newValue.isAfter(maxDate, 'second')) {
      newValue = maxDate;
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
    const {
      embed,
      inputFormat,
      displayFormat,
      minDuration,
      maxDuration,
      minDate
    } = this.props;
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
        startInputValue: newValue.format(displayFormat || inputFormat)
      },
      () => {
        embed && this.confirm();
      }
    );
  }

  handleTimeEndChange(newValue: moment.Moment) {
    const {
      embed,
      inputFormat,
      displayFormat,
      minDuration,
      maxDuration,
      maxDate
    } = this.props;
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
        endInputValue: newValue.format(displayFormat || inputFormat)
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

  selectShortcut(shortcut: PlainObject) {
    const {
      closeOnSelect,
      minDateRaw,
      maxDateRaw,
      format,
      valueFormat,
      data,
      mobileUI
    } = this.props;
    const now = moment();
    /** minDate和maxDate要实时计算，因为用户可能设置为${NOW()}，暂时不考虑毫秒级的时间差 */
    const minDate = minDateRaw
      ? filterDate(minDateRaw, data, valueFormat || format)
      : undefined;
    const maxDate = maxDateRaw
      ? filterDate(maxDateRaw, data, valueFormat || format)
      : undefined;
    const startDate = shortcut.startDate(now.clone());
    const endDate = shortcut.endDate(now.clone());

    this.setState(
      {
        startDate:
          minDate && minDate?.isValid()
            ? moment.max(startDate, minDate)
            : startDate,
        endDate:
          maxDate && maxDate?.isValid() ? moment.min(maxDate, endDate) : endDate
      },
      closeOnSelect && !mobileUI ? this.confirm : noop
    );
  }

  renderShortcuts(shortcuts: string | Array<ShortCuts> | undefined) {
    if (!shortcuts) {
      return null;
    }
    const {
      classPrefix: ns,
      format,
      valueFormat,
      data,
      translate: __,
      testIdBuilder
    } = this.props;
    let shortcutArr: Array<string | ShortCuts>;
    if (typeof shortcuts === 'string') {
      shortcutArr = shortcuts.split(',');
    } else {
      shortcutArr = shortcuts;
    }
    const TIDBuilder = testIdBuilder?.getChild('shortcut');

    return (
      <ul className={`${ns}DateRangePicker-rangers`}>
        {shortcutArr.map((item, index) => {
          if (!item) {
            return null;
          }

          let shortcut: PlainObject = {};
          if (typeof item === 'string') {
            if (availableShortcuts[item]) {
              shortcut = availableShortcuts[item];
              shortcut.key = item;
            } else {
              // 通过正则尝试匹配
              for (let i = 0, len = advancedRanges.length; i < len; i++) {
                let value = advancedRanges[i];
                const m = value.regexp.exec(item);
                if (m) {
                  shortcut = value.resolve.apply(item, [__, ...m]);
                  shortcut.key = item;
                }
              }
            }
          } else if (
            (item as ShortCutDateRange).startDate &&
            (item as ShortCutDateRange).endDate
          ) {
            const shortcutRaw = {...item} as ShortCutDateRange;

            shortcut = {
              ...item,
              startDate: () => {
                const startDate = isExpression(shortcutRaw.startDate)
                  ? moment(
                      FormulaExec['formula'](shortcutRaw.startDate, data),
                      valueFormat || format
                    )
                  : typeof shortcutRaw.startDate === 'string'
                  ? moment(shortcutRaw.startDate, valueFormat || format)
                  : shortcutRaw.startDate;

                return startDate &&
                  moment.isMoment(startDate) &&
                  startDate.isValid()
                  ? startDate
                  : (item as ShortCutDateRange).startDate;
              },
              endDate: () => {
                const endDate = isExpression(shortcutRaw.endDate)
                  ? moment(
                      FormulaExec['formula'](shortcutRaw.endDate, data),
                      valueFormat || format
                    )
                  : typeof shortcutRaw.endDate === 'string'
                  ? moment(shortcutRaw.endDate, valueFormat || format)
                  : shortcutRaw.endDate;

                return endDate && moment.isMoment(endDate) && endDate.isValid()
                  ? endDate
                  : (item as ShortCutDateRange).endDate;
              }
            };
          }
          if (Object.keys(shortcut).length) {
            return (
              <li
                className={`${ns}DateRangePicker-ranger`}
                onClick={() => this.selectShortcut(shortcut)}
                key={index}
              >
                <a {...TIDBuilder?.getChild(shortcut.key).getTestId()}>
                  {__(shortcut.label)}
                </a>
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
  reset(resetValue?: any) {
    const {
      onChange,
      format,
      valueFormat,
      joinValues,
      delimiter,
      inputFormat,
      displayFormat,
      data,
      utc
    } = this.props;

    const tmpResetValue = resetValue ?? this.props.resetValue;
    const {startDate, endDate} = DateRangePicker.unFormatValue(
      tmpResetValue,
      valueFormat || (format as string),
      joinValues,
      delimiter,
      data,
      utc
    );
    onChange?.(tmpResetValue);
    this.setState({
      startInputValue: startDate?.format(displayFormat || inputFormat),
      endInputValue: endDate?.format(displayFormat || inputFormat)
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
        : maxDate || endDate;

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
        : minDate || startDate;
    // 在 dateTimeRange 的场景下，如果选择了开始时间的时间点不为 0，比如 2020-10-1 10:10，这时 currentDate 传入的当天值是 2020-10-1 00:00，这个值在起始时间后面，导致没法再选这一天了，所以在这时需要先通过将时间都转成 00 再比较
    if (
      minDate &&
      currentDate
        .startOf('day')
        .isBefore(minDate.clone().startOf('day'), precision)
    ) {
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
    const {testIdBuilder} = this.props;

    if (
      startDate &&
      endDate &&
      currentDate.isBetween(startDate, endDate, 'day', '[]')
    ) {
      props.className += ' rdtBetween';
    }

    // 如果已经选择了开始时间和结束时间，那么中间的时间都不应该高亮
    if (startDate && endDate && props.className.includes('rdtActive')) {
      props.className = props.className.replace('rdtActive', '');
    }

    if (startDate && currentDate.isSame(startDate, 'day')) {
      props.className += ' rdtActive rdtStart';
    }

    if (endDate && currentDate.isSame(endDate, 'day')) {
      props.className += ' rdtActive rdtEnd';
    }

    const {className, ...others} = this.getDisabledElementProps(
      currentDate,
      'day'
    );
    props.className += className;

    return (
      <td {...omit(props, ['todayActiveStyle'])} {...others}>
        <span {...testIdBuilder?.getChild(props.key)?.getTestId()}>
          {currentDate.date()}
        </span>
      </td>
    );
  }

  renderMonth(props: any, month: number, year: number, date: any) {
    const currentDate = props.viewDate.year(year).month(month);
    const {startDate, endDate} = this.state;

    const {translate: __, testIdBuilder} = this.props;
    const monthStr = currentDate.format(__('MMM'));
    const strLength = 3;
    // Because some months are up to 5 characters long, we want to
    // use a fixed string length for consistency
    const monthStrFixedLength = monthStr.substring(0, strLength);

    if (
      startDate &&
      endDate &&
      currentDate.isBetween(startDate, endDate, 'month', '[]')
    ) {
      props.className += ' rdtBetween';
    }

    // 如果已经选择了开始时间和结束时间，那么中间的时间都不应该高亮
    if (startDate && endDate && props.className.includes('rdtActive')) {
      props.className = props.className.replace('rdtActive', '');
    }

    if (startDate && currentDate.isSame(startDate, 'month')) {
      props.className += ' rdtActive rdtStart';
    }

    if (endDate && currentDate.isSame(endDate, 'month')) {
      props.className += ' rdtActive rdtEnd';
    }

    const {className, ...others} = this.getDisabledElementProps(
      currentDate,
      'month'
    );
    props.className += className;

    return (
      <td {...omit(props, 'viewDate')} {...others}>
        <span {...testIdBuilder?.getChild(props.key).getTestId()}>
          {monthStrFixedLength}
        </span>
      </td>
    );
  }

  renderQuarter(props: any, quarter: number, year: number) {
    const currentDate = moment().year(year).quarter(quarter);
    const {startDate, endDate} = this.state;
    const {testIdBuilder} = this.props;

    if (
      startDate &&
      endDate &&
      currentDate.isBetween(startDate, endDate, 'quarter', '[]')
    ) {
      props.className += ' rdtBetween';
    }

    // 如果已经选择了开始时间和结束时间，那么中间的时间都不应该高亮
    if (startDate && endDate && props.className.includes('rdtActive')) {
      props.className = props.className.replace('rdtActive', '');
    }

    if (startDate && currentDate.isSame(startDate, 'quarter')) {
      props.className += ' rdtActive rdtStart';
    }

    if (endDate && currentDate.isSame(endDate, 'quarter')) {
      props.className += ' rdtActive rdtEnd';
    }

    const {className, ...others} = this.getDisabledElementProps(
      currentDate,
      'quarter'
    );
    props.className += className;

    return (
      <td {...props} {...others}>
        <span {...testIdBuilder?.getChild(props.key).getTestId()}>
          Q{quarter}
        </span>
      </td>
    );
  }
  renderYear(props: any, year: number) {
    const currentDate = moment().year(year);
    const {startDate, endDate} = this.state;
    const {testIdBuilder} = this.props;

    if (
      startDate &&
      endDate &&
      currentDate.isBetween(startDate, endDate, 'year', '[]')
    ) {
      props.className += ' rdtBetween';
    }

    // 如果已经选择了开始时间和结束时间，那么中间的时间都不应该高亮
    if (startDate && endDate && props.className.includes('rdtActive')) {
      props.className = props.className.replace('rdtActive', '');
    }

    if (startDate && currentDate.isSame(startDate, 'year')) {
      props.className += ' rdtActive rdtStart';
    }

    if (endDate && currentDate.isSame(endDate, 'year')) {
      props.className += ' rdtActive rdtEnd';
    }

    const {className, ...others} = this.getDisabledElementProps(
      currentDate,
      'year'
    );
    props.className += className;

    return (
      <td {...props} {...others}>
        <span {...testIdBuilder?.getChild(props.key).getTestId()}>{year}</span>
      </td>
    );
  }

  renderCalendar() {
    const {
      classPrefix: ns,
      classnames: cx,
      inputFormat,
      displayFormat,
      ranges,
      shortcuts,
      locale,
      embed,
      type,
      viewMode = 'days',
      label,
      mobileUI,
      testIdBuilder
    } = this.props;
    const __ = this.props.translate;
    const {startDate, endDate, editState, curDateFormat, curTimeFormat} =
      this.state;
    const isDateTimeRange = type === 'input-datetime-range';
    const isDateRange = type === 'input-date-range';
    // timeRange需要单独选择范围
    const isTimeRange = isDateTimeRange || viewMode === 'time';
    const isConfirmBtnDisbaled =
      (isTimeRange && editState === 'start' && !startDate) ||
      (isTimeRange && editState === 'end' && !endDate) ||
      (startDate && endDate?.isBefore(this.state.startDate)) ||
      /** 日期范围选择之后会立即切换面板，所以开始/结束日期任意一个不合法就不允许更新数据 */
      (isDateRange &&
        (!startDate ||
          !endDate ||
          !startDate?.isValid() ||
          !endDate?.isValid()));

    return (
      <div
        className={cx(`${ns}DateRangePicker-wrap`, {'is-mobile': mobileUI})}
        ref={this.calendarRef}
      >
        {mobileUI && !embed ? (
          <div className={cx('PickerColumns-header')}>
            {
              <Button
                className="PickerColumns-cancel"
                level="link"
                onClick={() => this.close(false)}
              >
                {__('cancel')}
              </Button>
            }
            {label && typeof label === 'string'
              ? label
              : __('Calendar.datepicker')}
            {
              <Button
                className="PickerColumns-confirm"
                level="link"
                disabled={isConfirmBtnDisbaled || !startDate || !endDate}
                onClick={this.confirm}
              >
                {__('confirm')}
              </Button>
            }
          </div>
        ) : null}
        {this.renderShortcuts(ranges || shortcuts)}
        <div
          className={cx(`${ns}DateRangePicker-picker-wrap`, {
            'is-vertical': embed
          })}
        >
          {(!isTimeRange ||
            (editState === 'start' && !embed) ||
            (mobileUI && isTimeRange)) && (
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
              dateFormat={curDateFormat}
              displayForamt={displayFormat || inputFormat}
              timeFormat={curTimeFormat}
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
              embed={embed}
              status="start"
              testIdBuilder={testIdBuilder?.getChild('calendar-start')}
            />
          )}
          {(!isTimeRange ||
            (editState === 'end' && !embed) ||
            (mobileUI && isTimeRange)) && (
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
              dateFormat={curDateFormat}
              displayForamt={displayFormat || inputFormat}
              timeFormat={curTimeFormat}
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
              embed={embed}
              status="end"
              testIdBuilder={testIdBuilder?.getChild('calendar-end')}
            />
          )}
        </div>

        {embed || mobileUI ? null : (
          <div key="button" className={`${ns}DateRangePicker-actions`}>
            {/* this.close 这里不可以传参 */}
            <Button size="sm" onClick={() => this.close()}>
              {__('cancel')}
            </Button>
            <Button
              level="primary"
              size="sm"
              className={cx('m-l-sm')}
              disabled={isConfirmBtnDisbaled}
              onClick={this.confirm}
            >
              {__('confirm')}
            </Button>
          </div>
        )}
      </div>
    );
  }

  getDisabledElementProps(
    currentDate: moment.Moment,
    granularity?: unitOfTime.StartOf
  ) {
    const {endDateOpenedFirst, endDate, startDate, editState} = this.state;
    const afterEndDate =
      editState === 'start' &&
      endDate &&
      currentDate.isAfter(endDate!, granularity);
    const beforeStartDate =
      editState === 'end' &&
      startDate &&
      !currentDate.isSameOrAfter(startDate!, granularity);

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

  /** 获取宽度类型变量的值 */
  getValidWidthValue(element: HTMLElement, propsName: string): number {
    if (!element || !propsName) {
      return 0;
    }
    const propsValue = parseInt(
      getComputedStyle(element, kebabCase(propsName)),
      10
    );

    return isNaN(propsValue) ? 0 : propsValue;
  }

  renderActiveCursor() {
    const {classnames: cx} = this.props;
    const {editState, isFocused} = this.state;
    let cursorWidth: number = 0;
    let cursorLeft: number = 0;

    const parentNode = this?.dom?.current;
    const startInputNode = this?.startInputRef?.current;
    const endInputNode = this?.endInputRef?.current;
    const separatorNode = this?.separatorRef?.current;

    if (parentNode && startInputNode && endInputNode && separatorNode) {
      if (editState === 'start') {
        const paddingWidth = this.getValidWidthValue(parentNode, 'paddingLeft');

        cursorLeft = paddingWidth;
        cursorWidth = startInputNode.offsetWidth;
      } else if (editState === 'end') {
        const separatorWidth =
          separatorNode.offsetWidth +
          this.getValidWidthValue(parentNode, 'paddingLeft') +
          this.getValidWidthValue(parentNode, 'marginLeft') +
          this.getValidWidthValue(parentNode, 'paddingRight') +
          this.getValidWidthValue(parentNode, 'marginRight');

        cursorLeft = startInputNode.offsetWidth + separatorWidth;
        cursorWidth = endInputNode.offsetWidth;
      } else {
        cursorWidth = 0;
      }
    }

    return (
      <div
        className={cx('DateRangePicker-activeCursor', {isFocused})}
        style={{
          position: 'absolute',
          left: cursorLeft,
          width: cursorWidth
        }}
      />
    );
  }

  getDefaultDate() {
    let {value, data, valueFormat, format, delimiter} = this.props;
    if (value) {
      let startDate = filterDate(
        Array.isArray(value)
          ? value[0] || value[1]
          : String(value).split(delimiter)?.[0],
        data,
        valueFormat || (format as string)
      );
      return startDate;
    }
    return undefined;
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
      popOverContainerSelector,
      inputFormat,
      displayFormat,
      joinValues,
      delimiter,
      clearable,
      inputForbid,
      disabled,
      embed,
      overlayPlacement,
      borderMode,
      mobileUI,
      timeFormat,
      minDate,
      maxDate,
      minDuration,
      maxDuration,
      dateFormat,
      viewMode = 'days',
      ranges,
      shortcuts,
      label,
      animation,
      testIdBuilder,
      locale
    } = this.props;
    const useCalendarMobile =
      mobileUI && ['days', 'months', 'quarters'].indexOf(viewMode) > -1;

    const {
      isOpened,
      isFocused,
      startDate,
      endDate,
      curDateFormat,
      curTimeFormat
    } = this.state;
    const __ = this.props.translate;
    const calendarMobile = (
      <CalendarMobile
        popOverContainer={popOverContainer}
        timeFormat={curTimeFormat}
        displayForamt={displayFormat || inputFormat}
        defaultDate={this.getDefaultDate()}
        startDate={startDate}
        endDate={endDate}
        minDate={minDate}
        maxDate={maxDate}
        minDuration={minDuration}
        maxDuration={maxDuration}
        dateFormat={curDateFormat}
        embed={embed}
        viewMode={viewMode}
        close={this.close}
        confirm={this.confirm}
        onChange={this.handleMobileChange}
        footerExtra={this.renderShortcuts(ranges || shortcuts)}
        locale={locale}
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
              'is-mobile': mobileUI
            },
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
    /** 是否启用游标动画 */
    const useAnimation = animation !== false;

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
            'is-mobile': mobileUI
          },
          className
        )}
        ref={this.dom}
      >
        <Input
          className={cx('DateRangePicker-input', {
            isActive:
              !useAnimation && this.state.editState === 'start' && isOpened
          })}
          onChange={this.startInputChange}
          onClick={this.openStart}
          ref={this.startInputRef}
          placeholder={__(startPlaceholder)}
          autoComplete="off"
          value={this.state.startInputValue || ''}
          disabled={disabled}
          readOnly={mobileUI || inputForbid}
          testIdBuilder={testIdBuilder?.getChild('start')}
        />
        <span
          className={cx('DateRangePicker-input-separator')}
          ref={this.separatorRef}
        >
          <span className={cx('DateRangePicker-input-separator-line')}></span>
        </span>
        <Input
          className={cx('DateRangePicker-input', {
            isActive:
              !useAnimation && this.state.editState === 'end' && isOpened
          })}
          onChange={this.endInputChange}
          onClick={this.openEnd}
          ref={this.endInputRef}
          placeholder={__(endPlaceholder)}
          autoComplete="off"
          value={this.state.endInputValue || ''}
          disabled={disabled}
          readOnly={mobileUI || inputForbid}
          testIdBuilder={testIdBuilder?.getChild('end')}
        />

        {/* 指示游标 */}
        {useAnimation ? this.renderActiveCursor() : null}

        {clearable && !disabled && value ? (
          <a className={`${ns}DateRangePicker-clear`} onClick={this.clearValue}>
            <Icon icon="input-clear" className="icon" />
          </a>
        ) : null}

        <a className={cx(`DateRangePicker-toggler`)}>
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

        {isOpened ? (
          mobileUI ? (
            <PopUp
              isShow={isOpened}
              container={popOverContainer}
              className={cx(
                `${ns}CalendarMobile-pop`,
                `${ns}CalendarMobile-pop--${viewMode}`
              )}
              onHide={this.close}
              header={CalendarMobileTitle}
              showClose={false}
            >
              {useCalendarMobile ? calendarMobile : this.renderCalendar()}
            </PopUp>
          ) : (
            <Overlay
              target={() => this.dom.current}
              onHide={this.close}
              container={popOverContainer || (() => findDOMNode(this))}
              containerSelector={popOverContainerSelector}
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

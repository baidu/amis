/**
 * @file DatePicker
 * @description 时间选择器组件
 * @author fex
 */

import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import 'moment/locale/zh-cn';

// hack 进去，让 days view 用 CustomDaysView 代替
import CalendarContainer from 'react-datetime/src/CalendarContainer';
import ReactDatePicker from 'react-datetime';
import Select from './Select';
import {Icon} from './icons';
import PopOver from './PopOver';
import Overlay from './Overlay';
import {classPrefix, classnames} from '../themes/default';
import {ClassNamesFn, themeable} from '../theme';
import {findDOMNode} from 'react-dom';
import find from 'lodash/find';

class HackedCalendarContainer extends CalendarContainer {
  render() {
    if (this.props.view === 'days') {
      return <CustomDaysView {...this.props.viewProps} />;
    }

    return super.render();
  }
}

// hack 后，view 中可以调用 setDateTimeState
class BaseDatePicker extends ReactDatePicker {
  __hacked: boolean;

  render() {
    if (!this.__hacked) {
      this.__hacked = true;
      const origin = (this as any).getComponentProps;
      const setState = this.setState.bind(this);
      (this as any).getComponentProps = function() {
        const props = origin.apply(this);
        props.setDateTimeState = setState;
        [
          'onChange',
          'onClose',
          'requiredConfirm',
          'classPrefix',
          'prevIcon',
          'nextIcon',
          'isEndDate'
        ].forEach(key => (props[key] = (this.props as any)[key]));

        return props;
      };
    }

    // TODO: Make a function or clean up this code,
    // logic right now is really hard to follow
    let className =
        'rdt' +
        (this.props.className
          ? Array.isArray(this.props.className)
            ? ' ' + this.props.className.join(' ')
            : ' ' + this.props.className
          : ''),
      children: Array<any> = [];

    if (this.props.input) {
      var finalInputProps = {
        type: 'text',
        className: 'form-control',
        onClick: this.openCalendar,
        onFocus: this.openCalendar,
        onChange: this.onInputChange,
        onKeyDown: this.onInputKey,
        value: this.state.inputValue,
        ...this.props.inputProps
      };

      if (this.props.renderInput) {
        children = [
          <div key="i">
            {this.props.renderInput(
              finalInputProps,
              this.openCalendar,
              this.closeCalendar
            )}
          </div>
        ];
      } else {
        children = [<input key="i" {...finalInputProps} />];
      }
    } else {
      className += ' rdtStatic';
    }

    if (this.state.open) className += ' rdtOpen';

    return (
      <div className={className}>
        {children.concat(
          <div key="dt" className="rdtPicker">
            <HackedCalendarContainer
              view={this.state.currentView}
              viewProps={this.getComponentProps()}
              onClickOutside={this.handleClickOutside}
            />
          </div>
        )}
      </div>
    );
  }
}

interface CustomDaysViewProps {
  classPrefix?: string;
  prevIcon?: string;
  nextIcon?: string;
  viewDate: moment.Moment;
  selectedDate: moment.Moment;
  timeFormat: string;
  requiredConfirm?: boolean;
  isEndDate?: boolean;
  renderDay?: Function;
  onClose?: () => void;
  onChange: (value: moment.Moment) => void;
  setDateTimeState: (state: any) => void;
  setTime: (type: string, amount: number) => void;
  subtractTime: (
    amount: number,
    type: string,
    toSelected?: moment.Moment
  ) => () => void;
  addTime: (
    amount: number,
    type: string,
    toSelected?: moment.Moment
  ) => () => void;
  isValidDate?: (
    currentDate: moment.Moment,
    selected?: moment.Moment
  ) => boolean;
  showView: (view: string) => () => void;
  updateSelectedDate: (event: React.MouseEvent<any>, close?: boolean) => void;
  handleClickOutside: () => void;
}

class CustomDaysView extends React.Component<CustomDaysViewProps> {
  static defaultProps = {
    classPrefix: 'a-'
  };

  constructor(props: CustomDaysViewProps) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  getDaysOfWeek(locale: moment.Locale) {
    const days: Array<string> = locale.weekdaysMin();
    const first = locale.firstDayOfWeek();
    const dow: Array<string> = [];
    let i = 0;

    days.forEach(function(day) {
      dow[(7 + i++ - first) % 7] = day;
    });

    return dow;
  }

  alwaysValidDate() {
    return true;
  }

  handleDayChange(event: React.MouseEvent<any>) {
    // need confirm
    if (this.props.requiredConfirm) {
      const viewDate = this.props.viewDate.clone();
      const currentDate = this.props.selectedDate || viewDate;

      const target = event.target as HTMLElement;
      let modifier = 0;

      if (~target.className.indexOf('rdtNew')) {
        modifier = 1;
      }
      if (~target.className.indexOf('rdtOld')) {
        modifier = -1;
      }

      viewDate
        .month(viewDate.month() + modifier)
        .date(parseInt(target.getAttribute('data-value') as string, 10))
        .hours(currentDate.hours())
        .minutes(currentDate.minutes())
        .seconds(currentDate.seconds())
        .milliseconds(currentDate.milliseconds());

      this.props.setDateTimeState({
        viewDate,
        selectedDate: viewDate.clone()
      });
      return;
    }

    this.props.updateSelectedDate(event, true);
  }

  handleMonthChange(option: any) {
    // const div = document.createElement('div');
    // div.innerHTML = `<span class="rdtMonth" data-value="${option.value}"></span>`;

    // const fakeEvent = {
    //     target: div.firstChild
    // };

    // this.props.updateSelectedDate(fakeEvent as any);

    const viewDate = this.props.viewDate;
    this.props.setDateTimeState({
      viewDate: viewDate
        .clone()
        .month(option.value)
        .startOf('month')
    });
  }

  handleYearChange(option: any) {
    // const div = document.createElement('div');
    // div.innerHTML = `<span class="rdtYear" data-value="${option.value}"></span>`;

    // const fakeEvent = {
    //     target: div.firstChild
    // };

    // this.props.updateSelectedDate(fakeEvent as any);

    const viewDate = this.props.viewDate;
    const newDate = viewDate.clone().year(option.value);
    this.props.setDateTimeState({
      viewDate: newDate[newDate.isBefore(viewDate) ? 'endOf' : 'startOf'](
        'year'
      )
    });
  }

  setTime(
    type: 'hours' | 'minutes' | 'seconds' | 'milliseconds',
    value: number
  ) {
    const date = (this.props.selectedDate || this.props.viewDate).clone();
    date[type](value);

    this.props.setDateTimeState({
      viewDate: date.clone(),
      selectedDate: date.clone()
    });

    if (!this.props.requiredConfirm) {
      this.props.onChange(date);
    }
  }

  confirm() {
    const date = this.props.viewDate.clone();

    this.props.setDateTimeState({
      selectedDate: date
    });
    this.props.onChange(date);
    this.props.onClose && this.props.onClose();
  }

  cancel() {
    this.props.onClose && this.props.onClose();
  }

  handleClickOutside() {
    this.props.handleClickOutside();
  }

  renderYearsSelect() {
    const classPrefix = this.props.classPrefix;
    const date = this.props.viewDate;
    const years: Array<number> = [];
    const isValid = this.props.isValidDate || this.alwaysValidDate;
    const irrelevantMonth = 0;
    const irrelevantDate = 1;
    let year = date.year();
    let count = 0;

    years.push(year);
    while (count < 20) {
      year++;

      let currentYear = date.clone().set({
        year: year,
        month: irrelevantMonth,
        date: irrelevantDate
      });
      const noOfDaysInYear = parseInt(
        currentYear.endOf('year').format('DDD'),
        10
      );
      const daysInYear = Array.from(
        {
          length: noOfDaysInYear
        },
        (e, i) => i + 1
      );
      const validDay = daysInYear.find(d =>
        isValid(currentYear.clone().dayOfYear(d))
      );

      if (!validDay) {
        break;
      }

      years.push(year);
      count++;
    }

    count = 0;
    year = date.year();
    while (count < 20) {
      year--;

      let currentYear = date.clone().set({
        year: year,
        month: irrelevantMonth,
        date: irrelevantDate
      });
      const noOfDaysInYear = parseInt(
        currentYear.endOf('year').format('DDD'),
        10
      );
      const daysInYear = Array.from(
        {
          length: noOfDaysInYear
        },
        (e, i) => i + 1
      );
      const validDay = daysInYear.find(d =>
        isValid(currentYear.clone().dayOfYear(d))
      );

      if (!validDay) {
        break;
      }

      years.unshift(year);
      count++;
    }

    return (
      <Select
        value={date.year()}
        options={years.map(year => ({
          label: `${year}`,
          value: year
        }))}
        onChange={this.handleYearChange}
        clearable={false}
        searchable={false}
      />
    );
  }

  renderMonthsSelect() {
    const classPrefix = this.props.classPrefix;
    const date = this.props.viewDate;
    const year = this.props.viewDate.year();
    const isValid = this.props.isValidDate || this.alwaysValidDate;
    let i = 0;
    const days = [];

    while (i < 12) {
      const currentMonth = date.clone().set({
        year,
        month: i,
        date: 1
      });

      const noOfDaysInMonth = parseInt(
        currentMonth.endOf('month').format('D'),
        10
      );
      const daysInMonth = Array.from({length: noOfDaysInMonth}, function(e, i) {
        return i + 1;
      });

      const validDay = daysInMonth.find(d =>
        isValid(currentMonth.clone().set('date', d))
      );
      if (validDay) {
        days.push(i);
      }
      i++;
    }

    return (
      <Select
        classPrefix={classPrefix}
        value={date.month()}
        options={days.map(day => ({
          label: `${day + 1}`,
          value: day
        }))}
        onChange={this.handleMonthChange}
        clearable={false}
        searchable={false}
      />
    );
  }

  renderDay(props: any, currentDate: moment.Moment) {
    return <td {...props}>{currentDate.date()}</td>;
  }

  renderTimes() {
    const {timeFormat, selectedDate, viewDate, isEndDate} = this.props;

    const date = selectedDate || (isEndDate ? viewDate.endOf('day') : viewDate);
    const inputs: Array<React.ReactNode> = [];

    timeFormat.split(':').forEach((format, i) => {
      const type = /h/i.test(format)
        ? 'hours'
        : /m/i.test(format)
        ? 'minutes'
        : 'seconds';
      const min = 0;
      const max = type === 'hours' ? 23 : 59;

      inputs.push(
        <input
          key={i + 'input'}
          type="text"
          value={date.format(format)}
          min={min}
          max={max}
          onChange={e =>
            this.setTime(
              type,
              Math.max(
                min,
                Math.min(
                  parseInt(e.currentTarget.value.replace(/\D/g, ''), 10) || 0,
                  max
                )
              )
            )
          }
        />
      );

      inputs.push(<span key={i + 'divider'}>:</span>);
    });

    inputs.length && inputs.pop();

    return <div>{inputs}</div>;
  }

  renderFooter() {
    if (!this.props.timeFormat && !this.props.requiredConfirm) {
      return null;
    }

    return (
      <tfoot key="tf">
        <tr>
          <td colSpan={7}>
            {this.props.timeFormat ? this.renderTimes() : null}
            {this.props.requiredConfirm ? (
              <div key="button" className="rdtActions">
                <a className="rdtBtn rdtBtnConfirm" onClick={this.confirm}>
                  确认
                </a>
                <a className="rdtBtn rdtBtnCancel" onClick={this.cancel}>
                  取消
                </a>
              </div>
            ) : null}
          </td>
        </tr>
      </tfoot>
    );
  }

  renderDays() {
    const date = this.props.viewDate;
    const selected = this.props.selectedDate && this.props.selectedDate.clone();
    const prevMonth = date.clone().subtract(1, 'months');
    const currentYear = date.year();
    const currentMonth = date.month();
    const weeks = [];
    let days = [];
    const renderer = this.props.renderDay || this.renderDay;
    const isValid = this.props.isValidDate || this.alwaysValidDate;
    let classes, isDisabled, dayProps: any, currentDate;

    // Go to the last week of the previous month
    prevMonth.date(prevMonth.daysInMonth()).startOf('week');
    var lastDay = prevMonth.clone().add(42, 'd');

    while (prevMonth.isBefore(lastDay)) {
      classes = 'rdtDay';
      currentDate = prevMonth.clone();

      if (
        (prevMonth.year() === currentYear &&
          prevMonth.month() < currentMonth) ||
        prevMonth.year() < currentYear
      )
        classes += ' rdtOld';
      else if (
        (prevMonth.year() === currentYear &&
          prevMonth.month() > currentMonth) ||
        prevMonth.year() > currentYear
      )
        classes += ' rdtNew';

      if (selected && prevMonth.isSame(selected, 'day'))
        classes += ' rdtActive';

      if (prevMonth.isSame(moment(), 'day')) classes += ' rdtToday';

      isDisabled = !isValid(currentDate, selected);
      if (isDisabled) classes += ' rdtDisabled';

      dayProps = {
        key: prevMonth.format('M_D'),
        'data-value': prevMonth.date(),
        className: classes
      };

      if (!isDisabled) dayProps.onClick = this.handleDayChange;

      days.push(renderer(dayProps, currentDate, selected));

      if (days.length === 7) {
        weeks.push(<tr key={prevMonth.format('M_D')}>{days}</tr>);
        days = [];
      }

      prevMonth.add(1, 'd');
    }

    return weeks;
  }

  render() {
    const footer = this.renderFooter();
    const date = this.props.viewDate;
    const locale = date.localeData();

    const tableChildren = [
      <thead key="th">
        <tr>
          <th colSpan={7}>
            <div className="rdtHeader">
              <a
                className="rdtBtn"
                onClick={this.props.subtractTime(1, 'months')}
              >
                <i className="rdtBtnPrev" />
              </a>
              <div className="rdtSelect">{this.renderYearsSelect()}</div>
              <div className="rdtSelect">{this.renderMonthsSelect()}</div>
              <a className="rdtBtn" onClick={this.props.addTime(1, 'months')}>
                <i className="rdtBtnNext" />
              </a>
            </div>
          </th>
        </tr>
        <tr>
          {this.getDaysOfWeek(locale).map((day, index) => (
            <th key={day + index} className="dow">
              {day}
            </th>
          ))}
        </tr>
      </thead>,

      <tbody key="tb">{this.renderDays()}</tbody>
    ];

    footer && tableChildren.push(footer);

    return (
      <div className="rdtDays">
        <table>{tableChildren}</table>
      </div>
    );
  }
}

const availableShortcuts: {[propName: string]: any} = {
  today: {
    label: '今天',
    date: (now: moment.Moment) => {
      return now.startOf('day');
    }
  },

  yesterday: {
    label: '昨天',
    date: (now: moment.Moment) => {
      return now.add(-1, 'days').startOf('day');
    }
  },

  thisweek: {
    label: '本周一',
    date: (now: moment.Moment) => {
      return now.startOf('week').add(-1, 'weeks');
    }
  },

  thismonth: {
    label: '本月初',
    date: (now: moment.Moment) => {
      return now.startOf('month');
    }
  },

  prevmonth: {
    label: '上个月初',
    date: (now: moment.Moment) => {
      return now.startOf('month').add(-1, 'month');
    }
  },

  prevquarter: {
    label: '上个季节初',
    date: (now: moment.Moment) => {
      return now.startOf('quarter').add(-1, 'quarter');
    }
  },

  thisquarter: {
    label: '本季度初',
    date: (now: moment.Moment) => {
      return now.startOf('quarter');
    }
  },

  tomorrow: {
    label: '明天',
    date: (now: moment.Moment) => {
      return now.add(1, 'days').startOf('day');
    }
  },

  endofthisweek: {
    label: '本周日',
    date: (now: moment.Moment) => {
      return now.endOf('week');
    }
  },

  endofthismonth: {
    label: '本月底',
    date: (now: moment.Moment) => {
      return now.endOf('month');
    }
  }
};

const advancedShortcuts = [
  {
    regexp: /^(\d+)daysago$/,
    resolve: (_: string, days: string) => {
      return {
        label: `${days}天前`,
        date: (now: moment.Moment) => {
          return now.subtract(days, 'days');
        }
      };
    }
  },
  {
    regexp: /^(\d+)dayslater$/,
    resolve: (_: string, days: string) => {
      return {
        label: `${days}天后`,
        date: (now: moment.Moment) => {
          return now.add(days, 'days');
        }
      };
    }
  },
  {
    regexp: /^(\d+)weeksago$/,
    resolve: (_: string, weeks: string) => {
      return {
        label: `${weeks}周前`,
        date: (now: moment.Moment) => {
          return now.subtract(weeks, 'weeks');
        }
      };
    }
  },
  {
    regexp: /^(\d+)weekslater$/,
    resolve: (_: string, weeks: string) => {
      return {
        label: `${weeks}周后`,
        date: (now: moment.Moment) => {
          return now.add(weeks, 'weeks');
        }
      };
    }
  },
  {
    regexp: /^(\d+)monthsago$/,
    resolve: (_: string, months: string) => {
      return {
        label: `${months}月前`,
        date: (now: moment.Moment) => {
          return now.subtract(months, 'months');
        }
      };
    }
  },
  {
    regexp: /^(\d+)monthslater$/,
    resolve: (_: string, months: string) => {
      return {
        label: `${months}月后`,
        date: (now: moment.Moment) => {
          return now.add(months, 'months');
        }
      };
    }
  },
  {
    regexp: /^(\d+)quartersago$/,
    resolve: (_: string, quarters: string) => {
      return {
        label: `${quarters}季度前`,
        date: (now: moment.Moment) => {
          return now.subtract(quarters, 'quarters');
        }
      };
    }
  },
  {
    regexp: /^(\d+)quarterslater$/,
    resolve: (_: string, quarters: string) => {
      return {
        label: `${quarters}季度后`,
        date: (now: moment.Moment) => {
          return now.add(quarters, 'quarters');
        }
      };
    }
  }
];

export interface DateProps {
  viewMode: 'years' | 'months' | 'days' | 'time';
  className?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  placeholder?: string;
  inputFormat?: string;
  timeFormat?: string;
  format?: string;
  timeConstrainst?: object;
  closeOnSelect?: boolean;
  disabled?: boolean;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  minTime?: moment.Moment;
  maxTime?: moment.Moment;
  clearable?: boolean;
  defaultValue?: any;
  utc?: boolean;
  onChange: (value: any) => void;
  value: any;
  shortcuts: string;
  [propName: string]: any;
}

export interface DatePickerState {
  isOpened: boolean;
  isFocused: boolean;
  value: moment.Moment | undefined;
}

export class DatePicker extends React.Component<DateProps, DatePickerState> {
  static defaultProps: Pick<DateProps, 'viewMode' | 'shortcuts'> = {
    viewMode: 'days',
    shortcuts: ''
  };
  state: DatePickerState = {
    isOpened: false,
    isFocused: false,
    value: this.props.value
      ? (this.props.utc ? moment.utc : moment)(
          this.props.value,
          this.props.format
        )
      : undefined
  };
  constructor(props: DateProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.selectRannge = this.selectRannge.bind(this);
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
  }

  dom: HTMLDivElement;

  componentWillReceiveProps(nextProps: DateProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
          ? (nextProps.utc ? moment.utc : moment)(
              nextProps.value,
              nextProps.format
            )
          : undefined
      });
    }
  }

  focus() {
    if (!this.dom) {
      return;
    }

    this.dom.focus();
  }

  handleFocus() {
    this.setState({
      isFocused: true
    });
  }

  handleBlur() {
    this.setState({
      isFocused: false
    });
  }

  handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === ' ') {
      this.handleClick();
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
    this.props.disabled ||
      this.setState(
        {
          isOpened: true
        },
        fn
      );
  }

  close() {
    this.setState({
      isOpened: false
    });
  }

  clearValue(e: React.MouseEvent<any>) {
    e.preventDefault();
    e.stopPropagation();
    const onChange = this.props.onChange;
    onChange('');
  }

  handleChange(value: moment.Moment) {
    const {
      onChange,
      format,
      minTime,
      maxTime,
      dateFormat,
      timeFormat
    } = this.props;

    if (!moment.isMoment(value)) {
      return;
    }

    if (minTime && value && value.isBefore(minTime, 'second')) {
      value = minTime;
    } else if (maxTime && value && value.isAfter(maxTime, 'second')) {
      value = maxTime;
    }

    onChange(value.format(format));

    if (dateFormat && !timeFormat) {
      this.close();
    }
  }

  selectRannge(item: any) {
    const now = moment();
    this.handleChange(item.date(now));
    this.close();
  }

  checkIsValidDate(currentDate: moment.Moment) {
    const {minDate, maxDate} = this.props;

    if (minDate && currentDate.isBefore(minDate, 'day')) {
      return false;
    } else if (maxDate && currentDate.isAfter(maxDate, 'day')) {
      return false;
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

    for (let i = 0, len = advancedShortcuts.length; i < len; i++) {
      let item = advancedShortcuts[i];
      const m = item.regexp.exec(key);

      if (m) {
        return item.resolve.apply(item, m);
      }
    }

    return null;
  }

  render() {
    const {
      classPrefix: ns,
      className,
      value,
      placeholder,
      disabled,
      format,
      inputFormat,
      dateFormat,
      timeFormat,
      viewMode,
      timeConstraints,
      popOverContainer,
      clearable,
      shortcuts,
      utc
    } = this.props;

    const isOpened = this.state.isOpened;
    let date: moment.Moment | undefined = this.state.value;

    return (
      <div
        tabIndex={0}
        onKeyPress={this.handleKeyPress}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={cx(
          `${ns}DatePicker`,
          {
            'is-disabled': disabled,
            'is-focused': this.state.isFocused
          },
          className
        )}
        ref={this.domRef}
        onClick={this.handleClick}
      >
        {date ? (
          <span className={`${ns}DatePicker-value`}>
            {date.format(inputFormat)}
          </span>
        ) : (
          <span className={`${ns}DatePicker-placeholder`}>{placeholder}</span>
        )}

        {clearable && !disabled && value ? (
          <a className={`${ns}DatePicker-clear`} onClick={this.clearValue}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}

        <a className={`${ns}DatePicker-toggler`} />

        {isOpened ? (
          <Overlay
            placement="left-bottom-left-top  right-bottom-right-top"
            target={this.getTarget}
            container={popOverContainer || this.getParent}
            rootClose={false}
            show
          >
            <PopOver
              classPrefix={ns}
              className={`${ns}DatePicker-popover`}
              onHide={this.close}
              overlay
              onClick={this.handlePopOverClick}
            >
              {shortcuts ? (
                <ul className={`${ns}DatePicker-shortcuts`}>
                  {(typeof shortcuts === 'string'
                    ? shortcuts.split(',')
                    : Array.isArray(shortcuts)
                    ? shortcuts
                    : []
                  ).map(key => {
                    const shortcut = this.getAvailableShortcuts(key);

                    if (!shortcut) {
                      return null;
                    }

                    return (
                      <li
                        className={`${ns}DatePicker-shortcut`}
                        onClick={() => this.selectRannge(shortcut)}
                        key={key}
                      >
                        <a>{shortcut.label}</a>
                      </li>
                    );
                  })}
                </ul>
              ) : null}

              <BaseDatePicker
                value={date}
                onChange={this.handleChange}
                classPrefix={ns}
                classnames={cx}
                requiredConfirm={dateFormat && timeFormat}
                dateFormat={dateFormat}
                timeFormat={timeFormat}
                isValidDate={this.checkIsValidDate}
                viewMode={viewMode}
                timeConstraints={timeConstraints}
                input={false}
                onClose={this.close}
                utc={utc}
              />
            </PopOver>
          </Overlay>
        ) : null}
      </div>
    );
  }
}

export default themeable(DatePicker);

export {BaseDatePicker};

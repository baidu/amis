/**
 * @file CalendarMobile
 * @description 移动端日历组件
 * @author hongyang03
 */

import React from 'react';
import moment from 'moment';
import Calendar from './calendar/Calendar';
import {themeable, ThemeProps} from '../theme';
import {LocaleProps, localeable} from '../locale';
import {autobind} from '../utils/helper';

export interface CalendarMobileProps extends ThemeProps, LocaleProps {
  className?: string;
  timeFormat?: string;
  inputFormat?: string;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  minDuration?: moment.Duration;
  maxDuration?: moment.Duration;
  dateFormat?: string;
  embed?: boolean;
  viewMode?: 'days' | 'months' | 'years' | 'time' | 'quarters';
  close?: () => void;
  confirm?: (startDate?: any, endTime?: any) => void;
  onChange?: (data: any, callback?: () => void) => void;
  footerExtra?: JSX.Element | null;
  showViewMode?: 'years' | 'months';
  isDatePicker?: boolean;
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
  defaultDate?: moment.Moment;
}

export interface CalendarMobileState {
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  monthHeights?: number[];
  currentDate: moment.Moment;
  showToast: boolean;
  isScrollToBottom: boolean;
  dateTime: any;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
}

export class CalendarMobile extends React.Component<
  CalendarMobileProps,
  CalendarMobileState
> {

  mobileBody: any;
  mobileHeader: any;
  timer: any;

  static defaultProps: Pick<CalendarMobileProps, 'showViewMode'> = {
    showViewMode: 'months'
  };

  constructor(props: CalendarMobileProps) {
    super(props);

    this.mobileBody = React.createRef();
    this.mobileHeader = React.createRef();

    const {startDate, endDate, defaultDate, minDate, maxDate} = this.props;
    const dateRange = this.getDateRange(minDate, maxDate, defaultDate);

    this.state = {
      minDate: dateRange.minDate,
      maxDate: dateRange.maxDate,
      startDate,
      endDate,
      showToast: false,
      currentDate: dateRange.currentDate,
      isScrollToBottom: false,
      dateTime: endDate ? [endDate.hour(), endDate.minute()] : [0, 0]
    };
  }

  getDateRange(minDate?: moment.Moment, maxDate?: moment.Moment, defaultDate?: moment.Moment) {
    !moment.isMoment(minDate) || !minDate.isValid() && (minDate = undefined);
    !moment.isMoment(maxDate) || !maxDate.isValid() && (maxDate = undefined);

    let currentDate = defaultDate || moment();
    let dateRange: {
      minDate: moment.Moment,
      maxDate: moment.Moment
    } = {
      minDate: currentDate.clone().subtract(1, 'year').startOf('months'),
      maxDate: currentDate.clone().add(1, 'year').endOf('months')
    };
    if (minDate && maxDate) {
      dateRange = {
        minDate,
        maxDate
      };
    }
    else if (minDate && !maxDate) {
      dateRange = {
        minDate,
        maxDate: moment(minDate).add(2, 'year')
      };
      currentDate = minDate.clone();
    }
    else if (!minDate && maxDate) {
      dateRange = {
        minDate: moment(maxDate).subtract(2, 'year'),
        maxDate
      };
      currentDate = maxDate.clone();
    }

    if (!currentDate.isBetween(dateRange.minDate, dateRange.maxDate, 'days', '[]')) {
      currentDate = dateRange.minDate.clone();
    }
    return {
      ...dateRange,
      currentDate
    };
  }

  componentDidMount() {
    this.initMonths();
  }

  componentDidUpdate(prevProps: CalendarMobileProps) {
    const props = this.props;

    if (prevProps.minDate !== props.minDate || prevProps.maxDate !== props.maxDate) {
      const currentDate = this.state.currentDate;
      const dateRange = this.getDateRange(props.minDate, props.maxDate, moment(currentDate));
      this.setState(
        {
          minDate: dateRange.minDate,
          maxDate: dateRange.maxDate,
          currentDate: dateRange.currentDate,
        },
        () => this.initMonths()
      );
    }
  }

  componentWillUnmount() {
    this.setState({showToast: false});
    clearTimeout(this.timer);
  }

  initMonths() {
    if (this.mobileBody.current) {
      const header = this.mobileHeader.current;
      let monthHeights: number[] = [];
      const monthCollection = this.mobileBody.current.children;
      for (let i = 0; i < monthCollection.length; i++) {
        monthHeights[i] = monthCollection[i].offsetTop - header.clientHeight;
      }
      this.setState({
        monthHeights
      });
      const defaultDate = this.props.defaultDate || this.state.currentDate;
      this.scollToDate(defaultDate ? moment(defaultDate) : moment());
    }
  }

  scollToDate(date: moment.Moment) {
    const {showViewMode} = this.props;
    const {minDate} = this.state;
    const index = date.diff(minDate, showViewMode);
    const currentEl = this.mobileBody.current.children[index];
    if (!currentEl) {
      return;
    }
    const header = this.mobileHeader.current;
    this.mobileBody.current.scrollBy(0, currentEl.offsetTop - this.mobileBody.current.scrollTop - header.clientHeight);
  }

  @autobind
  onMobileBodyScroll(e: any) {
    const {showViewMode} = this.props;
    const {monthHeights} = this.state;
    let minDate = this.state.minDate?.clone();
    if (!this.mobileBody?.current || !monthHeights || !minDate) {
      return;
    }
    const scrollTop = this.mobileBody.current.scrollTop;
    const clientHeight = this.mobileBody.current.clientHeight;
    const scrollHeight = this.mobileBody.current.scrollHeight;
    
    let i = 0;
    for(i; i < monthHeights.length; i++) {
      if (scrollTop < monthHeights[i]) {
        break;
      }
    }
    i--;
    i < 0 && (i = 0);
    const currentDate = minDate.add(i, showViewMode);
    this.setState({
      currentDate,
      isScrollToBottom: scrollTop + clientHeight === scrollHeight
    });
  }

  @autobind
  scrollPreYear() {
    if (!this.state.currentDate) {
      return;
    }
    let {currentDate, minDate} = this.state;
    currentDate = currentDate.clone().subtract(1, 'years');
    if (minDate && currentDate.isBefore(minDate)) {
      currentDate = minDate;
    }
    this.setState({
      currentDate
    });
    this.scollToDate(currentDate);
  }

  @autobind
  scrollAfterYear() {
    if (!this.state.currentDate) {
      return;
    }
    let {currentDate, maxDate} = this.state;
    currentDate = currentDate.clone().add(1, 'years');
    if (maxDate && currentDate.isAfter(maxDate)) {
      currentDate = maxDate;
    }
    this.setState({
      currentDate
    });
    this.scollToDate(currentDate);
  }

  getDaysOfWeek() {
    const locale = moment().localeData();
    const days = locale.weekdaysMin();
    const first = locale.firstDayOfWeek();
    const	dow: string[] = [];
    let	i = 0;

    days.forEach((day: string) => {
      dow[ (7 + ( i++ ) - first) % 7 ] = day;
    });

    return dow;
  }

  @autobind
  handleCalendarClick(isDisabled: boolean) {
    if (isDisabled) {
      this.setState({showToast: true});
      this.timer = setTimeout(() => {
        this.setState({showToast: false});
      }, 2000);
    }
  }

  getRenderProps(props: any, currentDate: moment.Moment) {
    let {startDate, endDate} = this.state;
    const {translate: __, viewMode, isDatePicker} = this.props;
    const precision = viewMode === 'time' ? 'hours' : viewMode || 'day';
    let footerText = '';

    if (startDate &&
      endDate &&
      currentDate.isBetween(startDate, endDate, precision, '()')) {
      props.className += ' rdtBetween';
    }
    else if (startDate
      && endDate
      && startDate.isSame(endDate, precision)
      && currentDate.isSame(startDate, precision)) {
      props.className += ' rdtRangeStart';
      footerText = __('Calendar.beginAndEnd');
    }
    else if (startDate && currentDate.isSame(startDate, precision)) {
      props.className += ' rdtRangeStart';
      footerText = __('Calendar.begin');
      if (endDate) {
        props.className += ' rdtRangeHasEnd';
      }
    }
    else if (endDate && currentDate.isSame(endDate, precision)) {
      props.className += ' rdtRangeEnd';
      footerText = __('Calendar.end');
    }

    if (precision === 'day' && currentDate.date() === 1 && currentDate.day() === 1) {
      props.className += ' rdtOldNone';
    }

    if (isDatePicker) {
      footerText = '';
    }

    const rdtDisabled = props.className.indexOf('rdtDisabled') > -1;

    return {
      props,
      footerText,
      rdtDisabled
    };
  }

  @autobind
  handleTimeChange(newTime: any) {
    if (!newTime) {
      return;
    }
    const {onChange} = this.props;
    let {startDate, endDate} = this.state;
    if (startDate) {
      let obj = {
        dateTime: newTime,
        startDate: endDate ? startDate : startDate?.clone().set({hour: newTime[0], minute: newTime[1], second: newTime[2] || 0}),
        endDate: !endDate ? endDate : endDate?.clone().set({hour: newTime[0], minute: newTime[1], second: newTime[2] || 0})
      };
      this.setState(obj, () => {
        onChange && onChange(this.state);
      });
    }
  }

  @autobind
  checkIsValidDate(currentDate: moment.Moment) {
    const {startDate, endDate, minDate, maxDate} = this.state;
    let {minDuration, maxDuration, viewMode} = this.props;
    const precision = viewMode === 'time' ? 'hours' : viewMode || 'day';

    if (minDate && currentDate.isBefore(minDate, precision)) {
      return false;
    }
    else if (maxDate && currentDate.isAfter(maxDate, precision)) {
      return false;
    }
    else if (startDate && !endDate) {
      if (minDuration
        && currentDate.isBefore(startDate.clone().add(minDuration))
        && currentDate.isSameOrAfter(startDate)) {
        return false;
      }
      else if (maxDuration && currentDate.isAfter(startDate.clone().add(maxDuration))) {
        return false;
      }
    }

    return true;
  }

  @autobind
  renderMobileDay(props: any, currentDate: moment.Moment) {
    const cx = this.props.classnames;
    const renderProps = this.getRenderProps(props, currentDate);

    return <td {...renderProps.props}>
      <div className="calendar-wrap" onClick={() => this.handleCalendarClick(renderProps.rdtDisabled)}>
        {currentDate.date()}
        <div className={cx('CalendarMobile-range-text')}>{renderProps.footerText}</div>
      </div>
    </td>;
  }

  @autobind
  renderMonth(props: any, month: number, year: number) {
    const cx = this.props.classnames;
    const currentDate = moment().year(year).month(month);
    const monthStr = currentDate
      .localeData()
      .monthsShort(currentDate.month(month));
    const strLength = 3;
    const monthStrFixedLength = monthStr.substring(0, strLength);
    const renderProps = this.getRenderProps(props, currentDate);

    return (
      <td {...renderProps.props}>
        <div className="calendar-wrap" onClick={() => this.handleCalendarClick(renderProps.rdtDisabled)}>
          {monthStrFixedLength}
          <div className={cx('CalendarMobile-range-text')}>{renderProps.footerText}</div>
        </div>
      </td>
    );
  }

  @autobind
  renderQuarter(props: any, quarter: number, year: number) {
    const cx = this.props.classnames;
    const currentDate = moment().year(year).quarter(quarter);
    const renderProps = this.getRenderProps(props, currentDate);

    return (
      <td {...props}>
        <div className="calendar-wrap" onClick={() => this.handleCalendarClick(renderProps.rdtDisabled)}>
          Q{quarter}
          <div className={cx('CalendarMobile-range-text')}>{renderProps.footerText}</div>
        </div>
      </td>
    );
  }

  @autobind
  handleMobileChange(newValue: moment.Moment) {
    const {embed, minDuration, maxDuration, confirm, onChange, viewMode, isDatePicker} = this.props;
    const {startDate, endDate, dateTime, minDate, maxDate} = this.state;
    const precision = viewMode === 'time' ? 'hours' : viewMode || 'day';

    if (minDate && newValue && newValue.isBefore(minDate, 'second')) {
      newValue = minDate;
    }

    if (maxDate && newValue && newValue.isAfter(maxDate, 'second')) {
      newValue = maxDate;
    }

    if (
      !isDatePicker &&
      startDate &&
      !endDate &&
      newValue.isSameOrAfter(startDate) &&
      (!minDuration || newValue.isSameOrAfter(startDate.clone().add(minDuration))) &&
      (!maxDuration || newValue.isSameOrBefore(startDate.clone().add(maxDuration)))
    ) {
      return this.setState(
        {
          endDate: newValue.clone().endOf(precision).set({hour: dateTime[0], minute: dateTime[1], second: dateTime[2] || 0})
        },
        () => {
          onChange && onChange(this.state, () => embed && confirm && confirm(startDate, endDate));
        }
      );
    }

    this.setState(
      {
        startDate: newValue.clone().startOf(precision).set({hour: dateTime[0], minute: dateTime[1], second: dateTime[2] || 0}),
        endDate: undefined
      },
      () => {
        onChange && onChange(this.state);
      }
    );
  }

  @autobind
  renderMobileCalendarBody() {
    const {
      classnames: cx,
      dateFormat,
      timeFormat,
      inputFormat,
      locale,
      viewMode = 'days',
      close,
      defaultDate,
      showViewMode
    } = this.props;
    const __ = this.props.translate;

    const {minDate, maxDate} = this.state;
    if (!minDate || !maxDate) {
      return;
    }
    let calendarDates: moment.Moment[] = [];
    for(let minDateClone = minDate.clone(); minDateClone.isSameOrBefore(maxDate); minDateClone.add(1, showViewMode)) {
      let date = minDateClone.clone();
      if (defaultDate) {
        date = moment(defaultDate).set({year: date.get('year'), month: date.get('month')});
      }
      calendarDates.push(date);
    }

    return (
      <div className={cx('CalendarMobile-body')} ref={this.mobileBody}
        onScroll={this.onMobileBodyScroll}>
        {calendarDates.map((calendarDate: moment.Moment, index: number) => {
          const rdtOldNone = showViewMode === 'months'
            && calendarDate.clone().startOf('month').day() === 1
            ? 'rdtOldNone' : '';

          return <div className={cx('CalendarMobile-calendar-wrap', rdtOldNone)} key={'calendar-wrap' + index}>
            {showViewMode === 'months' && <div className={cx('CalendarMobile-calendar-mark')} key={'calendar-mark' + index}>
              {calendarDate.month() + 1}
            </div>}
            <div className={cx('CalendarMobile-calendar-header')}>
              <span className="rdtSwitch">
                {calendarDate.format(__('dateformat.year'))}
              </span>
              {showViewMode === 'months' && <span className="rdtSwitch">
                {calendarDate.format(__('MMM'))}
              </span>}
            </div>
            <Calendar
              className={cx('CalendarMobile-calendar', rdtOldNone)}
              viewDate={calendarDate}
              value={calendarDate}
              onChange={this.handleMobileChange}
              requiredConfirm={false}
              dateFormat={dateFormat}
              inputFormat={inputFormat}
              timeFormat=''
              isValidDate={this.checkIsValidDate}
              viewMode={viewMode}
              input={false}
              onClose={close}
              renderDay={this.renderMobileDay}
              renderMonth={this.renderMonth}
              renderQuarter={this.renderQuarter}
              locale={locale}
              hideHeader={true}
              updateOn={viewMode}
              key={'calendar' + index}
            />
          </div>
        })}
      </div>
    );
  }

  @autobind
  renderMobileTimePicker() {
    const {
      classnames: cx,
      timeFormat,
      locale,
      close,
      timeConstraints,
      defaultDate,
      isDatePicker
    } = this.props;
    const __ = this.props.translate;

    const {startDate, endDate, dateTime} = this.state;

    return (
      <div className={cx('CalendarMobile-time')}>
        <div className={cx('CalendarMobile-time-title')}>
          {isDatePicker ? __('Date.titleTime') : startDate && endDate ? __('Calendar.endPick') : __('Calendar.startPick')}
        </div>
        <Calendar
          className={cx('CalendarMobile-time-calendar')}
          value={defaultDate}
          onChange={this.handleTimeChange}
          requiredConfirm={false}
          timeFormat={timeFormat}
          viewMode="time"
          input={false}
          onClose={close}
          locale={locale}
          useMobileUI={true}
          showToolbar={false}
          viewDate={moment().set({hour: dateTime[0], minute: dateTime[1], second: dateTime[2] || 0})}
          timeConstraints={timeConstraints}
          isValidDate={this.checkIsValidDate}
        />
      </div>
    );
  }


  render() {
    const {
      className,
      classnames: cx,
      embed,
      close,
      confirm,
      footerExtra,
      timeFormat,
      showViewMode,
      isDatePicker
    } = this.props;
    const __ = this.props.translate;

    const {startDate, endDate, currentDate, showToast, isScrollToBottom, minDate, maxDate} = this.state;
    let dateNow = currentDate
      ? currentDate.format(__(`Calendar.${showViewMode === 'months' ? 'yearmonth' : 'year'}`))
      : moment().format(__(`Calendar.${showViewMode === 'months' ? 'yearmonth' : 'year'}`));

    const header = (
      <div className={cx('CalendarMobile-header')} ref={this.mobileHeader}>
        <div className={cx('CalendarMobile-subtitle')}>
          <span className="subtitle-text">
            {currentDate && currentDate.isSameOrBefore(minDate, showViewMode)
              ? null
              : <a className="rdtPrev" onClick={this.scrollPreYear}>&lsaquo;</a>}
            {dateNow}
            {currentDate && currentDate.isSameOrAfter(maxDate, showViewMode) || isScrollToBottom
              ? null
              : <a className="rdtNext" onClick={this.scrollAfterYear}>&rsaquo;</a>}
          </span>
        </div>
        {showViewMode === 'months' ? <div className={cx('CalendarMobile-weekdays')}>
          {this.getDaysOfWeek().map((day: string, index: number) => (
            <span key={day + index} className="weekday">
              {day}
            </span>
          ))}
        </div> : null}
      </div>
    );

    const footer = (
      <div className={cx('CalendarMobile-footer')}>
        {timeFormat && startDate && this.renderMobileTimePicker()}
        <div className={cx('CalendarMobile-footer-toolbar')}>
          <div className={cx('CalendarMobile-footer-ranges')}>
            {footerExtra}
          </div>
          {confirm && !embed && <a
            className={cx('Button', 'Button--primary', 'date-range-confirm', {
              'is-disabled': !startDate || !(endDate || isDatePicker)
            })}
            onClick={() => {
              confirm(startDate, endDate);
              close && close();
            }}
          >
            {__('confirm')}
          </a>}
        </div>
      </div>
    );

    return (
      <div className={cx('CalendarMobile',
        embed ? 'CalendarMobile-embed' : '',
        className)}>
        <div className={cx('CalendarMobile-wrap')}>
          {header}
          {this.renderMobileCalendarBody()}
          {footer}
        </div>
        {showToast? <div className={cx('CalendarMobile-toast')}>{__('Calendar.toast')}</div> : null}
      </div>
    );
  }
};

export default themeable(localeable(CalendarMobile));
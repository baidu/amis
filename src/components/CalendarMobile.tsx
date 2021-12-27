/**
 * @file CalendarMobile
 * @description 移动端日历组件
 * @author hongyang03
 */

import React from 'react';
import moment from 'moment';
import {Icon} from './icons';
import Calendar from './calendar/Calendar';
import {themeable, ThemeProps} from '../theme';
import {LocaleProps, localeable} from '../locale';

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
  confirm?: () => void;
  onChange?: (data: any, callback?: () => void) => void;
  footerExtra?: JSX.Element | null;
}

export interface CalendarMobileState {
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  minDate: moment.Moment;
  maxDate: moment.Moment;
  monthHeights?: number[];
  currentDate: moment.Moment;
  showViewMode: 'years' | 'months';
  showToast: boolean;
  isScrollToBottom: boolean;
  dateTime: any;
}

export class CalendarMobile extends React.Component<
  CalendarMobileProps,
  CalendarMobileState
> {

  mobileBody: any;
  mobileHeader: any;

  constructor(props: CalendarMobileProps) {
    super(props);

    this.mobileBody = React.createRef();
    this.mobileHeader = React.createRef();

    this.renderQuarter = this.renderQuarter.bind(this);
    this.renderMonth = this.renderMonth.bind(this);
    this.renderMobileDay = this.renderMobileDay.bind(this);
    this.renderMobileCalendarBody = this.renderMobileCalendarBody.bind(this);
    this.onMobileBodyScroll = this.onMobileBodyScroll.bind(this);
    this.handleMobileChange = this.handleMobileChange.bind(this);
    this.checkIsValidDate = this.checkIsValidDate.bind(this);
    this.scrollPreYear = this.scrollPreYear.bind(this);
    this.scrollAfterYear = this.scrollAfterYear.bind(this);
    this.handleCalendarClick = this.handleCalendarClick.bind(this);
    this.renderMobileTimePicker = this.renderMobileTimePicker.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);

    const {minDate, maxDate, startDate, endDate, viewMode} = this.props;

    const showViewMode = viewMode === 'quarters' || viewMode === 'months' ? 'years' : 'months';

    this.state = {
      minDate: minDate || moment().subtract(1, 'year').startOf(showViewMode),
      maxDate: maxDate || moment().add(1, 'year').endOf(showViewMode),
      startDate,
      endDate,
      showViewMode,
      showToast: false,
      currentDate: moment(),
      isScrollToBottom: false,
      dateTime: endDate ? [endDate.hour(), endDate.minute()] : [0, 0]
    };
  }

  componentDidMount() {
    this.initMonths();
  }

  componentDidUpdate(prevProps: CalendarMobileProps) {
    const props = this.props;

    if (prevProps.minDate !== props.minDate || prevProps.maxDate !== props.maxDate) {
      this.initMonths();
    }
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
      this.scollToDate(moment());
    }
  }

  scollToDate(date: moment.Moment) {
    const {minDate, showViewMode} = this.state;
    const index = date.diff(minDate, showViewMode);
    const currentEl = this.mobileBody.current.children[index];
    const header = this.mobileHeader.current;
    this.mobileBody.current.scrollBy(0, currentEl.offsetTop - this.mobileBody.current.scrollTop - header.clientHeight);
  }

  onMobileBodyScroll(e: any) {
    const {monthHeights, showViewMode} = this.state;
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

  scrollPreYear() {
    if (!this.state.currentDate) {
      return;
    }
    let {minDate, currentDate} = this.state;
    currentDate = currentDate.clone().subtract(1, 'years');
    if (currentDate.isBefore(minDate)) {
      currentDate = minDate;
    }
    this.setState({
      currentDate
    });
    this.scollToDate(currentDate);
  }

  scrollAfterYear() {
    if (!this.state.currentDate) {
      return;
    }
    let {maxDate, currentDate} = this.state;
    currentDate = currentDate.clone().add(1, 'years');
    if (currentDate.isAfter(maxDate)) {
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
    const	first = locale.firstDayOfWeek();
    const	dow: string[] = [];
    let	i = 0;
    
    days.forEach((day: string) => {
      dow[ (7 + ( i++ ) - first) % 7 ] = day;
    });
    
    return dow;
  }

  handleCalendarClick(isDisabled: boolean) {
    if (isDisabled) {
      this.setState({showToast: true});
      setTimeout(() => {
        this.setState({showToast: false});
      }, 2000);
    }
  }

  getRenderProps(props: any, currentDate: moment.Moment) {
    let {startDate, endDate} = this.state;
    const {translate: __, viewMode} = this.props;
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

    const rdtDisabled = props.className.indexOf('rdtDisabled') > -1;

    return {
      props,
      footerText,
      rdtDisabled
    };
  }

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

  handleMobileChange(newValue: moment.Moment) {
    const {embed, minDuration, maxDuration, confirm, onChange, viewMode} = this.props;
    const {startDate, endDate, minDate, maxDate, dateTime} = this.state;
    const precision = viewMode === 'time' ? 'hours' : viewMode || 'day';

    if (minDate && newValue && newValue.isBefore(minDate, 'second')) {
      newValue = minDate;
    }

    if (maxDate && newValue && newValue.isAfter(maxDate, 'second')) {
      newValue = maxDate;
    }

    if (
      startDate &&
      !endDate &&
      newValue.isSameOrAfter(startDate) &&
      (!minDuration || newValue.isSameOrAfter(startDate.clone().add(minDuration))) &&
      (!maxDuration || newValue.isSameOrBefore(startDate.clone().add(maxDuration)))
    ) {
      return this.setState(
        {
          endDate: newValue.clone().endOf(precision).set({hour: dateTime[0], minute: dateTime[1], second: 0})
        },
        () => {
          onChange && onChange(this.state, () => embed && confirm && confirm());
        }
      );
    }

    this.setState(
      {
        startDate: newValue.clone().startOf(precision).set({hour: dateTime[0], minute: dateTime[1], second: 0}),
        endDate: undefined
      },
      () => {
        onChange && onChange(this.state);
      }
    );
  }

  handleTimeChange(newTime: any) {
    if (!newTime) {
      return;
    }
    const onChange = this.props.onChange;
    this.setState({
      dateTime: newTime
    });
    let {startDate, endDate} = this.state;
    if (startDate && endDate) {
      this.setState({
        endDate: endDate?.clone().set({hour: newTime[0], minute: newTime[1], second: 0})
      },
      () => {
        onChange && onChange(this.state);
      });
    }
    else if (startDate && !endDate) {
      this.setState({
        startDate: startDate?.clone().set({hour: newTime[0], minute: newTime[1], second: 0})
      },
      () => {
        onChange && onChange(this.state);
      });
    }
  }

  checkIsValidDate(currentDate: moment.Moment) {
    let {startDate, endDate, minDate, maxDate} = this.state;
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

  renderMobileCalendarBody() {
    const {
      classnames: cx,
      dateFormat,
      timeFormat,
      inputFormat,
      locale,
      viewMode = 'days',
      close
    } = this.props;
    const __ = this.props.translate;

    const {minDate, maxDate, showViewMode} = this.state;
    if (!minDate || !maxDate) {
      return;
    }
    let calendarDates: moment.Moment[] = [];
    for(let minDateClone = minDate.clone(); minDateClone.isSameOrBefore(maxDate); minDateClone.add(1, showViewMode)) {
      calendarDates.push(minDateClone.clone());
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

  renderMobileTimePicker() {
    const {
      classnames: cx,
      timeFormat,
      locale,
      close
    } = this.props;
    const __ = this.props.translate;

    const {startDate, endDate, dateTime} = this.state;

    return (
      <div className={cx('CalendarMobile-time')}>
        <div className={cx('CalendarMobile-time-title')}>
          {startDate && endDate ? __('Calendar.endPick') : __('Calendar.startPick')}
        </div>
        <Calendar
          className={cx('CalendarMobile-time-calendar')}
          onChange={this.handleTimeChange}
          requiredConfirm={false}
          timeFormat={timeFormat}
          viewMode="time"
          input={false}
          onClose={close}
          locale={locale}
          useMobileUI={true}
          showToolbar={false}
          viewDate={moment().set({hour: dateTime[0], minute: dateTime[1], second: 0})}
        />
      </div>
    );
  }


  render() {
    const {
      className,
      classnames: cx,
      embed,
      confirm,
      close,
      footerExtra,
      timeFormat
    } = this.props;
    const __ = this.props.translate;

    const {startDate, endDate, currentDate, showViewMode, showToast, minDate, maxDate, isScrollToBottom} = this.state;
    let dateNow = currentDate
      ? currentDate.format(__(`Calendar.${showViewMode === 'months' ? 'yearmonth' : 'year'}`))
      : moment().format(__(`Calendar.${showViewMode === 'months' ? 'yearmonth' : 'year'}`));

    const header = (
      <div className={cx('CalendarMobile-header')} ref={this.mobileHeader}>
        <div className={cx('CalendarMobile-title')}>{__('Calendar.datepicker')}</div>
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
        {close && !embed && <a className={cx('CalendarMobile-close')}>
          <Icon icon="close" className="icon" onClick={close} />
        </a>}
      </div>
    );

    const footer = (
      <div className={cx('CalendarMobile-footer')}>
        {timeFormat && startDate && this.renderMobileTimePicker()}
        <div className={cx('CalendarMobile-footer-toolbar')}>
          {footerExtra}
          {confirm && !embed && <a
            className={cx('Button', 'Button--primary', 'date-range-confirm', {
              'is-disabled': !startDate || !endDate
            })}
            onClick={confirm}
          >
            {__('confirm')}
          </a>}
        </div>
      </div>
    );

    return (
      <div className={cx('CalendarMobile',
        embed ? 'CalendarMobile-embed' : 'CalendarMobile-pop',
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
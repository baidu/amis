/**
 * @file MonthRangePicker
 * @description 月份范围选择器
 * @author fex
 */

import React from 'react';
import moment from 'moment';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import {Icon} from './icons';
import {Overlay} from 'amis-core';
import Calendar from './calendar/Calendar';
import {PopOver} from 'amis-core';
import PopUp from './PopUp';
import {themeable, ThemeProps} from 'amis-core';

import {isMobile, noop} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import {DateRangePicker} from './DateRangePicker';
import capitalize from 'lodash/capitalize';
import {ShortCuts, ShortCutDateRange} from './DatePicker';
import {availableRanges} from './DateRangePicker';
import CalendarMobile from './CalendarMobile';
import type {PlainObject} from 'amis-core';

export interface MonthRangePickerProps extends ThemeProps, LocaleProps {
  className?: string;
  popoverClassName?: string;
  placeholder?: string;
  theme?: any;
  format: string;
  utc?: boolean;
  inputFormat?: string;
  timeFormat?: string;
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
  resetValue?: any;
  popOverContainer?: any;
  embed?: boolean;
  useMobileUI?: boolean;
  onFocus?: Function;
  onBlur?: Function;
  label?: string;
}

export interface MonthRangePickerState {
  isOpened: boolean;
  isFocused: boolean;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
}

export class MonthRangePicker extends React.Component<
  MonthRangePickerProps,
  MonthRangePickerState
> {
  static defaultProps = {
    placeholder: 'MonthRange.placeholder',
    format: 'YYYY-MM',
    inputFormat: 'YYYY-MM',
    joinValues: true,
    clearable: true,
    delimiter: ',',
    resetValue: '',
    closeOnSelect: true,
    overlayPlacement: 'auto'
  };

  innerDom: any;
  popover: any;
  input?: HTMLInputElement;

  dom: React.RefObject<HTMLDivElement>;
  nextMonth = moment().add(1, 'year').startOf('month');

  constructor(props: MonthRangePickerProps) {
    super(props);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
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
    this.renderMonth = this.renderMonth.bind(this);
    this.handleMobileChange = this.handleMobileChange.bind(this);
    const {format, joinValues, delimiter, value} = this.props;

    this.state = {
      isOpened: false,
      isFocused: false,
      ...DateRangePicker.unFormatValue(value, format, joinValues, delimiter)
    };
  }

  componentDidUpdate(prevProps: MonthRangePickerProps) {
    const props = this.props;
    const {value, format, joinValues, delimiter} = props;

    if (prevProps.value !== value) {
      this.setState({
        ...DateRangePicker.unFormatValue(value, format, joinValues, delimiter)
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

  close() {
    this.setState(
      {
        isOpened: false
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

    value = value[type === 'start' ? 'startOf' : 'endOf']('month');

    return value;
  }

  handleStartChange(newValue: moment.Moment) {
    const {embed, minDuration, maxDuration} = this.props;
    const {startDate, endDate} = this.state;

    if (
      startDate &&
      !endDate &&
      newValue.isSameOrAfter(startDate) &&
      (!minDuration || newValue.isAfter(startDate.clone().add(minDuration))) &&
      (!maxDuration || newValue.isBefore(startDate.clone().add(maxDuration)))
    ) {
      return this.setState(
        {
          endDate: this.filterDate(newValue, endDate, '', 'end')
        },
        () => {
          embed && this.confirm();
        }
      );
    }

    this.setState(
      {
        startDate: this.filterDate(newValue, startDate, '', 'start')
      },
      () => {
        embed && this.confirm();
      }
    );
  }

  handleEndChange(newValue: moment.Moment) {
    const {embed, minDuration, maxDuration} = this.props;
    const {startDate, endDate} = this.state;

    if (
      endDate &&
      !startDate &&
      newValue.isSameOrBefore(endDate) &&
      (!minDuration ||
        newValue.isBefore(endDate.clone().subtract(minDuration))) &&
      (!maxDuration || newValue.isAfter(endDate.clone().subtract(maxDuration)))
    ) {
      return this.setState(
        {
          startDate: this.filterDate(newValue, startDate, '', 'start')
        },
        () => {
          embed && this.confirm();
        }
      );
    }

    this.setState(
      {
        endDate: this.filterDate(newValue, endDate, '', 'end')
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
    this.setState(
      {
        startDate: minDate
          ? moment.max(range.startDate(moment()), minDate)
          : range.startDate(moment()),
        endDate: maxDate
          ? moment.min(maxDate, range.endDate(moment()))
          : range.endDate(moment())
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
            range = availableRanges[item];
            range.key = item;
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
    const {onChange} = this.props;

    onChange('');
  }

  checkStartIsValidDate(currentDate: moment.Moment) {
    let {endDate, startDate} = this.state;

    let {minDate, maxDate, minDuration, maxDuration} = this.props;

    maxDate =
      maxDate && endDate
        ? maxDate.isBefore(endDate)
          ? maxDate
          : endDate
        : maxDate || endDate;

    if (minDate && currentDate.isBefore(minDate, 'day')) {
      return false;
    } else if (maxDate && currentDate.isAfter(maxDate, 'day')) {
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

    let {minDate, maxDate, minDuration, maxDuration} = this.props;

    minDate =
      minDate && startDate
        ? minDate.isAfter(startDate)
          ? minDate
          : startDate
        : minDate || startDate;

    if (minDate && currentDate.isBefore(minDate, 'day')) {
      return false;
    } else if (maxDate && currentDate.isAfter(maxDate, 'day')) {
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

  renderMonth(props: any, month: number, year: number) {
    var currentDate = moment().year(year).month(month);
    var monthStr = currentDate
      .localeData()
      .monthsShort(currentDate.month(month));
    var strLength = 3;
    var monthStrFixedLength = monthStr.substring(0, strLength);
    const {startDate, endDate} = this.state;

    if (
      startDate &&
      endDate &&
      currentDate.isBetween(startDate, endDate, 'month', '[]')
    ) {
      props.className += ' rdtBetween';
    }

    return (
      <td {...props}>
        <span>{capitalize(monthStrFixedLength)}</span>
      </td>
    );
  }

  renderCalendar() {
    const {
      classPrefix: ns,
      classnames: cx,
      locale,
      embed,
      ranges,
      inputFormat,
      timeFormat
    } = this.props;
    const __ = this.props.translate;
    const viewMode: 'months' = 'months';
    const dateFormat = 'YYYY-MM';
    const {startDate, endDate} = this.state;

    return (
      <div className={`${ns}DateRangePicker-wrap`}>
        {this.renderRanges(ranges)}
        <Calendar
          className={`${ns}DateRangePicker-start`}
          value={startDate}
          onChange={this.handleStartChange}
          requiredConfirm={false}
          dateFormat={dateFormat}
          inputFormat={inputFormat}
          timeFormat={timeFormat}
          isValidDate={this.checkStartIsValidDate}
          viewMode={viewMode}
          input={false}
          onClose={this.close}
          renderMonth={this.renderMonth}
          locale={locale}
        />

        <Calendar
          className={`${ns}DateRangePicker-end`}
          value={
            // 因为如果最后一天，切换月份的时候会切不了,有的月份有 31 号，有的没有。
            endDate?.clone().startOf('month')
          }
          onChange={this.handleEndChange}
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
          renderMonth={this.renderMonth}
          locale={locale}
        />

        {embed ? null : (
          <div key="button" className={cx('DateRangePicker-actions')}>
            <a className={cx('Button', 'Button--default')} onClick={this.close}>
              {__('cancel')}
            </a>
            <a
              className={cx('Button', 'Button--primary', 'm-l-sm', {
                'is-disabled': !this.state.startDate || !this.state.endDate
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

  render() {
    const {
      className,
      popoverClassName,
      classPrefix: ns,
      value,
      placeholder,
      popOverContainer,
      inputFormat,
      format,
      joinValues,
      delimiter,
      clearable,
      disabled,
      embed,
      overlayPlacement,
      useMobileUI,
      timeFormat,
      minDate,
      maxDate,
      minDuration,
      maxDuration,
      ranges
    } = this.props;
    const mobileUI = isMobile() && useMobileUI;

    const {isOpened, isFocused, startDate, endDate} = this.state;

    const selectedDate = DateRangePicker.unFormatValue(
      value,
      format,
      joinValues,
      delimiter
    );
    const startViewValue = selectedDate.startDate
      ? selectedDate.startDate.format(inputFormat)
      : '';
    const endViewValue = selectedDate.endDate
      ? selectedDate.endDate.format(inputFormat)
      : '';
    const arr = [];
    startViewValue && arr.push(startViewValue);
    endViewValue && arr.push(endViewValue);
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
        embed={embed}
        viewMode="months"
        close={this.close}
        confirm={this.confirm}
        onChange={this.handleMobileChange}
        footerExtra={this.renderRanges(ranges)}
        showViewMode="years"
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
          {mobileUI ? calendarMobile : this.renderCalendar()}
        </div>
      );
    }

    const CalendarMobileTitle = (
      <div className={`${ns}CalendarMobile-title`}>
        {this.props.label ?? __('Calendar.datepicker')}
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
            'is-mobile': useMobileUI && isMobile()
          },
          className
        )}
        ref={this.dom}
        onClick={this.handleClick}
      >
        {arr.length ? (
          <span className={`${ns}DateRangePicker-value`}>
            {arr.join(__('DateRange.valueConcat'))}
          </span>
        ) : (
          <span className={`${ns}DateRangePicker-placeholder`}>
            {__(placeholder)}
          </span>
        )}

        {clearable && !disabled && value ? (
          <a className={`${ns}DateRangePicker-clear`} onClick={this.clearValue}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}

        <a className={`${ns}DateRangePicker-toggler`}>
          <Icon icon="clock" className="icon" />
        </a>

        {isOpened ? (
          mobileUI ? (
            <PopUp
              isShow={isOpened}
              container={popOverContainer}
              className={cx(`${ns}CalendarMobile-pop`)}
              onHide={this.close}
              header={CalendarMobileTitle}
            >
              {calendarMobile}
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
                overlay
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

export default themeable(localeable(MonthRangePicker));

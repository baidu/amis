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
import Overlay from './Overlay';
import Calendar from './calendar/Calendar';
import PopOver from './PopOver';
import {themeable, ThemeProps} from '../theme';
import {PlainObject} from '../types';
import {noop} from '../utils/helper';
import {LocaleProps, localeable} from '../locale';
import {DateRangePicker} from './DateRangePicker';
import capitalize from 'lodash/capitalize';

export interface MonthRangePickerProps extends ThemeProps, LocaleProps {
  className?: string;
  placeholder?: string;
  theme?: any;
  format: string;
  utc?: boolean;
  inputFormat?: string;
  // ranges?: string | Array<ShortCuts>;
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
    const {format, joinValues, delimiter, value} = this.props;

    this.state = {
      isOpened: false,
      isFocused: false,
      ...DateRangePicker.unFormatValue(value, format, joinValues, delimiter)
    };
  }

  componentWillReceiveProps(nextProps: MonthRangePickerProps) {
    const props = this.props;
    const {value, format, joinValues, delimiter} = nextProps;

    if (props.value !== value) {
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

  clearValue(e: React.MouseEvent<any>) {
    e.preventDefault();
    e.stopPropagation();
    const {resetValue, onChange} = this.props;

    onChange(resetValue);
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
    const {classPrefix: ns, locale, embed} = this.props;
    const __ = this.props.translate;
    const viewMode: 'months' = 'months';
    const dateFormat = 'YYYY-MM';
    const {startDate, endDate} = this.state;

    return (
      <div className={`${ns}DateRangePicker-wrap`}>
        <Calendar
          className={`${ns}DateRangePicker-start`}
          value={startDate}
          onChange={this.handleStartChange}
          requiredConfirm={false}
          dateFormat={dateFormat}
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
          <div key="button" className={`${ns}DateRangePicker-actions`}>
            <a
              className={cx('rdtBtn rdtBtnConfirm', {
                'is-disabled': !this.state.startDate || !this.state.endDate
              })}
              onClick={this.confirm}
            >
              {__('confirm')}
            </a>
            <a className="rdtBtn rdtBtnCancel" onClick={this.close}>
              {__('cancle')}
            </a>
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      className,
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
      overlayPlacement
    } = this.props;

    const {isOpened, isFocused} = this.state;

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
          {this.renderCalendar()}
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
          `${ns}DateRangePicker`,
          {
            'is-disabled': disabled,
            'is-focused': isFocused
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
          <Icon icon="calendar" className="icon" />
        </a>

        {isOpened ? (
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
              className={`${ns}DateRangePicker-popover`}
              onHide={this.close}
              onClick={this.handlePopOverClick}
              overlay
            >
              {this.renderCalendar()}
            </PopOver>
          </Overlay>
        ) : null}
      </div>
    );
  }
}

export default themeable(localeable(MonthRangePicker));

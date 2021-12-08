/**
 * @file DateRangePicker
 * @description 自定义日期范围时间选择器组件
 * @author fex
 */

import React from 'react';
import moment from 'moment';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import {Icon} from './icons';
import Overlay from './Overlay';
import {ShortCuts, ShortCutDateRange} from './DatePicker';
import Calendar from './calendar/Calendar';
import PopOver from './PopOver';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {PlainObject} from '../types';
import {noop, ucFirst} from '../utils/helper';
import {LocaleProps, localeable} from '../locale';

export interface DateRangePickerProps extends ThemeProps, LocaleProps {
  className?: string;
  popoverClassName?: string;
  placeholder?: string;
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
}

export interface DateRangePickerState {
  isOpened: boolean;
  isFocused: boolean;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
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

  '1dayago': {
    label: 'DateRange.1dayago',
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

export class DateRangePicker extends React.Component<
  DateRangePickerProps,
  DateRangePickerState
> {
  static defaultProps = {
    placeholder: 'DateRange.placeholder',
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

  constructor(props: DateRangePickerProps) {
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
    this.renderDay = this.renderDay.bind(this);
    this.renderQuarter = this.renderQuarter.bind(this);
    const {format, joinValues, delimiter, value} = this.props;

    this.state = {
      isOpened: false,
      isFocused: false,
      ...DateRangePicker.unFormatValue(value, format, joinValues, delimiter)
    };
  }

  componentDidUpdate(prevProps: DateRangePickerProps) {
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

  handleStartChange(newValue: moment.Moment) {
    const {embed, timeFormat, minDuration, maxDuration, minDate} = this.props;
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
          endDate: this.filterDate(newValue, endDate, timeFormat, 'end')
        },
        () => {
          embed && this.confirm();
        }
      );
    }

    if (minDate && newValue && newValue.isBefore(minDate, 'second')) {
      newValue = minDate;
    }

    this.setState(
      {
        startDate: this.filterDate(
          newValue,
          startDate || minDate,
          timeFormat,
          'start'
        )
      },
      () => {
        embed && this.confirm();
      }
    );
  }

  handleEndChange(newValue: moment.Moment) {
    const {embed, timeFormat, minDuration, maxDuration, maxDate} = this.props;
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
          startDate: this.filterDate(newValue, startDate, timeFormat, 'start')
        },
        () => {
          embed && this.confirm();
        }
      );
    }

    if (maxDate && newValue && newValue.isAfter(maxDate, 'second')) {
      newValue = maxDate;
    }

    this.setState(
      {
        endDate: this.filterDate(
          newValue,
          endDate || maxDate,
          timeFormat,
          'end'
        )
      },
      () => {
        embed && this.confirm();
      }
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
    const {resetValue, onChange} = this.props;

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
          onChange={this.handleStartChange}
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
      borderMode
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
            'is-focused': isFocused,
            [`${ns}DateRangePicker--border${ucFirst(borderMode)}`]: borderMode
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
        ) : null}
      </div>
    );
  }
}

export default themeable(localeable(DateRangePicker));

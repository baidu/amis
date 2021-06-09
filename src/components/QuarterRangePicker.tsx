/**
 * @file QuarterRangePicker
 * @description 季度范围选择器
 * @author xuzhendong
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
import {ShortCuts, ShortCutDateRange} from './DatePicker';
import {LocaleProps, localeable} from '../locale';
import {DateRangePicker} from './DateRangePicker';

export interface QuarterRangePickerProps extends ThemeProps, LocaleProps {
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
  disabled?: boolean;
  closeOnSelect?: boolean;
  overlayPlacement: string;
  resetValue?: any;
  popOverContainer?: any;
  embed?: boolean;
}
 
export interface QuarterRangePickerState {
  isOpened: boolean;
  isFocused: boolean;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
}
 
export class QuarterRangePicker extends React.Component<
  QuarterRangePickerProps,
  QuarterRangePickerState
> {
  static defaultProps = {
    placeholder: 'QuarterRange.placeholder',
    format: 'YYYY-[Q]Q',
    inputFormat: 'YYYY-[Q]Q',
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
  nextQuarter = moment().add(1, 'year').startOf('quarter');

  constructor(props: QuarterRangePickerProps) {
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
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePopOverClick = this.handlePopOverClick.bind(this);
    this.dom = React.createRef();
    const {format, joinValues, delimiter, value} = this.props;

    this.state = {
      isOpened: false,
      isFocused: false,
      ...DateRangePicker.unFormatValue(value, format, joinValues, delimiter)
    };
  }

  componentWillReceiveProps(nextProps: QuarterRangePickerProps) {
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
    return date.clone()[type === 'start' ? 'startOf' : 'endOf']('quarter');
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
    const {endDate} = this.state;
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
    const {startDate} = this.state;
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

  renderQuarter(props: any, quarter: number, year: number) {
    const currentDate = moment().year(year).quarter(quarter);
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
        <span>Q{quarter}</span>
      </td>
    );
  }

  renderCalendar() {
    const {classPrefix: ns, classnames: cx, locale, embed, inputFormat = 'YYYY-[Q]Q'} = this.props;
    const __ = this.props.translate;
    const viewMode: 'quarters' = 'quarters';
    const dateFormat = 'YYYY-[Q]Q';
    const {startDate, endDate} = this.state;

    return (
      <div className={`${ns}DateRangePicker-wrap`}>
        <Calendar
          className={`${ns}DateRangePicker-start`}
          value={startDate}
          onChange={this.handleStartChange}
          requiredConfirm={false}
          dateFormat={dateFormat}
          inputFormat={inputFormat}
          isValidDate={this.checkStartIsValidDate}
          viewMode={viewMode}
          input={false}
          onClose={this.close}
          locale={locale}
          renderQuarter={this.renderQuarter.bind(this)}
        />

        <Calendar
          className={`${ns}DateRangePicker-end`}
          value={endDate}
          onChange={this.handleEndChange}
          requiredConfirm={false}
          dateFormat={dateFormat}
          inputFormat={inputFormat}
          viewDate={this.nextQuarter}
          isEndDate
          isValidDate={this.checkEndIsValidDate}
          viewMode={viewMode}
          input={false}
          onClose={this.close}
          locale={locale}
          renderQuarter={this.renderQuarter.bind(this)}
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

export default themeable(localeable(QuarterRangePicker));

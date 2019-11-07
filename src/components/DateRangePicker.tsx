/**
 * @file DateRangePicker
 * @description 自定义日期范围时间选择器组件
 * @author fex
 */

import React = require('react');
import moment = require('moment');
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import {Icon} from './icons';
import Overlay from './Overlay';
import {BaseDatePicker} from './DatePicker';
import PopOver from './PopOver';
import {ClassNamesFn, themeable} from '../theme';

export interface DateRangePickerProps {
  className?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  placeholder?: string;
  theme?: any;
  format: string;
  inputFormat?: string;
  ranges?: string;
  clearable?: boolean;
  iconClassName?: string;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  joinValues: boolean;
  delimiter: string;
  value: any;
  onChange: (value: any) => void;
  data?: any;
  disabled?: boolean;
  [propName: string]: any;
}

export interface DateRangePickerState {
  isOpened: boolean;
  isFocused: boolean;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
}

const availableRanges: {[propName: string]: any} = {
  today: {
    label: '今天',
    startDate: (now: moment.Moment) => {
      return now.startOf('day');
    },
    endDate: (now: moment.Moment) => {
      return now;
    }
  },

  yesterday: {
    label: '昨天',
    startDate: (now: moment.Moment) => {
      return now.add(-1, 'days').startOf('day');
    },
    endDate: (now: moment.Moment) => {
      return now.add(-1, 'days').endOf('day');
    }
  },

  '1dayago': {
    label: '最近1天',
    startDate: (now: moment.Moment) => {
      return now.add(-1, 'days');
    },
    endDate: (now: moment.Moment) => {
      return now;
    }
  },

  '7daysago': {
    label: '最近7天',
    startDate: (now: moment.Moment) => {
      return now.add(-7, 'days');
    },
    endDate: (now: moment.Moment) => {
      return now;
    }
  },

  '90daysago': {
    label: '最近90天',
    startDate: (now: moment.Moment) => {
      return now.add(-90, 'days');
    },
    endDate: (now: moment.Moment) => {
      return now;
    }
  },

  prevweek: {
    label: '上周',
    startDate: (now: moment.Moment) => {
      return now.startOf('week').add(-1, 'weeks');
    },
    endDate: (now: moment.Moment) => {
      return now
        .startOf('week')
        .add(-1, 'days')
        .endOf('day');
    }
  },

  thismonth: {
    label: '本月',
    startDate: (now: moment.Moment) => {
      return now.startOf('month');
    },
    endDate: (now: moment.Moment) => {
      return now;
    }
  },

  prevmonth: {
    label: '上个月',
    startDate: (now: moment.Moment) => {
      return now.startOf('month').add(-1, 'month');
    },
    endDate: (now: moment.Moment) => {
      return now
        .startOf('month')
        .add(-1, 'day')
        .endOf('day');
    }
  },

  prevquarter: {
    label: '上个季节',
    startDate: (now: moment.Moment) => {
      return now.startOf('quarter').add(-1, 'quarter');
    },
    endDate: (now: moment.Moment) => {
      return now
        .startOf('quarter')
        .add(-1, 'day')
        .endOf('day');
    }
  },

  thisquarter: {
    label: '本季度',
    startDate: (now: moment.Moment) => {
      return now.startOf('quarter');
    },
    endDate: (now: moment.Moment) => {
      return now;
    }
  }
};

export class DateRangePicker extends React.Component<
  DateRangePickerProps,
  DateRangePickerState
> {
  static defaultProps = {
    placeholder: '请选择日期范围',
    format: 'X',
    inputFormat: 'YYYY-MM-DD',
    joinValues: true,
    clearable: true,
    delimiter: ',',
    ranges: 'yesterday,7daysago,prevweek,thismonth,prevmonth,prevquarter',
    iconClassName: 'fa fa-calendar',
    resetValue: ''
  };

  innerDom: any;
  popover: any;
  input?: HTMLInputElement;

  static formatValue(
    newValue: any,
    format: string,
    joinValues: boolean,
    delimiter: string
  ) {
    newValue = [
      newValue.startDate.format(format),
      newValue.endDate.format(format)
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

    const {format, joinValues, delimiter, value} = this.props;

    this.state = {
      isOpened: false,
      isFocused: false,
      ...DateRangePicker.unFormatValue(value, format, joinValues, delimiter)
    };
  }

  componentWillReceiveProps(nextProps: DateRangePickerProps) {
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
        this.props.delimiter
      )
    );
    this.close();
  }

  handleStartChange(newValue: any) {
    this.setState({
      startDate: newValue.clone()
    });
  }

  handleEndChange(newValue: any) {
    newValue =
      !this.state.endDate && !this.props.timeFormat
        ? newValue.endOf('day')
        : newValue;
    this.setState({
      endDate: newValue.clone()
    });
  }

  selectRannge(range: {
    startDate: (now: moment.Moment) => moment.Moment;
    endDate: (now: moment.Moment) => moment.Moment;
  }) {
    const now = moment();
    this.setState({
      startDate: range.startDate(now.clone()),
      endDate: range.endDate(now.clone())
    });
  }

  clearValue(e: React.MouseEvent<any>) {
    e.preventDefault();
    e.stopPropagation();
    const {resetValue, onChange} = this.props;

    onChange(resetValue);
  }

  checkStartIsValidDate(currentDate: moment.Moment) {
    let {endDate} = this.state;

    let {minDate, maxDate} = this.props;

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
    }

    return true;
  }

  checkEndIsValidDate(currentDate: moment.Moment) {
    let {startDate} = this.state;

    let {minDate, maxDate} = this.props;

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
    }

    return true;
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
      timeFormat,
      ranges,
      disabled,
      iconClassName
    } = this.props;

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
            {arr.join(' 至 ')}
          </span>
        ) : (
          <span className={`${ns}DateRangePicker-placeholder`}>
            {placeholder}
          </span>
        )}

        {clearable && !disabled && value ? (
          <a className={`${ns}DateRangePicker-clear`} onClick={this.clearValue}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}

        <a className={`${ns}DateRangePicker-toggler`}>
          <i className={iconClassName} />
        </a>

        {isOpened ? (
          <Overlay
            placement="left-bottom-left-top right-bottom-right-top"
            target={() => this.dom.current}
            onHide={this.close}
            container={popOverContainer || (() => findDOMNode(this))}
            rootClose={false}
            show
          >
            <PopOver
              classPrefix={ns}
              className={`${ns}DateRangePicker-popover`}
              onHide={this.close}
              onClick={this.handlePopOverClick}
              overlay
            >
              <div className={`${ns}DateRangePicker-wrap`}>
                {ranges ? (
                  <ul className={`${ns}DateRangePicker-rangers`}>
                    {(typeof ranges === 'string'
                      ? ranges.split(',')
                      : Array.isArray(ranges)
                      ? ranges
                      : []
                    )
                      .filter(key => !!availableRanges[key])
                      .map(key => (
                        <li
                          className={`${ns}DateRangePicker-ranger`}
                          onClick={() =>
                            this.selectRannge(availableRanges[key])
                          }
                          key={key}
                        >
                          <a>{availableRanges[key].label}</a>
                        </li>
                      ))}
                  </ul>
                ) : null}

                <BaseDatePicker
                  classPrefix={ns}
                  classnames={cx}
                  className={`${ns}DateRangePicker-start`}
                  value={startDate}
                  onChange={this.handleStartChange}
                  requiredConfirm={false}
                  dateFormat={format}
                  timeFormat={timeFormat}
                  isValidDate={this.checkStartIsValidDate}
                  viewMode="days"
                  input={false}
                  onClose={this.close}
                />

                <BaseDatePicker
                  classPrefix={ns}
                  classnames={cx}
                  className={`${ns}DateRangePicker-end`}
                  value={endDate}
                  onChange={this.handleEndChange}
                  requiredConfirm={false}
                  dateFormat={format}
                  timeFormat={timeFormat}
                  isEndDate={true}
                  isValidDate={this.checkEndIsValidDate}
                  viewMode="days"
                  input={false}
                  onClose={this.close}
                />

                <div key="button" className={`${ns}DateRangePicker-actions`}>
                  <a
                    className={cx('rdtBtn rdtBtnConfirm', {
                      'is-disabled':
                        !this.state.startDate || !this.state.endDate
                    })}
                    onClick={this.confirm}
                  >
                    确认
                  </a>
                  <a className="rdtBtn rdtBtnCancel" onClick={this.close}>
                    取消
                  </a>
                </div>
              </div>
            </PopOver>
          </Overlay>
        ) : null}
      </div>
    );
  }
}

export default themeable(DateRangePicker);

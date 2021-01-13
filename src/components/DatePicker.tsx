/**
 * @file DatePicker
 * @description 时间选择器组件
 * @author fex
 */

import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {Icon} from './icons';
import PopOver from './PopOver';
import Overlay from './Overlay';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {PlainObject} from '../types';
import Calendar from './calendar/Calendar';
import 'react-datetime/css/react-datetime.css';
import {localeable, LocaleProps, TranslateFn} from '../locale';

const availableShortcuts: {[propName: string]: any} = {
  now: {
    label: '现在',
    date: (now: moment.Moment) => {
      return now;
    }
  },
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
      return now.startOf('week').startOf('day');
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
    regexp: /^(\d+)hoursago$/,
    resolve: (__: TranslateFn, _: string, hours: string) => {
      return {
        label: __('{{hours}}小时前', {hours}),
        date: (now: moment.Moment) => {
          return now.subtract(hours, 'hours');
        }
      };
    }
  },
  {
    regexp: /^(\d+)hourslater$/,
    resolve: (__: TranslateFn, _: string, hours: string) => {
      return {
        label: __('{{hours}}小时后', {hours}),
        date: (now: moment.Moment) => {
          return now.add(hours, 'hours');
        }
      };
    }
  },
  {
    regexp: /^(\d+)daysago$/,
    resolve: (__: TranslateFn, _: string, days: string) => {
      return {
        label: __('{{days}}天前', {days}),
        date: (now: moment.Moment) => {
          return now.subtract(days, 'days');
        }
      };
    }
  },
  {
    regexp: /^(\d+)dayslater$/,
    resolve: (__: TranslateFn, _: string, days: string) => {
      return {
        label: __('{{days}}天后', {days}),
        date: (now: moment.Moment) => {
          return now.add(days, 'days');
        }
      };
    }
  },
  {
    regexp: /^(\d+)weeksago$/,
    resolve: (__: TranslateFn, _: string, weeks: string) => {
      return {
        label: __('{{weeks}}周前', {weeks}),
        date: (now: moment.Moment) => {
          return now.subtract(weeks, 'weeks');
        }
      };
    }
  },
  {
    regexp: /^(\d+)weekslater$/,
    resolve: (__: TranslateFn, _: string, weeks: string) => {
      return {
        label: __('{{weeks}}周后', {weeks}),
        date: (now: moment.Moment) => {
          return now.add(weeks, 'weeks');
        }
      };
    }
  },
  {
    regexp: /^(\d+)monthsago$/,
    resolve: (__: TranslateFn, _: string, months: string) => {
      return {
        label: __('{{months}}月前', {months}),
        date: (now: moment.Moment) => {
          return now.subtract(months, 'months');
        }
      };
    }
  },
  {
    regexp: /^(\d+)monthslater$/,
    resolve: (__: TranslateFn, _: string, months: string) => {
      return {
        label: __('{{months}}月后', {months}),
        date: (now: moment.Moment) => {
          return now.add(months, 'months');
        }
      };
    }
  },
  {
    regexp: /^(\d+)quartersago$/,
    resolve: (__: TranslateFn, _: string, quarters: string) => {
      return {
        label: __('{{quarters}}季度前', {quarters}),
        date: (now: moment.Moment) => {
          return now.subtract(quarters, 'quarters');
        }
      };
    }
  },
  {
    regexp: /^(\d+)quarterslater$/,
    resolve: (__: TranslateFn, _: string, quarters: string) => {
      return {
        label: __('{{quarters}}季度后', {quarters}),
        date: (now: moment.Moment) => {
          return now.add(quarters, 'quarters');
        }
      };
    }
  }
];

export type ShortCutDate = {
  label: string;
  date: moment.Moment;
};

export type ShortCutDateRange = {
  label: string;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
};

export type ShortCuts =
  | {
      label: string;
      value: string;
    }
  | ShortCutDate
  | ShortCutDateRange;

export interface DateProps extends LocaleProps, ThemeProps {
  viewMode: 'years' | 'months' | 'days' | 'time' | 'quarters';
  className?: string;
  placeholder?: string;
  inputFormat?: string;
  timeFormat?: string;
  format?: string;
  closeOnSelect: boolean;
  disabled?: boolean;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  clearable?: boolean;
  defaultValue?: any;
  utc?: boolean;
  onChange: (value: any) => void;
  value?: any;
  shortcuts: string | Array<ShortCuts>;
  overlayPlacement: string;
  minTime?: moment.Moment;
  maxTime?: moment.Moment;
  dateFormat?: string;
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
  popOverContainer?: any;

  // 是否为内嵌模式，如果开启就不是 picker 了，直接页面点选。
  embed?: boolean;

  // 下面那个千万不要写，写了就会导致 keyof DateProps 得到的结果是 string | number;
  // [propName: string]: any;
}

export interface DatePickerState {
  isOpened: boolean;
  isFocused: boolean;
  value: moment.Moment | undefined;
}

function normalizeValue(value: any, format?: string) {
  if (!value || value === '0') {
    return undefined;
  }
  const v = moment(value, format, true);
  return v.isValid() ? v : undefined;
}

export class DatePicker extends React.Component<DateProps, DatePickerState> {
  static defaultProps = {
    viewMode: 'days' as 'years' | 'months' | 'days' | 'time',
    shortcuts: '',
    closeOnSelect: true,
    overlayPlacement: 'auto'
  };
  state: DatePickerState = {
    isOpened: false,
    isFocused: false,
    value: normalizeValue(this.props.value, this.props.format)
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
    this.renderShortCuts = this.renderShortCuts.bind(this);
  }

  dom: HTMLDivElement;

  componentWillReceiveProps(nextProps: DateProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: normalizeValue(nextProps.value, nextProps.format)
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
      e.preventDefault();
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
      timeFormat,
      closeOnSelect,
      utc,
      viewMode
    } = this.props;

    if (!moment.isMoment(value)) {
      return;
    }

    if (minTime && value && value.isBefore(minTime, 'second')) {
      value = minTime;
    } else if (maxTime && value && value.isAfter(maxTime, 'second')) {
      value = maxTime;
    }

    onChange(utc ? moment.utc(value).format(format) : value.format(format));

    if (closeOnSelect && dateFormat && !timeFormat) {
      this.close();
    }
  }

  selectRannge(item: any) {
    const {closeOnSelect} = this.props;
    const now = moment();
    this.handleChange(item.date(now));

    closeOnSelect && this.close();
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

    const __ = this.props.translate;

    for (let i = 0, len = advancedShortcuts.length; i < len; i++) {
      let item = advancedShortcuts[i];
      const m = item.regexp.exec(key);

      if (m) {
        return item.resolve.apply(item, [__, ...m]);
      }
    }

    return null;
  }

  renderShortCuts(shortcuts: string | Array<ShortCuts>) {
    if (!shortcuts) {
      return null;
    }
    const {classPrefix: ns} = this.props;
    let shortcutArr: Array<string | ShortCuts>;
    if (typeof shortcuts === 'string') {
      shortcutArr = shortcuts.split(',');
    } else {
      shortcutArr = shortcuts;
    }

    const __ = this.props.translate;
    return (
      <ul className={`${ns}DatePicker-shortcuts`}>
        {shortcutArr.map(item => {
          if (!item) {
            return null;
          }
          let shortcut: PlainObject = {};
          if (typeof item === 'string') {
            shortcut = this.getAvailableShortcuts(item);
            shortcut.key = item;
          } else if ((item as ShortCutDate).date) {
            shortcut = {
              ...item,
              date: () => (item as ShortCutDate).date
            };
          }
          return (
            <li
              className={`${ns}DatePicker-shortcut`}
              onClick={() => this.selectRannge(shortcut)}
              key={shortcut.key || shortcut.label}
            >
              <a>{__(shortcut.label)}</a>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const {
      classPrefix: ns,
      className,
      value,
      placeholder,
      disabled,
      inputFormat,
      dateFormat,
      timeFormat,
      viewMode,
      timeConstraints,
      popOverContainer,
      clearable,
      shortcuts,
      utc,
      overlayPlacement,
      locale,
      format,
      embed
    } = this.props;

    const __ = this.props.translate;
    const isOpened = this.state.isOpened;
    let date: moment.Moment | undefined = this.state.value;

    if (embed) {
      return (
        <div
          className={cx(
            `${ns}DateCalendar`,
            {
              'is-disabled': disabled
            },
            className
          )}
        >
          <Calendar
            value={date}
            onChange={this.handleChange}
            requiredConfirm={false}
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            isValidDate={this.checkIsValidDate}
            viewMode={viewMode}
            timeConstraints={timeConstraints}
            input={false}
            onClose={this.close}
            locale={locale}
            // utc={utc}
          />
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
          <span className={`${ns}DatePicker-placeholder`}>
            {__(placeholder)}
          </span>
        )}

        {clearable && !disabled && normalizeValue(value, format) ? (
          <a className={`${ns}DatePicker-clear`} onClick={this.clearValue}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}

        <a className={`${ns}DatePicker-toggler`}>
          <Icon icon="calendar" className="icon" />
        </a>

        {isOpened ? (
          <Overlay
            target={this.getTarget}
            container={popOverContainer || this.getParent}
            rootClose={false}
            placement={overlayPlacement}
            show
          >
            <PopOver
              classPrefix={ns}
              className={`${ns}DatePicker-popover`}
              onHide={this.close}
              overlay
              onClick={this.handlePopOverClick}
            >
              {this.renderShortCuts(shortcuts)}

              <Calendar
                value={date}
                onChange={this.handleChange}
                requiredConfirm={!!(dateFormat && timeFormat)}
                dateFormat={dateFormat}
                inputFormat={inputFormat}
                timeFormat={timeFormat}
                isValidDate={this.checkIsValidDate}
                viewMode={viewMode}
                timeConstraints={timeConstraints}
                input={false}
                onClose={this.close}
                locale={locale}
                // utc={utc}
              />
            </PopOver>
          </Overlay>
        ) : null}
      </div>
    );
  }
}

export default themeable(localeable(DatePicker));

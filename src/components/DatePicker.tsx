/**
 * @file DatePicker
 * @description 时间选择器组件
 * @author fex
 */

import React from 'react';
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
import {ucFirst} from '../utils/helper';

const availableShortcuts: {[propName: string]: any} = {
  now: {
    label: 'Date.now',
    date: (now: moment.Moment) => {
      return now;
    }
  },
  today: {
    label: 'Date.today',
    date: (now: moment.Moment) => {
      return now.startOf('day');
    }
  },

  yesterday: {
    label: 'Date.yesterday',
    date: (now: moment.Moment) => {
      return now.add(-1, 'days').startOf('day');
    }
  },

  thisweek: {
    label: 'Date.monday',
    date: (now: moment.Moment) => {
      return now.startOf('week').startOf('day');
    }
  },

  thismonth: {
    label: 'Date.startOfMonth',
    date: (now: moment.Moment) => {
      return now.startOf('month');
    }
  },

  prevmonth: {
    label: 'Date.startOfLastMonth',
    date: (now: moment.Moment) => {
      return now.startOf('month').add(-1, 'month');
    }
  },

  prevquarter: {
    label: 'Date.startOfLastQuarter',
    date: (now: moment.Moment) => {
      return now.startOf('quarter').add(-1, 'quarter');
    }
  },

  thisquarter: {
    label: 'Date.startOfQuarter',
    date: (now: moment.Moment) => {
      return now.startOf('quarter');
    }
  },

  tomorrow: {
    label: 'Date.tomorrow',
    date: (now: moment.Moment) => {
      return now.add(1, 'days').startOf('day');
    }
  },

  endofthisweek: {
    label: 'Date.endOfWeek',
    date: (now: moment.Moment) => {
      return now.endOf('week');
    }
  },

  endofthismonth: {
    label: 'Date.endOfMonth',
    date: (now: moment.Moment) => {
      return now.endOf('month');
    }
  },

  endoflastmonth: {
    label: 'Date.endOfLastMonth',
    date: (now: moment.Moment) => {
      return now.add(-1, 'month').endOf('month');
    }
  }
};

const advancedShortcuts = [
  {
    regexp: /^(\d+)hoursago$/,
    resolve: (__: TranslateFn, _: string, hours: string) => {
      return {
        label: __('Date.hoursago', {hours}),
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
        label: __('Date.hourslater', {hours}),
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
        label: __('Date.daysago', {days}),
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
        label: __('Date.dayslater', {days}),
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
        label: __('Date.weeksago', {weeks}),
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
        label: __('Date.weekslater', {weeks}),
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
        label: __('Date.monthsago', {months}),
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
        label: __('Date.monthslater', {months}),
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
        label: __('Date.quartersago', {quarters}),
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
        label: __('Date.quarterslater', {quarters}),
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
  popoverClassName?: string;
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
  // minTime?: moment.Moment;
  // maxTime?: moment.Moment;
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

  borderMode?: 'full' | 'half' | 'none';
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

  componentDidUpdate(prevProps: DateProps) {
    const props = this.props;

    if (prevProps.value !== props.value) {
      this.setState({
        value: normalizeValue(props.value, props.format)
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
      minDate,
      maxDate,
      dateFormat,
      timeFormat,
      closeOnSelect,
      utc,
      viewMode
    } = this.props;

    if (!moment.isMoment(value)) {
      return;
    }

    if (minDate && value && value.isBefore(minDate, 'second')) {
      value = minDate;
    } else if (maxDate && value && value.isAfter(maxDate, 'second')) {
      value = maxDate;
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
    const {classPrefix: ns, classnames: cx} = this.props;
    let shortcutArr: Array<string | ShortCuts>;
    if (typeof shortcuts === 'string') {
      shortcutArr = shortcuts.split(',');
    } else {
      shortcutArr = shortcuts;
    }

    const __ = this.props.translate;
    return (
      <ul className={cx(`DatePicker-shortcuts`)}>
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
              className={cx(`DatePicker-shortcut`)}
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
      classnames: cx,
      className,
      popoverClassName,
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
      borderMode,
      embed,
      minDate
    } = this.props;

    const __ = this.props.translate;
    const isOpened = this.state.isOpened;
    let date: moment.Moment | undefined = this.state.value;

    if (embed) {
      return (
        <div
          className={cx(
            `DateCalendar`,
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
            minDate={minDate}
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
          `DatePicker`,
          {
            'is-disabled': disabled,
            'is-focused': this.state.isFocused,
            [`DatePicker--border${ucFirst(borderMode)}`]: borderMode
          },
          className
        )}
        ref={this.domRef}
        onClick={this.handleClick}
      >
        {date ? (
          <span className={cx(`DatePicker-value`)}>
            {date.format(inputFormat)}
          </span>
        ) : (
          <span className={cx(`DatePicker-placeholder`)}>
            {__(placeholder)}
          </span>
        )}

        {clearable && !disabled && normalizeValue(value, format) ? (
          <a className={cx(`DatePicker-clear`)} onClick={this.clearValue}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}

        <a className={cx(`DatePicker-toggler`)}>
          <Icon icon="clock" className="icon" />
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
              className={cx(`DatePicker-popover`, popoverClassName)}
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
                minDate={minDate}
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

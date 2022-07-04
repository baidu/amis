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
import PopUp from './PopUp';
import Overlay from './Overlay';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {PlainObject} from '../types';
import Calendar from './calendar/Calendar';
import {localeable, LocaleProps, TranslateFn} from '../locale';
import {isMobile, ucFirst} from '../utils/helper';
import CalendarMobile from './CalendarMobile';
import Input from './Input';

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
  label?: string;
  borderMode?: 'full' | 'half' | 'none';
  // 是否为内嵌模式，如果开启就不是 picker 了，直接页面点选。
  embed?: boolean;
  schedules?: Array<{
    startTime: Date;
    endTime: Date;
    content: any;
    className?: string;
  }>;
  scheduleClassNames?: Array<string>;
  largeMode?: boolean;
  onScheduleClick?: (scheduleData: any) => void;
  useMobileUI?: boolean;
  // 在移动端日期展示有多种形式，一种是picker 滑动选择，一种是日历展开选择，mobileCalendarMode为calendar表示日历展开选择
  mobileCalendarMode?: 'picker' | 'calendar';

  // 下面那个千万不要写，写了就会导致 keyof DateProps 得到的结果是 string | number;
  // [propName: string]: any;
  onFocus?: Function;
  onBlur?: Function;
  onRef?: any;
}

export interface DatePickerState {
  isOpened: boolean;
  isFocused: boolean;
  value: moment.Moment | undefined;
  inputValue: string | undefined; // 手动输入的值
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
    overlayPlacement: 'auto',
    scheduleClassNames: [
      'bg-warning',
      'bg-danger',
      'bg-success',
      'bg-info',
      'bg-secondary'
    ]
  };
  state: DatePickerState = {
    isOpened: false,
    isFocused: false,
    value: normalizeValue(this.props.value, this.props.format),
    inputValue:
      normalizeValue(this.props.value, this.props.format)?.format(
        this.props.inputFormat
      ) || ''
  };
  constructor(props: DateProps) {
    super(props);
    this.inputRef = React.createRef();
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
    this.inputChange = this.inputChange.bind(this);
  }

  dom: HTMLDivElement;

  inputRef: React.RefObject<HTMLInputElement>;

  componentDidMount() {
    this.props?.onRef?.(this);
  }

  componentDidUpdate(prevProps: DateProps) {
    const props = this.props;

    const prevValue = prevProps.value;

    if (prevValue !== props.value) {
      const newState: any = {
        value: normalizeValue(props.value, props.format)
      };

      newState.inputValue =
        newState.value?.format(this.props.inputFormat) || '';

      this.setState(newState);
    }
  }

  focus() {
    if (!this.dom) {
      return;
    }

    this.dom.focus();
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
    if (this.props.disabled) {
      return;
    }
    this.setState(
      {
        isOpened: true
      },
      fn
    );
    const input = this.inputRef.current;
    input && input.focus();
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
    this.setState({inputValue: ''});
  }

  // 清空
  clear() {
    const onChange = this.props.onChange;
    onChange('');
    this.setState({inputValue: ''});
  }

  // 重置
  reset(resetValue?: any) {
    if (!resetValue) {
      return;
    }
    const {format, inputFormat, onChange} = this.props;
    onChange(resetValue);
    this.setState({
      inputValue: normalizeValue(resetValue, format)?.format(inputFormat || '')
    });
  }

  handleChange(value: moment.Moment) {
    const {
      onChange,
      format,
      minDate,
      maxDate,
      dateFormat,
      inputFormat,
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

    this.setState({
      inputValue: utc
        ? moment.utc(value).format(inputFormat)
        : value.format(inputFormat)
    });
  }

  // 手动输入日期
  inputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange, inputFormat, format, utc} = this.props;
    const value = e.currentTarget.value;
    this.setState({inputValue: value});
    if (value === '') {
      onChange('');
    } else {
      // 将输入的格式转成正则匹配，比如 YYYY-MM-DD HH:mm:ss 改成 \d\d\d\d\-
      // 只有匹配成功才更新
      const inputCheckRegex = new RegExp(
        inputFormat!.replace(/[ymdhs]/gi, '\\d').replace(/-/gi, '\\-')
      );
      if (inputCheckRegex.test(value)) {
        const newDate = moment(value, inputFormat);
        const dateValue = utc
          ? moment.utc(newDate).format(format)
          : newDate.format(format);
        // 小于 0 的日期丢弃
        if (!dateValue.startsWith('-')) {
          onChange(dateValue);
        }
      }
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
      minDate,
      useMobileUI,
      maxDate,
      schedules,
      largeMode,
      scheduleClassNames,
      onScheduleClick,
      mobileCalendarMode
    } = this.props;

    const __ = this.props.translate;
    const isOpened = this.state.isOpened;
    let date: moment.Moment | undefined = this.state.value;

    const calendarMobile = (
      <CalendarMobile
        isDatePicker={true}
        timeFormat={timeFormat}
        inputFormat={inputFormat}
        startDate={date}
        defaultDate={date}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat={dateFormat}
        embed={embed}
        viewMode={viewMode}
        close={this.close}
        confirm={this.handleChange}
        footerExtra={this.renderShortCuts(shortcuts)}
        showViewMode={
          viewMode === 'quarters' || viewMode === 'months' ? 'years' : 'months'
        }
        timeConstraints={timeConstraints}
      />
    );
    const CalendarMobileTitle = (
      <div className={`${ns}CalendarMobile-title`}>
        {this.props.label ?? __('Calendar.datepicker')}
      </div>
    );
    const useCalendarMobile =
      useMobileUI &&
      isMobile() &&
      ['days', 'months', 'quarters'].indexOf(viewMode) > -1;

    if (embed) {
      let schedulesData: DateProps['schedules'] = undefined;
      if (schedules && Array.isArray(schedules)) {
        // 设置日程颜色
        let index = 0;
        schedulesData = schedules.map((schedule: any) => {
          let className = schedule.className;
          if (!className && scheduleClassNames) {
            className = scheduleClassNames[index];
            index++;
            if (index >= scheduleClassNames.length) {
              index = 0;
            }
          }
          return {
            ...schedule,
            className
          };
        });
      }
      return (
        <div
          className={cx(
            `DateCalendar`,
            {
              'is-disabled': disabled,
              'ScheduleCalendar': schedulesData,
              'ScheduleCalendar-large': largeMode
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
            maxDate={maxDate}
            // utc={utc}
            schedules={schedulesData}
            largeMode={largeMode}
            onScheduleClick={onScheduleClick}
            embed={embed}
            useMobileUI={useMobileUI}
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
            'is-focused': !disabled && this.state.isFocused,
            [`DatePicker--border${ucFirst(borderMode)}`]: borderMode,
            'is-mobile': useMobileUI && isMobile()
          },
          className
        )}
        ref={this.domRef}
        onClick={this.handleClick}
      >
        <Input
          className={cx('DatePicker-input')}
          onChange={this.inputChange}
          ref={this.inputRef}
          placeholder={__(placeholder)}
          autoComplete="off"
          value={this.state.inputValue}
          disabled={disabled}
        />

        {clearable && !disabled && normalizeValue(value, format) ? (
          <a className={cx(`DatePicker-clear`)} onClick={this.clearValue}>
            <Icon icon="input-clear" className="icon" />
          </a>
        ) : null}

        <a className={cx(`DatePicker-toggler`)}>
          <Icon
            icon={viewMode === 'time' ? 'clock' : 'date'}
            className="icon"
          />
        </a>

        {!(useMobileUI && isMobile()) && isOpened ? (
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
                requiredConfirm={viewMode === 'time'}
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
                maxDate={maxDate}
                useMobileUI={useMobileUI}
                // utc={utc}
              />
            </PopOver>
          </Overlay>
        ) : null}
        {useMobileUI && isMobile() ? (
          mobileCalendarMode === 'calendar' && useCalendarMobile ? (
            <PopUp
              isShow={isOpened}
              className={cx(`${ns}CalendarMobile-pop`)}
              onHide={this.close}
              header={CalendarMobileTitle}
            >
              {calendarMobile}
            </PopUp>
          ) : (
            <PopUp
              className={cx(`${ns}DatePicker-popup DatePicker-mobile`)}
              container={popOverContainer}
              isShow={isOpened}
              showClose={false}
              onHide={this.handleClick}
            >
              <Calendar
                value={date}
                onChange={this.handleChange}
                requiredConfirm={false}
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
                maxDate={maxDate}
                useMobileUI={useMobileUI}
                // utc={utc}
              />
            </PopUp>
          )
        ) : null}
      </div>
    );
  }
}

export default themeable(localeable(DatePicker));

// 最早基于 react-datetime 2.16.2 版本，后来大部分都自己写了

import moment from 'moment';
import React from 'react';
import Downshift from 'downshift';
import findIndex from 'lodash/findIndex';
import merge from 'lodash/merge';
import {
  LocaleProps,
  localeable,
  ClassNamesFn,
  utils,
  convertArrayValueToMoment,
  isMobile
} from 'amis-core';
import Picker from '../Picker';
import {PickerOption} from '../PickerColumn';
import {DateType} from './Calendar';
import type {TimeScale} from './TimeView';
import {Icon} from '../icons';

interface CustomDaysViewProps extends LocaleProps {
  classPrefix?: string;
  prevIcon?: string;
  nextIcon?: string;
  viewDate: moment.Moment;
  selectedDate: moment.Moment;
  minDate: moment.Moment;
  maxDate: moment.Moment;
  useMobileUI: boolean;
  embed: boolean;
  timeFormat: string;
  requiredConfirm?: boolean;
  isEndDate?: boolean;
  renderDay?: Function;
  onClose?: () => void;
  onChange: (value: moment.Moment) => void;
  onConfirm?: (value: number[], types: DateType[]) => void;
  setDateTimeState: (state: any) => void;
  showTime: () => void;
  setTime: (type: string, amount: number) => void;
  scrollToTop: (
    type: string,
    amount: number,
    i: number,
    lable?: string
  ) => void;
  subtractTime: (
    amount: number,
    type: string,
    toSelected?: moment.Moment
  ) => () => void;
  addTime: (
    amount: number,
    type: string,
    toSelected?: moment.Moment
  ) => () => void;
  isValidDate?: (
    currentDate: moment.Moment,
    selected?: moment.Moment
  ) => boolean;
  showView: (view: string) => () => void;
  updateSelectedDate: (event: React.MouseEvent<any>, close?: boolean) => void;
  handleClickOutside: () => void;
  classnames: ClassNamesFn;
  schedules?: Array<{
    startTime: Date;
    endTime: Date;
    content: any;
    className?: string;
  }>;
  largeMode?: boolean;
  onScheduleClick?: (scheduleData: any) => void;
  hideHeader?: boolean;
  getColumns: (types: DateType[], dateBoundary: void) => any;
  getDateBoundary: (currentDate: moment.Moment) => any;
  timeConstraints?: any;
}

export class CustomDaysView extends React.Component<CustomDaysViewProps> {
  timeConstraints = {
    hours: {
      min: 0,
      max: 23,
      step: 1
    },
    minutes: {
      min: 0,
      max: 59,
      step: 1
    },
    seconds: {
      min: 0,
      max: 59,
      step: 1
    },
    milliseconds: {
      min: 0,
      max: 999,
      step: 1
    }
  };

  state: {
    columns: {options: PickerOption[]}[];
    types: DateType[];
    pickerValue: number[];
    uniqueTag: any;
  };

  getDaysOfWeek(locale: any) {
    var days = locale._weekdaysMin,
      first = locale.firstDayOfWeek(),
      dow: any[] = [],
      i = 0;
    days.forEach(function (day: any) {
      dow[(7 + i++ - first) % 7] = day;
    });

    return dow;
  }

  alwaysValidDate() {
    return 1;
  }

  renderDays() {
    let date = this.props.viewDate,
      selected = this.props.selectedDate && this.props.selectedDate.clone(),
      prevMonth = date.clone().subtract(1, 'months'),
      currentYear = date.year(),
      currentMonth = date.month(),
      weeks = [],
      days = [],
      renderer = this.props.renderDay || this.renderDay,
      isValid = this.props.isValidDate || this.alwaysValidDate,
      classes,
      isDisabled,
      dayProps,
      currentDate;

    // Go to the last week of the previous month
    prevMonth.date(prevMonth.daysInMonth()).startOf('week');
    let lastDay = prevMonth.clone().add(42, 'd');

    while (prevMonth.isBefore(lastDay)) {
      classes = 'rdtDay';
      currentDate = prevMonth.clone();

      if (
        (prevMonth.year() === currentYear &&
          prevMonth.month() < currentMonth) ||
        prevMonth.year() < currentYear
      )
        classes += ' rdtOld';
      else if (
        (prevMonth.year() === currentYear &&
          prevMonth.month() > currentMonth) ||
        prevMonth.year() > currentYear
      )
        classes += ' rdtNew';

      if (selected && prevMonth.isSame(selected, 'day'))
        classes += ' rdtActive';

      if (prevMonth.isSame(moment(), 'day')) classes += ' rdtToday';

      isDisabled = !isValid(currentDate, selected);
      if (isDisabled) classes += ' rdtDisabled';

      dayProps = {
        'key': prevMonth.format('M_D'),
        'data-value': prevMonth.date(),
        'className': classes
      };

      if (!isDisabled) (dayProps as any).onClick = this.updateSelectedDate;

      days.push(renderer(dayProps, currentDate, selected));

      if (days.length === 7) {
        weeks.push(
          React.createElement('tr', {key: prevMonth.format('M_D')}, days)
        );
        days = [];
      }

      prevMonth.add(1, 'd');
    }

    return weeks;
  }

  constructor(props: any) {
    super(props);
    const {selectedDate, viewDate, timeFormat} = props;
    const currentDate = selectedDate || moment();

    const types: DateType[] = ['year', 'month', 'date'];
    timeFormat.split(':').forEach((format: string) => {
      const type: DateType | '' = /h/i.test(format)
        ? 'hours'
        : /m/.test(format)
        ? 'minutes'
        : /s/.test(format)
        ? 'seconds'
        : '';
      type && types.push(type);
    });

    const dateBoundary = this.props.getDateBoundary(currentDate);
    const columns = this.props.getColumns(types, dateBoundary);
    this.state = {
      columns,
      types,
      pickerValue: currentDate.toArray(),
      uniqueTag: 0
    };

    if (this.props.timeConstraints) {
      this.timeConstraints = merge(this.timeConstraints, props.timeConstraints);
    }
  }

  componentWillMount() {
    this.setState({uniqueTag: new Date().valueOf()});
  }

  componentDidMount() {
    const {timeFormat, selectedDate, viewDate, isEndDate} = this.props;
    const formatMap = {
      hours: 'HH',
      minutes: 'mm',
      seconds: 'ss'
    };
    const date = selectedDate || (isEndDate ? viewDate.endOf('day') : viewDate);
    timeFormat.split(':').forEach((format, i) => {
      const type = /h/i.test(format)
        ? 'hours'
        : /m/.test(format)
        ? 'minutes'
        : /s/.test(format)
        ? 'seconds'
        : '';
      if (type) {
        this.scrollToTop(
          type,
          parseInt(date.format(formatMap[type]), 10),
          i,
          'init'
        );
      }
    });
  }

  updateSelectedDate = (event: React.MouseEvent<any>) => {
    // need confirm
    if (this.props.requiredConfirm) {
      const viewDate = this.props.viewDate.clone();
      const currentDate = this.props.selectedDate || viewDate;

      const target = event.target as HTMLElement;
      let modifier = 0;

      if (~target.className.indexOf('rdtNew')) {
        modifier = 1;
      }
      if (~target.className.indexOf('rdtOld')) {
        modifier = -1;
      }

      viewDate
        .month(viewDate.month() + modifier)
        .date(parseInt(target.getAttribute('data-value') as string, 10))
        .hours(currentDate.hours())
        .minutes(currentDate.minutes())
        .seconds(currentDate.seconds())
        .milliseconds(currentDate.milliseconds());

      this.props.setDateTimeState({
        viewDate,
        selectedDate: viewDate.clone()
      });
      return;
    }

    this.props.updateSelectedDate(event, true);
  };

  showTime = () => {
    const {selectedDate, viewDate, timeFormat} = this.props;
    return (
      <div key="stb" className="rdtShowTime">
        {(selectedDate || viewDate || moment()).format(timeFormat)}
      </div>
    );
  };

  setTime = (
    type: 'hours' | 'minutes' | 'seconds' | 'milliseconds',
    value: number
  ) => {
    const date = (this.props.selectedDate || this.props.viewDate).clone();
    date[type](value);

    this.props.setDateTimeState({
      viewDate: date.clone(),
      selectedDate: date.clone()
    });

    if (!this.props.requiredConfirm) {
      this.props.onChange(date);
    }
  };

  scrollToTop = (
    type: 'hours' | 'minutes' | 'seconds' | 'milliseconds',
    value: number,
    i: number,
    label?: string
  ) => {
    const elf: any = document.getElementById(
      `${this.state.uniqueTag}-${i}-input`
    );
    const {min, step} = this.timeConstraints[type];
    const offset = (value - min) / step;
    const height = 28; /** 单个选项的高度 */

    elf?.parentNode?.scrollTo({
      top: offset * height,
      behavior: label === 'init' ? 'auto' : 'smooth'
    });
  };

  confirm = () => {
    let date = (this.props.selectedDate || this.props.viewDate).clone();

    // 如果 minDate 是可用的，且比当前日期晚，则用 minDate
    if (this.props.minDate?.isValid() && this.props.minDate?.isAfter(date)) {
      date = this.props.minDate.clone();
    }

    this.props.setDateTimeState({
      selectedDate: date
    });
    this.props.onChange(date);
    this.props.onClose && this.props.onClose();
  };

  cancel = () => {
    this.props.onClose && this.props.onClose();
  };

  renderDay = (props: any, currentDate: moment.Moment) => {
    if (this.props.schedules) {
      let schedule: any[] = [];
      this.props.schedules.forEach((item: any) => {
        if (
          currentDate.isSameOrAfter(
            moment(item.startTime).subtract(1, 'days')
          ) &&
          currentDate.isSameOrBefore(item.endTime)
        ) {
          schedule.push(item);
        }
      });
      if (schedule.length > 0) {
        const cx = this.props.classnames;
        const __ = this.props.translate;
        // 日程数据
        const scheduleData = {
          scheduleData: schedule.map((item: any) => {
            return {
              ...item,
              time:
                moment(item.startTime).format('YYYY-MM-DD HH:mm:ss') +
                ' - ' +
                moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')
            };
          }),
          currentDate
        };

        // 放大模式
        if (this.props.largeMode) {
          let showSchedule: any[] = [];
          for (let i = 0; i < schedule.length; i++) {
            if (showSchedule.length > 3) {
              break;
            }
            if (moment(schedule[i].startTime).isSame(currentDate, 'day')) {
              showSchedule.push(schedule[i]);
            } else if (currentDate.weekday() === 0) {
              const width = Math.min(
                moment(schedule[i].endTime).diff(currentDate, 'days') + 1,
                7
              );
              // 周一重新设置日程
              showSchedule.push({
                ...schedule[i],
                width,
                startTime: moment(currentDate),
                endTime: moment(currentDate).add(width - 1, 'days')
              });
              schedule[i].height === undefined && (schedule[i].height = 0);
            } else {
              // 生成空白格占位
              showSchedule.push({
                width: 1,
                className: 'bg-transparent',
                content: '',
                height: schedule[i].height
              });
            }
          }
          [0, 1, 2].forEach((i: number) => {
            // 排序
            let tempIndex = findIndex(
              showSchedule,
              (item: any) => item.height === i
            );
            if (tempIndex === -1) {
              tempIndex = findIndex(
                showSchedule,
                (item: any) => item.height === undefined
              );
            }
            if (tempIndex > -1 && tempIndex !== i) {
              let temp = showSchedule[i];
              showSchedule[i] = showSchedule[tempIndex];
              showSchedule[tempIndex] = temp;
            }
            if (showSchedule[i] && showSchedule[i].height === undefined) {
              showSchedule[i].height = i;
            }
          });
          // 最多展示3个
          showSchedule = showSchedule.slice(0, 3);
          const scheduleDiv = showSchedule.map((item: any, index: number) => {
            const width =
              item.width ||
              Math.min(
                moment(item.endTime).diff(moment(item.startTime), 'days') + 1,
                7 - moment(item.startTime).weekday()
              );
            return (
              <div
                key={props.key + 'content' + index}
                className={cx(
                  'ScheduleCalendar-large-schedule-content',
                  item.className
                )}
                style={{width: width + '00%'}}
                onClick={() =>
                  this.props.onScheduleClick &&
                  this.props.onScheduleClick(scheduleData)
                }
              >
                <div className={cx('ScheduleCalendar-text-overflow')}>
                  {item.content}
                </div>
              </div>
            );
          });
          return (
            <td {...props}>
              <div className={cx('ScheduleCalendar-large-day-wrap')}>
                <div className={cx('ScheduleCalendar-large-schedule-header')}>
                  <span>{currentDate.date()}</span>
                </div>
                {scheduleDiv}
                {schedule.length > 3 && (
                  <div className={cx('ScheduleCalendar-large-schedule-footer')}>
                    {schedule.length - 3} {__('more')}
                  </div>
                )}
              </div>
            </td>
          );
        }

        // 正常模式
        const ScheduleIcon = (
          <span
            className={cx('ScheduleCalendar-icon', schedule[0].className)}
            onClick={() =>
              this.props.onScheduleClick &&
              this.props.onScheduleClick(scheduleData)
            }
          ></span>
        );
        return (
          <td {...props}>
            <span>
              {currentDate.date()}
              {ScheduleIcon}
            </span>
          </td>
        );
      }
    }
    return (
      <td {...props}>
        <span>{currentDate.date()}</span>
      </td>
    );
  };

  /** 时间选择器数据源 */
  computedTimeOptions(timeScale: TimeScale) {
    const {min, max, step} = this.timeConstraints?.[timeScale];

    return Array.from({length: max - min + 1}, (item, index) => {
      const value = (index + min)
        .toString()
        .padStart(timeScale !== 'milliseconds' ? 2 : 3, '0');

      return index % step === 0 ? {label: value, value} : undefined;
    }).filter((item): item is {label: string; value: string} => !!item);
  }

  renderTimes = () => {
    const {
      timeFormat,
      selectedDate,
      viewDate,
      isEndDate,
      classnames: cx
    } = this.props;

    const date = selectedDate || (isEndDate ? viewDate.endOf('day') : viewDate);
    const inputs: Array<React.ReactNode> = [];
    const timeConstraints = this.timeConstraints;

    timeFormat.split(':').forEach((format, i) => {
      const type = /h/i.test(format)
        ? 'hours'
        : /m/.test(format)
        ? 'minutes'
        : /s/.test(format)
        ? 'seconds'
        : '';
      if (type) {
        const min = timeConstraints[type].min;
        const max = timeConstraints[type].max;
        const options = this.computedTimeOptions(type);
        const formatMap = {
          hours: 'HH',
          minutes: 'mm',
          seconds: 'ss'
        };

        inputs.push(
          <Downshift
            key={i + 'input'}
            inputValue={date.format(formatMap[type])}
          >
            {({getInputProps, openMenu, closeMenu}) => {
              const inputProps = getInputProps({
                onFocus: () => openMenu(),
                onChange: (e: any) =>
                  this.setTime(
                    type,
                    Math.max(
                      min,
                      Math.min(
                        parseInt(
                          e.currentTarget.value.replace(/\D/g, ''),
                          10
                        ) || 0,
                        max
                      )
                    )
                  )
              });
              return (
                <div
                  className={cx(
                    'CalendarInputWrapper',
                    'CalendarInputWrapperMT'
                  )}
                >
                  {/* <input
                    type="text"
                    value={date.format(formatMap[type])}
                    className={cx('CalendarInput')}
                    min={min}
                    max={max}
                    {...inputProps}
                  /> */}
                  <div
                    className={cx(
                      'CalendarInput-sugs',
                      type === 'hours'
                        ? 'CalendarInput-sugsHours'
                        : 'CalendarInput-sugsTimes'
                    )}
                    id={`${this.state.uniqueTag}-${i}-input`}
                  >
                    {options.map(option => {
                      return (
                        <div
                          key={option.value}
                          className={cx('CalendarInput-sugsItem', {
                            'is-highlight': selectedDate
                              ? option.value === date.format(formatMap[type])
                              : option.value === options?.[0]?.value
                          })}
                          onClick={() => {
                            this.setTime(type, parseInt(option.value, 10));
                            this.scrollToTop(
                              type,
                              parseInt(option.value, 10),
                              i
                            );
                            closeMenu();
                          }}
                        >
                          {option.value}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }}
          </Downshift>
        );
        inputs.push(<span key={i + 'divider'}></span>);
      }
    });
    inputs.length && inputs.pop();
    return (
      <div className={cx('CalendarTimesWrapper')}>
        {this.showTime()}
        <div className={cx('CalendarInputsWrapper')}>{inputs}</div>
      </div>
    );
  };

  renderFooter = () => {
    if (!this.props.requiredConfirm) {
      return null;
    }

    const {translate: __, classnames: cx} = this.props;

    return (
      <tfoot key="tf">
        <tr>
          <td colSpan={7}>
            {this.props.requiredConfirm ? (
              <div key="button" className="rdtActions">
                <a
                  className={cx('Button', 'Button--default')}
                  onClick={this.cancel}
                >
                  {__('cancel')}
                </a>
                <a
                  className={cx('Button', 'Button--primary', 'm-l-sm')}
                  onClick={this.confirm}
                >
                  {__('confirm')}
                </a>
              </div>
            ) : null}
          </td>
        </tr>
      </tfoot>
    );
  };

  onPickerConfirm = (value: number[]) => {
    this.props.onConfirm && this.props.onConfirm(value, this.state.types);
  };

  onPickerChange = (value: number[], index: number) => {
    const {selectedDate, viewDate} = this.props;

    // 变更年份、月份的时候，需要更新columns
    if (index === 1 || index === 0) {
      const currentDate = (selectedDate || viewDate || moment()).clone();

      // 只需计算year 、month
      const selectDate = convertArrayValueToMoment(
        value,
        ['year', 'month'],
        currentDate
      );
      const dateBoundary = this.props.getDateBoundary(selectDate);
      this.setState({
        columns: this.props.getColumns(this.state.types, dateBoundary),
        pickerValue: value
      });
    }
  };

  renderPicker = () => {
    const {translate: __} = this.props;
    const title =
      this.state.types.length > 3 ? __('Date.titleTime') : __('Date.titleDate');
    return (
      <Picker
        translate={this.props.translate}
        locale={this.props.locale}
        title={title}
        columns={this.state.columns}
        value={this.state.pickerValue}
        onChange={this.onPickerChange}
        onConfirm={this.onPickerConfirm}
        onClose={this.cancel}
      />
    );
  };

  render() {
    const {
      viewDate: date,
      useMobileUI,
      embed,
      timeFormat,
      classnames: cx
    } = this.props;
    const locale = date.localeData();
    const __ = this.props.translate;
    if (isMobile() && useMobileUI && !embed) {
      return <div className="rdtYears">{this.renderPicker()}</div>;
    }

    const tableChildren = [
      this.props.hideHeader ? null : (
        <thead key="th">
          <tr>
            <th colSpan={7}>
              <div className="rdtHeader">
                <a
                  className="rdtPrev"
                  onClick={this.props.subtractTime(1, 'years')}
                >
                  <Icon icon="right-double-arrow" className="icon date-icon-arrow-left" />
                </a>
                <a
                  className="rdtPrev"
                  onClick={this.props.subtractTime(1, 'months')}
                >
                  <Icon icon="right-arrow" className="icon date-icon-arrow-left" />
                </a>

                <div className="rdtCenter">
                  <a
                    className="rdtSwitch"
                    onClick={this.props.showView('years')}
                  >
                    {date.format(__('dateformat.year'))}
                  </a>
                  <a
                    className="rdtSwitch"
                    onClick={this.props.showView('months')}
                  >
                    {date.format(__('MMM'))}
                  </a>
                </div>

                <a
                  className="rdtNext"
                  onClick={this.props.addTime(1, 'months')}
                >
                  <Icon icon="right-arrow" className="icon date-icon-arrow" />
                </a>
                <a className="rdtNext" onClick={this.props.addTime(1, 'years')}>
                  <Icon icon="right-double-arrow" className="icon date-icon-arrow" />
                </a>
              </div>
              <div className='header-line'></div>
            </th>
          </tr>
          <tr>
            {this.getDaysOfWeek(locale).map((day: number, index: number) => (
              <th key={day + index} className="dow">
                {day}
              </th>
            ))}
          </tr>
        </thead>
      ),

      <tbody key="tb">{this.renderDays()}</tbody>
    ];

    return (
      <>
        <div className={timeFormat ? 'rdtDays' : ''}>
          <table className={timeFormat ? 'rdtDaysPart' : ''}>
            {tableChildren}
          </table>
          {timeFormat ? (
            <div
              className={
                timeFormat.toLowerCase().indexOf('s') > 0
                  ? 'rdtTimePartWithS'
                  : 'rdtTimePart'
              }
            >
              {this.renderTimes()}
            </div>
          ) : null}
        </div>
        <table>{this.renderFooter()}</table>
      </>
    );
  }
}

export default localeable(
  CustomDaysView as any as React.ComponentClass<CustomDaysViewProps>
);

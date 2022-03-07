/**
 * @file 基于 react-datetime 改造。
 */
import React from 'react';
import CustomCalendarContainer from './CalendarContainer';
import cx from 'classnames';
import moment from 'moment';
import {themeable, ThemeOutterProps, ThemeProps} from '../../theme';
import {convertArrayValueToMoment, getRange} from '../../utils/helper';
import {PickerOption} from '../PickerColumn';

export type DateType =
  | 'year'
  | 'month'
  | 'date'
  | 'hours'
  | 'minutes'
  | 'seconds';
export interface BoundaryObject {
  max: number;
  min: number;
}

export interface DateBoundary {
  year: BoundaryObject;
  month: BoundaryObject;
  date: BoundaryObject;
  hours: BoundaryObject;
  minutes: BoundaryObject;
  seconds: BoundaryObject;
}

const viewModes = Object.freeze({
  YEARS: 'years',
  MONTHS: 'months',
  DAYS: 'days',
  TIME: 'time'
});

interface BaseDatePickerProps {
  className?: string;
  value?: any;
  defaultValue?: any;
  viewMode?: 'years' | 'months' | 'days' | 'time' | 'quarters';
  dateFormat?: boolean | string;
  inputFormat?: boolean | string;
  timeFormat?: boolean | string;
  input?: boolean;
  locale: string;
  date?: any;
  isValidDate?: (
    currentDate: moment.Moment,
    selected?: moment.Moment
  ) => boolean;
  onViewModeChange?: (type: string) => void;
  requiredConfirm?: boolean;
  onClose?: () => void;
  onChange?: (value: any) => void;
  isEndDate?: boolean;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  viewDate?: moment.Moment;
  renderMonth?: (props: any, month: number, year: number, date: any) => void;
  renderDay?: (
    props: any,
    currentDate: moment.Moment,
    selectedDate: moment.Moment
  ) => JSX.Element;
  renderQuarter?: (
    props: any,
    quartar: number,
    year?: number,
    date?: moment.Moment
  ) => JSX.Element;
  schedules?: Array<{
    startTime: Date;
    endTime: Date;
    content: string | React.ReactElement;
    color?: string;
  }>;
  largeMode?: boolean;
  onScheduleClick?: (scheduleData: any) => void;
  hideHeader?: boolean;
  updateOn?: string;
  useMobileUI?: boolean;
  embed?: boolean;
  closeOnSelect?: boolean;
  showToolbar?: boolean;
  open?: boolean;
  utc?: boolean;
  displayTimeZone?: string;
  timeConstraints?: any;
}

interface BaseDatePickerState {
  inputFormat?: boolean | string;
  currentView: string;
  viewDate: moment.Moment;
  selectedDate: moment.Moment;
  inputValue?: string;
  open?: boolean;
}

type AllowedSetTime = 'hours' | 'minutes' | 'seconds' | 'milliseconds';

class BaseDatePicker extends React.Component<
  BaseDatePickerProps,
  BaseDatePickerState
> {
  tzWarning: boolean;

  static defaultProps: {
    className: '';
    defaultValue: '';
    inputProps: {};
    input: true;
    onFocus: () => {};
    onBlur: () => {};
    onChange: () => {};
    timeFormat: true;
    timeConstraints: {};
    dateFormat: true;
    strictParsing: true;
    closeOnSelect: false;
    closeOnTab: true;
    utc: false;
  };

  getFormats(props: BaseDatePickerProps) {
    let formats: any = {
        date: props.dateFormat || '',
        time: props.timeFormat || ''
      },
      locale = this.localMoment(props.date, undefined, props).localeData();
    if (formats.date === true) {
      formats.date = locale.longDateFormat('L');
    } else if (this.getUpdateOn(formats) !== viewModes.DAYS) {
      formats.time = '';
    }

    if (formats.time === true) {
      formats.time = locale.longDateFormat('LT');
    }

    formats.datetime =
      formats.date && formats.time
        ? formats.date + ' ' + formats.time
        : formats.date || formats.time;

    return formats;
  }

  componentDidUpdate(prevProps: BaseDatePickerProps) {
    const props = this.props;
    let formats = this.getFormats(props),
      updatedState: any = {};
    if (
      props.value !== prevProps.value ||
      formats.datetime !== this.getFormats(prevProps).datetime
    ) {
      updatedState = this.getStateFromProps(props);
    }

    // open 是外部控制了
    // if (updatedState.open === undefined) {
    //   if (typeof props.open !== 'undefined') {
    //     updatedState.open = props.open;
    //   } else if (
    //     prevProps.closeOnSelect &&
    //     this.state.currentView !== viewModes.TIME
    //   ) {
    //     updatedState.open = false;
    //   } else {
    //     updatedState.open = this.state.open;
    //   }
    // }

    if (props.viewMode !== prevProps.viewMode) {
      updatedState.currentView = props.viewMode;
    }

    if (props.locale !== prevProps.locale) {
      if (this.state.viewDate) {
        var updatedViewDate = this.state.viewDate.clone().locale(props.locale);
        updatedState.viewDate = updatedViewDate;
      }
      if (this.state.selectedDate) {
        var updatedSelectedDate = this.state.selectedDate
          .clone()
          .locale(props.locale);
        updatedState.selectedDate = updatedSelectedDate;
        updatedState.inputValue = updatedSelectedDate.format(formats.datetime);
      }
    }

    if (
      props.utc !== prevProps.utc ||
      props.displayTimeZone !== prevProps.displayTimeZone
    ) {
      if (props.utc) {
        if (this.state.viewDate)
          updatedState.viewDate = this.state.viewDate.clone().utc();
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().utc();
          updatedState.inputValue = updatedState.selectedDate.format(
            formats.datetime
          );
        }
      } else if (props.displayTimeZone) {
        if (this.state.viewDate)
          updatedState.viewDate = this.state.viewDate
            .clone()
            // @ts-ignore 其实目前不支持，需要自己 import "moment-timezone";
            .tz(props.displayTimeZone);
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate
            .clone()
            // @ts-ignore
            .tz(props.displayTimeZone);
          updatedState.inputValue = updatedState.selectedDate
            .tz(props.displayTimeZone)
            .format(formats.datetime);
        }
      } else {
        if (this.state.viewDate)
          updatedState.viewDate = this.state.viewDate.clone().local();
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().local();
          updatedState.inputValue = updatedState.selectedDate.format(
            formats.datetime
          );
        }
      }
    }

    if (props.viewDate !== prevProps.viewDate) {
      updatedState.viewDate = moment(props.viewDate);
    }

    if (Object.keys(updatedState).length) {
      this.setState(updatedState);
    }

    this.checkTZ(props);
  }

  checkTZ(props: BaseDatePickerProps) {
    var con = console;

    // @ts-ignore
    if (props.displayTimeZone && !this.tzWarning && !moment.tz) {
      this.tzWarning = true;
      con &&
        con.error(
          'react-datetime: displayTimeZone prop with value "' +
            props.displayTimeZone +
            '" is used but moment.js timezone is not loaded.'
        );
    }
  }

  localMoment(date?: any, format?: string, props?: any) {
    props = props || this.props;
    var m = null;

    if (props.utc) {
      m = moment.utc(date, format, props.strictParsing);
    } else if (props.displayTimeZone) {
      // @ts-ignore 以后再修
      m = moment.tz(date, format, props.displayTimeZone);
    } else {
      m = moment(date, format, props.strictParsing);
    }

    if (props.locale) m.locale(props.locale);
    return m;
  }

  parseDate(date: any, formats: any) {
    var parsedDate;

    if (date && typeof date === 'string')
      parsedDate = this.localMoment(date, formats.datetime);
    else if (date) parsedDate = this.localMoment(date);

    if (parsedDate && !parsedDate.isValid()) parsedDate = null;

    return parsedDate;
  }

  getStateFromProps(props: BaseDatePickerProps) {
    var formats = this.getFormats(props),
      date = props.value || props.defaultValue || '',
      selectedDate,
      viewDate,
      updateOn,
      inputValue;

    selectedDate = this.parseDate(date, formats);

    viewDate = this.parseDate(props.viewDate, formats);

    viewDate = selectedDate
      ? selectedDate.clone().startOf('month')
      : viewDate
      ? viewDate.clone().startOf('month')
      : this.localMoment().startOf('month');

    updateOn = this.getUpdateOn(formats);

    if (selectedDate) inputValue = selectedDate.format(formats.datetime);
    else if (date.isValid && !date.isValid()) inputValue = '';
    else inputValue = date || '';

    return {
      updateOn: updateOn,
      inputFormat: formats.datetime,
      viewDate: viewDate,
      selectedDate: selectedDate,
      inputValue: inputValue,
      open: props.open
    };
  }

  timeCellLength = {
    year: 4,
    month: 2,
    date: 2,
    hours: 2,
    minutes: 2,
    seconds: 2,
    milliseconds: 3
  };

  constructor(props: any) {
    super(props);
    const state: any = this.getStateFromProps(this.props);

    if (state.open === undefined) {
      state.open = !this.props.input;
    }

    state.currentView = this.props.dateFormat
      ? this.props.viewMode || state.updateOn || 'days'
      : this.props.viewMode || 'time';

    this.state = state;
  }

  getUpdateOn = (formats: any) => {
    if (formats.date.match(/[lLD]/)) {
      return 'days';
    } else if (formats.date.indexOf('M') !== -1) {
      return 'months';
    } else if (formats.date.indexOf('Q') !== -1) {
      return 'quarters';
    } else if (formats.date.indexOf('Y') !== -1) {
      return 'years';
    }

    return 'days';
  };

  componentProps = {
    fromProps: [
      'value',
      'isValidDate',
      'renderDay',
      'renderMonth',
      'renderYear',
      'timeConstraints'
    ],
    fromState: ['viewDate', 'selectedDate', 'updateOn'],
    fromThis: [
      'setDate',
      'setTime',
      'showView',
      'addTime',
      'subtractTime',
      'updateSelectedDate',
      'localMoment',
      'handleClickOutside'
    ]
  };

  getComponentProps() {
    let me: any = this,
      formats = this.getFormats(this.props),
      props: any = {dateFormat: formats.date, timeFormat: formats.time};
    this.componentProps.fromProps.forEach(function (name) {
      props[name] = me.props[name];
    });
    this.componentProps.fromState.forEach(function (name) {
      props[name] = me.state[name];
    });
    this.componentProps.fromThis.forEach(function (name) {
      props[name] = me[name];
    });

    props.setDateTimeState = this.setState.bind(this);

    [
      'inputFormat',
      'onChange',
      'onClose',
      'requiredConfirm',
      'classPrefix',
      'prevIcon',
      'nextIcon',
      'isEndDate',
      'classnames',
      'minDate',
      'maxDate',
      'schedules',
      'largeMode',
      'onScheduleClick',
      'hideHeader',
      'updateOn',
      'useMobileUI',
      'showToolbar',
      'embed'
    ].forEach(key => (props[key] = (this.props as any)[key]));

    return props;
  }

  showView = (view: string) => {
    return () => {
      this.setState({currentView: view});
    };
  };

  subtractTime = (amount: string, type: string, toSelected: boolean) => {
    return () => {
      this.updateTime('subtract', amount, type, toSelected);
    };
  };

  addTime = (amount: string, type: string, toSelected: boolean) => {
    return () => {
      this.updateTime('add', amount, type, toSelected);
    };
  };

  updateTime(op: string, amount: string, type: string, toSelected: boolean) {
    var update = {},
      date = toSelected ? 'selectedDate' : 'viewDate';

    // @ts-ignore
    update[date] = this.state[date].clone()[op](amount, type);

    this.setState(update);
  }

  allowedSetTime = ['hours', 'minutes', 'seconds', 'milliseconds'];

  setTime = (type: AllowedSetTime, value: any) => {
    var index = this.allowedSetTime.indexOf(type) + 1,
      state = this.state,
      date = (state.selectedDate || state.viewDate).clone(),
      nextType;

    // It is needed to set all the time properties
    // to not to reset the time
    date[type](value);
    for (; index < this.allowedSetTime.length; index++) {
      nextType = this.allowedSetTime[index] as AllowedSetTime;
      date[nextType](date[nextType]());
    }

    if (!this.props.value) {
      this.setState({
        selectedDate: date,
        inputValue: date.format(state.inputFormat as string)
      });
    }
    this.props.onChange && this.props.onChange(date);
  };

  setDate = (type: 'month' | 'year' | 'quarters') => {
    // todo 没看懂这个是啥意思，好像没啥用
    const currentShould =
      this.props.viewMode === 'months' &&
      !/^mm$/i.test((this.props.inputFormat as string) || '');
    const nextViews = {
      month: currentShould ? 'months' : 'days',
      year: currentShould ? 'months' : 'days',
      quarters: ''
    };

    if ((this.props.viewMode as any) === 'quarters') {
      nextViews.year = 'quarters';
    }

    return (e: any) => {
      this.setState({
        viewDate: (
          this.state.viewDate
            .clone()
            [type](
              parseInt(e.target.closest('td').getAttribute('data-value'), 10)
            ) as moment.Moment
        ).startOf(type),
        currentView: nextViews[type]
      });
    };
  };

  updateSelectedDate = (e: React.MouseEvent, close?: boolean) => {
    const that: any = this;
    let target = e.currentTarget,
      modifier = 0,
      viewDate = this.state.viewDate,
      currentDate = this.state.selectedDate || viewDate,
      date: any;

    if (target.className.indexOf('rdtDay') !== -1) {
      if (target.className.indexOf('rdtNew') !== -1) modifier = 1;
      else if (target.className.indexOf('rdtOld') !== -1) modifier = -1;

      date = viewDate
        .clone()
        .month(viewDate.month() + modifier)
        .date(parseInt(target.getAttribute('data-value')!, 10));
    } else if (target.className.indexOf('rdtMonth') !== -1) {
      date = viewDate
        .clone()
        .month(parseInt(target.getAttribute('data-value')!, 10))
        .date(currentDate.date());
    } else if (target.className.indexOf('rdtQuarter') !== -1) {
      date = viewDate
        .clone()
        .quarter(parseInt(target.getAttribute('data-value')!, 10))
        .startOf('quarter')
        .date(currentDate.date());
    } else if (target.className.indexOf('rdtYear') !== -1) {
      date = viewDate
        .clone()
        .month(currentDate.month())
        .date(currentDate.date())
        .year(parseInt(target.getAttribute('data-value')!, 10));
    }

    date
      ?.hours(currentDate.hours())
      .minutes(currentDate.minutes())
      .seconds(currentDate.seconds())
      .milliseconds(currentDate.milliseconds());

    if (!this.props.value) {
      var open = !(this.props.closeOnSelect && close);
      if (!open) {
        that.props.onBlur(date);
      }

      this.setState({
        selectedDate: date,
        viewDate: date?.clone().startOf('month'),
        inputValue: date?.format(this.state.inputFormat),
        open: open
      });
    } else {
      this.setState({
        selectedDate: date,
        viewDate: date?.clone().startOf('month'),
        inputValue: date?.format(this.state.inputFormat)
      });
      if (this.props.closeOnSelect && close) {
        that.closeCalendar();
      }
    }

    that.props.onChange(date);
  };

  getDateBoundary = (currentDate: moment.Moment) => {
    const {years, months} = currentDate.toObject();
    const maxDateObject = this.props.maxDate?.toObject();
    const minDateObject = this.props.minDate?.toObject();

    const yearBoundary = {
      max: maxDateObject ? maxDateObject.years : years + 100,
      min: minDateObject ? minDateObject.years : years - 100
    };
    const monthBoundary = {
      max: years === maxDateObject?.years ? maxDateObject.months : 11,
      min: years === minDateObject?.years ? minDateObject.months : 0
    };
    const dateBoundary = {
      max:
        years === maxDateObject?.years && months === maxDateObject?.months
          ? maxDateObject.date
          : currentDate.daysInMonth(),
      min:
        years === minDateObject?.years && months === minDateObject?.months
          ? minDateObject.date
          : 1
    };
    return {
      year: yearBoundary,
      month: monthBoundary,
      date: dateBoundary,
      hours: {max: 23, min: 0},
      minutes: {max: 59, min: 0},
      seconds: {max: 59, min: 0}
    };
  };

  timeCell = (value: number, type: DateType) => {
    let str = value + '';
    while (str.length < this.timeCellLength[type]) str = '0' + str;
    return str;
  };

  getColumns = (types: DateType[], dateBoundary: DateBoundary) => {
    const columns: {options: PickerOption[]}[] = [];
    types.map((type: DateType) => {
      const options = getRange(
        dateBoundary[type].min,
        dateBoundary[type].max,
        1
      ).map(item => {
        return {
          text:
            type === 'month'
              ? this.timeCell(item + 1, type)
              : this.timeCell(item, type),
          value: item
        };
      });
      columns.push({options});
    });
    return columns;
  };

  onConfirm = (value: number[], types: string[]) => {
    const currentDate = (
      this.state.selectedDate ||
      this.state.viewDate ||
      moment()
    ).clone();
    const date = convertArrayValueToMoment(value, types, currentDate);

    if (!this.props.value) {
      this.setState({
        selectedDate: date,
        inputValue: date!.format(this.state.inputFormat as string)
      });
    }
    this.props.onChange && this.props.onChange(date);
    this.props.onClose && this.props.onClose();
  };

  render() {
    const Component = CustomCalendarContainer as any;
    const viewProps = this.getComponentProps();

    if (this.props.viewMode === 'quarters') {
      [viewProps.updateOn, viewProps.renderQuarter] = [
        'quarters',
        this.props.renderQuarter
      ];
    } else if (this.props.viewMode === 'years') {
      viewProps.updateOn = 'years';
    } else if (this.props.viewMode === 'months') {
      viewProps.updateOn = 'months';
    }

    viewProps.onConfirm = this.onConfirm;
    viewProps.getDateBoundary = this.getDateBoundary;
    viewProps.getColumns = this.getColumns;
    viewProps.timeCell = this.timeCell;

    return (
      <div className={cx('rdt rdtStatic rdtOpen', this.props.className)}>
        <div key="dt" className="rdtPicker">
          <Component view={this.state.currentView} viewProps={viewProps} />
        </div>
      </div>
    );
  }
}

const Calendar: any = themeable(BaseDatePicker as any);
export default Calendar as React.ComponentType<BaseDatePickerProps>;

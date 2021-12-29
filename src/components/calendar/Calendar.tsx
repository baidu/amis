/**
 * @file 基于 react-datetime 改造。
 */
import ReactDatePicker from 'react-datetime';
import React from 'react';
import CustomCalendarContainer from './CalendarContainer';
import cx from 'classnames';
import moment from 'moment';
import {themeable, ThemeOutterProps, ThemeProps} from '../../theme';
import {convertArrayValueToMoment, getRange} from "../../utils/helper";
import {PickerOption} from '../PickerColumn';

export type DateType = 'year' | 'month' | 'date' | 'hours' | 'minutes' | 'seconds';
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

interface BaseDatePickerProps
  extends Omit<ReactDatePicker.DatetimepickerProps, 'viewMode'> {
  viewMode?: 'years' | 'months' | 'days' | 'time' | 'quarters';
  inputFormat?: string;
  onViewModeChange?: (type: string) => void;
  requiredConfirm?: boolean;
  onClose?: () => void;
  isEndDate?: boolean;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
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
  showToolbar?: boolean;
}

class BaseDatePicker extends ReactDatePicker {
  state: any;
  props: any;
  setState: (state: any) => void;
  getStateFromProps: any;

  constructor(props: any) {
    super(props);
    const state = this.getStateFromProps(this.props);

    if (state.open === undefined) {
      state.open = !this.props.input;
    }

    state.currentView = this.props.dateFormat
      ? this.props.viewMode || state.updateOn || 'days'
      : 'time';

    this.state = state;
  }

  static propTypes = {};

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

  getComponentProps = ((origin: Function) => {
    return () => {
      const props = origin.call(this);
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
        'embed',
        'onScheduleClick'
      ].forEach(key => (props[key] = (this.props as any)[key]));

      return props;
    };
  })((this as any).getComponentProps);

  setDate = (type: 'month' | 'year' | 'quarters') => {
    // todo 没看懂这个是啥意思，好像没啥用
    const currentShould =
      this.props.viewMode === 'months' &&
      !/^mm$/i.test(this.props.inputFormat || '');
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
        viewDate: this.state.viewDate
          .clone()
          [type](
            parseInt(e.target.closest('td').getAttribute('data-value'), 10)
          )
          .startOf(type),
        currentView: nextViews[type]
      });
      this.props.onViewModeChange?.(nextViews[type]);
    };
  };

  updateSelectedDate = (e: React.MouseEvent, close?: boolean) => {
    const that: any = this;
    let target = e.currentTarget,
      modifier = 0,
      viewDate = this.state.viewDate,
      currentDate = this.state.selectedDate || viewDate,
      date;

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
      .hours(currentDate.hours())
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
        viewDate: date.clone().startOf('month'),
        inputValue: date.format(this.state.inputFormat),
        open: open
      });
    } else {
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
      min: minDateObject ? minDateObject.years : years - 100,
    };
    const monthBoundary = {
      max: years === maxDateObject?.years ? maxDateObject.months : 11,
      min: years === minDateObject?.years ? minDateObject.months : 0
    };
    const dateBoundary  = {
      max: years === maxDateObject?.years && months === maxDateObject?.months ? maxDateObject.date : currentDate.daysInMonth(),
      min: years === minDateObject?.years && months === minDateObject?.months ? minDateObject.date : 1
    }
    return {
      year: yearBoundary,
      month: monthBoundary,
      date: dateBoundary,
      hours: {max: 23, min: 0},
      minutes: {max: 59, min: 0},
      seconds: {max: 59, min: 0}
    };
  };

  getColumns = (types: DateType[], dateBoundary: DateBoundary) => {
    const columns: { options: PickerOption[] }[] = [];
    types.map((type: DateType) => {
      const options = getRange(dateBoundary[type].min, dateBoundary[type].max, 1).map(item => {
        return {
          text: type === 'month' ? item + 1 : item,
          value: item
        };
      });
      columns.push({options})
    });
    return columns;
  };

  onConfirm = (value: number[], types: string[]) => {
    const currentDate = (this.state.selectedDate || this.state.viewDate || moment()).clone();
    const date = convertArrayValueToMoment(value, types, currentDate);

    if (!this.props.value) {
      this.setState({
        selectedDate: date,
        inputValue: date!.format(this.state.inputFormat)
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
    }
    else if (this.props.viewMode === 'years') {
      viewProps.updateOn = 'years';
    }
    else if (this.props.viewMode === 'months') {
      viewProps.updateOn = 'months';
    }

    viewProps.onConfirm = this.onConfirm;
    viewProps.getDateBoundary = this.getDateBoundary;
    viewProps.getColumns = this.getColumns;

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

/**
 * @file 基于 react-datetime 改造。
 */
import ReactDatePicker from 'react-datetime';
import React from 'react';
import CustomCalendarContainer from './CalendarContainer';
import cx from 'classnames';
import moment from 'moment';

interface BaseDatePickerProps extends ReactDatePicker.DatetimepickerProps {
  inputFormat?: string;
  onViewModeChange?: (type: string) => void;
  requiredConfirm?: boolean;
  onClose?: () => void;
  isEndDate?: boolean;
  renderDay?: (
    props: any,
    currentDate: moment.Moment,
    selectedDate: moment.Moment
  ) => JSX.Element;
}

class BaseDatePicker extends ReactDatePicker {
  state: any;
  props: BaseDatePickerProps;
  setState: (state: any) => void;
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
        'isEndDate'
      ].forEach(key => (props[key] = (this.props as any)[key]));

      return props;
    };
  })((this as any).getComponentProps);

  setDate = (type: 'month' | 'year') => {
    const currentShould =
      this.props.viewMode === 'months' &&
      this.props.inputFormat.toUpperCase() !== 'MM';
    const nextViews = {
      month: currentShould ? 'months' : 'days',
      year: currentShould ? 'months' : 'days'
    };

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
      this.props.onViewModeChange!(nextViews[type]);
    };
  };

  render() {
    const Component = CustomCalendarContainer as any;
    return (
      <div className={cx('rdt rdtStatic rdtOpen', this.props.className)}>
        <div key="dt" className="rdtPicker">
          <Component
            view={this.state.currentView}
            viewProps={this.getComponentProps()}
          />
        </div>
      </div>
    );
  }
}

const Calendar: any = BaseDatePicker;
export default Calendar as React.ComponentType<BaseDatePickerProps>;

import moment from 'moment';
// @ts-ignore
import DaysView from 'react-datetime/src/DaysView';
import React from 'react';
import Downshift from 'downshift';
import {LocaleProps, localeable} from '../../locale';
import {ClassNamesFn} from '../../theme';

interface CustomDaysViewProps extends LocaleProps {
  classPrefix?: string;
  prevIcon?: string;
  nextIcon?: string;
  viewDate: moment.Moment;
  selectedDate: moment.Moment;
  minDate: moment.Moment;
  timeFormat: string;
  requiredConfirm?: boolean;
  isEndDate?: boolean;
  renderDay?: Function;
  onClose?: () => void;
  onChange: (value: moment.Moment) => void;
  setDateTimeState: (state: any) => void;
  setTime: (type: string, amount: number) => void;
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
}

export class CustomDaysView extends DaysView {
  props: CustomDaysViewProps;
  getDaysOfWeek: (locale: any) => any;
  renderDays: () => JSX.Element;

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
    return <td {...props}>{currentDate.date()}</td>;
  };

  computedTimeOptions(total: number) {
    const times: {label: string; value: string}[] = [];

    for (let t = 0; t < total; t++) {
      const label = t < 10 ? `0${t}` : `${t}`;
      times.push({label, value: label});
    }

    return times;
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

    timeFormat.split(':').forEach((format, i) => {
      const type = /h/i.test(format)
        ? 'hours'
        : /m/.test(format)
        ? 'minutes'
        : /s/.test(format)
        ? 'seconds'
        : '';
      if (type) {
        const min = 0;
        const max = type === 'hours' ? 23 : 59;
        const hours = this.computedTimeOptions(24);
        const times = this.computedTimeOptions(60);
        const options = type === 'hours' ? hours : times;
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
            {({isOpen, getInputProps, openMenu, closeMenu}) => {
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
                <div className={cx('CalendarInputWrapper')}>
                  <input
                    type="text"
                    value={date.format(formatMap[type])}
                    className={cx('CalendarInput')}
                    min={min}
                    max={max}
                    {...inputProps}
                  />
                  {isOpen ? (
                    <div className={cx('CalendarInput-sugs')}>
                      {options.map(option => {
                        return (
                          <div
                            key={option.value}
                            className={cx('CalendarInput-sugsItem', {
                              'is-highlight':
                                option.value === date.format(formatMap[type])
                            })}
                            onClick={() => {
                              this.setTime(type, parseInt(option.value, 10));
                              closeMenu();
                            }}
                          >
                            {option.value}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }}
          </Downshift>
        );

        inputs.push(<span key={i + 'divider'}>:</span>);
      }
    });

    inputs.length && inputs.pop();

    return <div>{inputs}</div>;
  };

  renderFooter = () => {
    if (!this.props.timeFormat && !this.props.requiredConfirm) {
      return null;
    }

    const {translate: __, classnames: cx} = this.props;

    return (
      <tfoot key="tf">
        <tr>
          <td colSpan={7}>
            {this.props.timeFormat ? this.renderTimes() : null}
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

  render() {
    const footer = this.renderFooter();
    const date = this.props.viewDate;
    const locale = date.localeData();
    const __ = this.props.translate;

    const tableChildren = [
      <thead key="th">
        <tr>
          <th colSpan={7}>
            <div className="rdtHeader">
              <a
                className="rdtPrev"
                onClick={this.props.subtractTime(1, 'years')}
              >
                &laquo;
              </a>
              <a
                className="rdtPrev"
                onClick={this.props.subtractTime(1, 'months')}
              >
                &lsaquo;
              </a>

              <div className="rdtCenter">
                <a className="rdtSwitch" onClick={this.props.showView('years')}>
                  {date.format(__('dateformat.year'))}
                </a>
                <a
                  className="rdtSwitch"
                  onClick={this.props.showView('months')}
                >
                  {date.format(__('MMM'))}
                </a>
              </div>

              <a className="rdtNext" onClick={this.props.addTime(1, 'months')}>
                &rsaquo;
              </a>
              <a className="rdtNext" onClick={this.props.addTime(1, 'years')}>
                &raquo;
              </a>
            </div>
          </th>
        </tr>
        <tr>
          {this.getDaysOfWeek(locale).map((day: number, index: number) => (
            <th key={day + index} className="dow">
              {day}
            </th>
          ))}
        </tr>
      </thead>,

      <tbody key="tb">{this.renderDays()}</tbody>
    ];

    footer && tableChildren.push(footer);

    return (
      <div className="rdtDays">
        <table>{tableChildren}</table>
      </div>
    );
  }
}

export default localeable(
  CustomDaysView as any as React.ComponentClass<CustomDaysViewProps>
);

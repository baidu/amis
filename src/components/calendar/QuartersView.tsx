import React from 'react';
import {localeable, LocaleProps} from '../../locale';
import {ThemeProps} from '../../theme';

export interface QuarterViewProps extends LocaleProps, ThemeProps {
  viewDate: moment.Moment;
  selectedDate: moment.Moment;
  inputFormat?: string;
  updateOn: string;
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
  setDate: (type: string) => () => void;
  showView: (view: string) => () => void;
  updateSelectedDate: (e: any, close?: boolean) => void;
  renderQuarter: any;
  isValidDate: any;
}

export class QuarterView extends React.Component<QuarterViewProps> {
  alwaysValidDate: any;

  renderYear() {
    const __ = this.props.translate;
    const showYearHead = !/^mm$/i.test(this.props.inputFormat || '');

    if (!showYearHead) {
      return null;
    }

    const canClick = /yy/i.test(this.props.inputFormat || '');

    return (
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={this.props.subtractTime(1, 'years')}
            >
              «
            </th>
            {canClick ? (
              <th className="rdtSwitch" onClick={this.props.showView('years')}>
                {this.props.viewDate.format(__('YYYY年'))}
              </th>
            ) : (
              <th className="rdtSwitch">
                {this.props.viewDate.format(__('YYYY年'))}
              </th>
            )}

            <th className="rdtNext" onClick={this.props.addTime(1, 'years')}>
              »
            </th>
          </tr>
        </thead>
      </table>
    );
  }
  renderQuarters() {
    let date = this.props.selectedDate,
      month = this.props.viewDate.month(),
      year = this.props.viewDate.year(),
      rows = [],
      i = 1,
      months = [],
      renderer = this.props.renderQuarter || this.renderQuarter,
      isValid = this.props.isValidDate || this.alwaysValidDate,
      classes,
      props: any,
      currentMonth: moment.Moment,
      isDisabled,
      noOfDaysInMonth,
      daysInMonth,
      validDay,
      // Date is irrelevant because we're only interested in month
      irrelevantDate = 1;
    while (i < 5) {
      classes = 'rdtQuarter';
      currentMonth = this.props.viewDate
        .clone()
        .set({year: year, quarter: i, date: irrelevantDate});

      noOfDaysInMonth = currentMonth.endOf('quarter').format('Q');
      daysInMonth = Array.from(
        {length: parseInt(noOfDaysInMonth, 10)},
        function (e, i) {
          return i + 1;
        }
      );

      validDay = daysInMonth.find(function (d) {
        var day = currentMonth.clone().set('date', d);
        return isValid(day);
      });

      isDisabled = validDay === undefined;

      if (isDisabled) classes += ' rdtDisabled';

      if (date && i === date.quarter() && year === date.year())
        classes += ' rdtActive';

      props = {
        'key': i,
        'data-value': i,
        'className': classes
      };

      if (!isDisabled) {
        props.onClick =
          this.props.updateOn === 'quarters'
            ? this.updateSelectedQuarter
            : this.props.setDate('quarter');
      }

      months.push(renderer(props, i, year, date && date.clone()));

      if (months.length === 2) {
        rows.push(
          React.createElement('tr', {key: month + '_' + rows.length}, months)
        );
        months = [];
      }

      i++;
    }

    return rows;
  }

  renderQuarter = (
    props: any,
    quartar: number,
    year: number,
    date: moment.Moment
  ) => {
    return (
      <td {...props}>
        <span>Q{quartar}</span>
      </td>
    );
  };

  updateSelectedQuarter = (event: any) => {
    debugger;
    this.props.updateSelectedDate(event);
  };

  render() {
    const {classnames: cx} = this.props;

    return (
      <div className={cx('ClalendarQuarter')}>
        {this.renderYear()}
        <table>
          <tbody>{this.renderQuarters()}</tbody>
        </table>
      </div>
    );
  }
}

export default localeable(QuarterView);

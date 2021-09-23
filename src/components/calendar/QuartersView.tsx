import moment from 'moment';
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
  isValidDate: (date: moment.Moment) => boolean;
}

export class QuarterView extends React.Component<QuarterViewProps> {
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
              &laquo;
            </th>
            {canClick ? (
              <th className="rdtSwitch" onClick={this.props.showView('years')}>
                {this.props.viewDate.format(__('dateformat.year'))}
              </th>
            ) : (
              <th className="rdtSwitch">
                {this.props.viewDate.format(__('dateformat.year'))}
              </th>
            )}

            <th className="rdtNext" onClick={this.props.addTime(1, 'years')}>
              &raquo;
            </th>
          </tr>
        </thead>
      </table>
    );
  }
  renderQuarters() {
    let date = this.props.selectedDate,
      quarter = this.props.viewDate.quarter(),
      year = this.props.viewDate.year(),
      rows = [],
      i = 1,
      quarters = [],
      renderer = this.props.renderQuarter || this.renderQuarter,
      isValid = this.props.isValidDate || this.alwaysValidDate,
      classes,
      props: any,
      isDisabled;

    while (i < 5) {
      classes = 'rdtQuarter';
      isDisabled = !isValid(moment(`${year}-${i}`, 'YYYY-Q'));

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

      quarters.push(renderer(props, i, year, date && date.clone()));

      if (quarters.length === 2) {
        rows.push(
          React.createElement(
            'tr',
            {key: quarter + '_' + rows.length},
            quarters
          )
        );
        quarters = [];
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
    this.props.updateSelectedDate(event);
  };

  alwaysValidDate() {
    return true;
  }

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

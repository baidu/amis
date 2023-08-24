import moment from 'moment';
import React from 'react';
import {localeable, LocaleProps, ThemeProps} from 'amis-core';
import Picker from '../Picker';
import {PickerColumnItem} from '../PickerColumn';
import {getRange} from 'amis-core';
import {autobind} from 'amis-core';

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
  hideHeader?: boolean;
  onConfirm?: (value: number[], types?: string[]) => void;
  onClose?: () => void;
}

export class QuarterView extends React.Component<QuarterViewProps> {
  state = {
    columns: [],
    pickerValue: [this.props.viewDate.year(), this.props.viewDate.quarter()]
  };

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

  onPickerConfirm = (value: number[]) => {
    this.props.onConfirm && this.props.onConfirm(value, ['year', 'quarter']);
  };

  onPickerChange = (value: number[], index: number) => {
    this.setState({pickerValue: value});
  };

  @autobind
  cancel() {
    this.props.onClose?.();
  }

  renderPicker() {
    const {translate: __} = this.props;
    const title = __('Date.titleQuarter');
    const minYear = new Date().getFullYear() - 100;
    const maxYear = new Date().getFullYear() + 100;
    const columns: PickerColumnItem[] = [
      {
        options: getRange(minYear, maxYear, 1)
      },
      {
        options: getRange(1, 4).map(item => {
          return {
            text: 'Q' + item,
            value: item
          };
        })
      }
    ];

    return (
      <Picker
        translate={this.props.translate}
        locale={this.props.locale}
        title={title}
        columns={columns}
        value={this.state.pickerValue}
        onChange={this.onPickerChange}
        onConfirm={this.onPickerConfirm}
        onClose={this.cancel}
      />
    );
  }

  render() {
    const {classnames: cx, hideHeader, mobileUI} = this.props;

    return mobileUI ? (
      this.renderPicker()
    ) : (
      <div className={cx('ClalendarQuarter')}>
        {hideHeader ? null : this.renderYear()}
        <table>
          <tbody>{this.renderQuarters()}</tbody>
        </table>
      </div>
    );
  }
}

export default localeable(QuarterView);

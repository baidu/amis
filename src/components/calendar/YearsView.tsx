import moment from 'moment';
import React from 'react';
import {LocaleProps, localeable} from '../../locale';
import Picker from '../Picker';
import {getRange, isMobile} from '../../utils/helper';

interface CustomYearsViewProps extends LocaleProps {
  viewDate: moment.Moment;
  selectedDate: moment.Moment;
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
  showView: (view: string) => () => void;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  onChange?: () => void;
  onClose?: () => void;
  onConfirm?: (value: number[], types: string[]) => void;
  useMobileUI: boolean;
  updateOn?: string;
  setDate?: (date: string) => void;
  renderYear?: (props: any, year: number) => JSX.Element;
  updateSelectedDate: (event: React.MouseEvent<any>, close?: boolean) => void;
  isValidDate?: (
    currentDate: moment.Moment,
    selected?: moment.Moment
  ) => boolean;
}

export class CustomYearsView extends React.Component<CustomYearsViewProps> {
  state: {pickerValue: number[]};

  constructor(props: any) {
    super(props);

    const {selectedDate, viewDate} = props;
    const currentDate = selectedDate || viewDate || moment();

    this.state = {
      pickerValue: currentDate.toObject().years
    };

    this.updateSelectedYear = this.updateSelectedYear.bind(this);
  }

  renderYears(year: number) {
    let years = [],
      i = -1,
      rows = [],
      renderer = this.props.renderYear || this.renderYear,
      selectedDate = this.props.selectedDate,
      isValid = this.props.isValidDate || this.alwaysValidDate,
      classes,
      props,
      currentYear: moment.Moment,
      isDisabled,
      noOfDaysInYear,
      daysInYear,
      validDay,
      // Month and date are irrelevant here because
      // we're only interested in the year
      irrelevantMonth = 0,
      irrelevantDate = 1;
    year--;
    while (i < 11) {
      classes = 'rdtYear';
      currentYear = this.props.viewDate
        .clone()
        .set({year: year, month: irrelevantMonth, date: irrelevantDate});

      noOfDaysInYear = parseInt(currentYear.endOf('year').format('DDD'), 10);
      daysInYear = Array.from({length: noOfDaysInYear}, function (e, i) {
        return i + 1;
      });

      validDay = daysInYear.find(function (d) {
        var day = currentYear.clone().dayOfYear(d);
        return isValid(day);
      });

      isDisabled = validDay === undefined;

      if (isDisabled) classes += ' rdtDisabled';

      if (selectedDate && selectedDate.year() === year) classes += ' rdtActive';

      // 第一个和最后一个置灰
      if (i === -1 || i === 10) classes += ' text-muted';

      props = {
        'key': year,
        'data-value': year,
        'className': classes
      };

      if (!isDisabled)
        (props as any).onClick =
          this.props.updateOn === 'years'
            ? this.updateSelectedYear
            : this.props.setDate && this.props.setDate('year');

      years.push(renderer(props, year, selectedDate && selectedDate.clone()));

      if (years.length === 3) {
        rows.push(React.createElement('tr', {key: i}, years));
        years = [];
      }

      year++;
      i++;
    }

    return rows;
  }

  updateSelectedYear(event: any) {
    this.props.updateSelectedDate(event);
  }

  renderYear = (props: any, year: number, date?: moment.Moment) => {
    return (
      <td {...props}>
        <span>{year}</span>
      </td>
    );
  };

  onConfirm = (value: number[]) => {
    this.props.onConfirm && this.props.onConfirm(value, ['year']);
  };

  onPickerChange = (value: number[]) => {
    this.setState({pickerValue: value[0]});
  };

  renderYearPicker = () => {
    const {
      translate: __,
      minDate,
      maxDate,
      selectedDate,
      viewDate
    } = this.props;
    const year = (selectedDate || viewDate || moment()).year();
    const maxYear = maxDate ? maxDate.toObject().years : year + 100;
    const minYear = minDate ? minDate.toObject().years : year - 100;
    const title = __('Date.titleYear');

    const columns = [
      {
        options: getRange(minYear, maxYear, 1)
      }
    ];

    return (
      <Picker
        translate={this.props.translate}
        locale={this.props.locale}
        title={title}
        columns={columns}
        value={this.state.pickerValue}
        onConfirm={this.onConfirm}
        onChange={this.onPickerChange}
        onClose={this.props.onClose}
      />
    );
  };

  alwaysValidDate() {
    return true;
  }

  render() {
    let year = this.props.viewDate.year();
    year = year - (year % 10);
    const __ = this.props.translate;
    if (isMobile() && this.props.useMobileUI) {
      return <div className="rdtYears">{this.renderYearPicker()}</div>;
    }
    return (
      <div className="rdtYears">
        <table className="headerTable">
          <thead>
            <tr>
              <th
                className="rdtPrev"
                onClick={this.props.subtractTime(10, 'years')}
              >
                &laquo;
              </th>
              <th className="rdtSwitch">
                {__('year-to-year', {from: year, to: year + 9})}
              </th>
              <th className="rdtNext" onClick={this.props.addTime(10, 'years')}>
                &raquo;
              </th>
            </tr>
          </thead>
        </table>
        <table>
          <tbody>{this.renderYears(year)}</tbody>
        </table>
      </div>
    );
  }
}

export default localeable(CustomYearsView as any);

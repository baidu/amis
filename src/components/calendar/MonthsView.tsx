import moment from 'moment';
import React from 'react';
import {LocaleProps, localeable, TranslateFn} from '../../locale';
import Picker from '../Picker';
import {PickerOption} from '../PickerColumn';
import {getRange, isMobile} from '../../utils/helper';
import {DateType} from './Calendar';

export interface OtherProps {
  inputFormat?: string;
  hideHeader?: boolean;
}

export interface CustomMonthsViewProps extends LocaleProps {
  inputFormat?: string;
  hideHeader?: boolean;
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
  onClick?: () => void;
  updateOn?: string;
  setDate?: (date: string) => void;
  updateSelectedMonth?: () => void;
  updateSelectedDate: (event: React.MouseEvent<any>, close?: boolean) => void;
  renderMonth?: (props: any, month: number, year: number, date: any) => void;
  onConfirm?: (value: number[], types?: string[]) => void;
  getColumns: (types: DateType[], dateBoundary: void) => any;
  isValidDate?(value: any): boolean;
  timeCell: (value: number, type: DateType) => string;
  getDateBoundary: (currentDate: moment.Moment) => any;
  useMobileUI: boolean;
}

export class CustomMonthsView extends React.Component<CustomMonthsViewProps> {
  maxDateObject: {year: number; month: number; day?: number};
  minDateObject: {year: number; month: number; day?: number};
  state: {columns: {options: PickerOption[]}[]; pickerValue: number[]};

  constructor(props: any) {
    super(props);

    const {selectedDate, viewDate} = props;
    const currentDate = selectedDate || viewDate || moment();

    const dateBoundary = this.props.getDateBoundary(currentDate);
    const columns = this.props.getColumns(['year', 'month'], dateBoundary);
    this.state = {
      columns,
      pickerValue: currentDate.toArray()
    };

    this.updateSelectedMonth = this.updateSelectedMonth.bind(this);
  }

  renderMonths() {
    let date = this.props.selectedDate,
      month = this.props.viewDate.month(),
      year = this.props.viewDate.year(),
      rows = [],
      i = 0,
      months = [],
      renderer = this.props.renderMonth || this.renderMonth,
      isValid = this.props.isValidDate || this.alwaysValidDate,
      classes,
      props,
      currentMonth: moment.Moment,
      isDisabled,
      noOfDaysInMonth,
      daysInMonth,
      validDay,
      // Date is irrelevant because we're only interested in month
      irrelevantDate = 1;
    while (i < 12) {
      classes = 'rdtMonth';
      currentMonth = this.props.viewDate
        .clone()
        .set({year: year, month: i, date: irrelevantDate});

      noOfDaysInMonth = parseInt(currentMonth.endOf('month').format('D'), 10);
      daysInMonth = Array.from({length: noOfDaysInMonth}, function (e, i) {
        return i + 1;
      });

      validDay = daysInMonth.find(function (d) {
        var day = currentMonth.clone().set('date', d);
        return isValid(day);
      });

      isDisabled = validDay === undefined;

      if (isDisabled) classes += ' rdtDisabled';

      if (date && i === date.month() && year === date.year())
        classes += ' rdtActive';

      props = {
        'key': i,
        'data-value': i,
        'className': classes
      };

      if (!isDisabled)
        (props as any).onClick =
          this.props.updateOn === 'months'
            ? this.updateSelectedMonth
            : this.props.setDate && this.props.setDate('month');

      months.push(renderer(props, i, year, date && date.clone()));

      if (months.length === 3) {
        rows.push(React.createElement('tr', {key: i}, months));
        months = [];
      }

      i++;
    }

    return rows;
  }

  updateSelectedMonth(event: any) {
    this.props.updateSelectedDate(event);
  }

  renderMonth = (
    props: any,
    month: number,
    year: number,
    date: moment.Moment
  ) => {
    var localMoment = this.props.viewDate;
    var monthStr = localMoment
      .localeData()
      .monthsShort(localMoment.month(month));
    var strLength = 3;
    // Because some months are up to 5 characters long, we want to
    // use a fixed string length for consistency
    var monthStrFixedLength = monthStr.substring(0, strLength);
    return (
      <td {...props}>
        <span>{monthStrFixedLength}</span>
      </td>
    );
  };

  onConfirm = (value: number[], types?: string[]) => {
    this.props.onConfirm && this.props.onConfirm(value, ['year', 'month']);
  };

  onPickerChange = (value: number[], index: number) => {
    const {maxDate, minDate} = this.props;
    const year = moment().year();
    const columns = [...this.state.columns];
    const maxDateObject = maxDate
      ? maxDate.toObject()
      : {
          years: year + 100,
          months: 11
        };
    const minDateObject = minDate
      ? minDate.toObject()
      : {
          years: year - 100,
          months: 0
        };
    let range = [];
    // 选择年份是最大值的年或者最小值的月时，需要重新计算月分选择的cloumn
    if (index === 0) {
      if (
        value[0] === minDateObject.years &&
        value[0] === maxDateObject.years
      ) {
        range = getRange(minDateObject.months, maxDateObject.months, 1);
      } else if (value[0] === minDateObject.years) {
        range = getRange(minDateObject.months, 11, 1);
      } else if (value[0] === maxDateObject.years) {
        range = getRange(0, maxDateObject.months, 1);
      } else {
        range = getRange(0, 11, 1);
      }
      columns[1] = {
        options: range.map(i => {
          return {
            text: this.props.timeCell(i + 1, 'month'),
            value: i
          };
        })
      };
      this.setState({columns, pickerValue: value});
    }
  };

  alwaysValidDate() {
    return true;
  }

  renderPicker = () => {
    const {translate: __} = this.props;
    const title = __('Date.titleMonth');

    return (
      <Picker
        translate={this.props.translate}
        locale={this.props.locale}
        title={title}
        columns={this.state.columns}
        value={this.state.pickerValue}
        onChange={this.onPickerChange}
        onConfirm={this.onConfirm}
        onClose={this.props.onClose}
      />
    );
  };

  render() {
    const __ = this.props.translate;
    const showYearHead =
      !/^mm$/i.test(this.props.inputFormat || '') && !this.props.hideHeader;
    const canClick = /yy/i.test(this.props.inputFormat || '');

    if (isMobile() && this.props.useMobileUI) {
      return <div className="rdtYears">{this.renderPicker()}</div>;
    }
    return (
      <div className="rdtMonths">
        {showYearHead && (
          <table className="headerTable">
            <thead>
              <tr>
                <th
                  className="rdtPrev"
                  onClick={this.props.subtractTime(1, 'years')}
                >
                  &laquo;
                </th>
                {canClick ? (
                  <th
                    className="rdtSwitch"
                    onClick={this.props.showView('years')}
                  >
                    {this.props.viewDate.format(__('dateformat.year'))}
                  </th>
                ) : (
                  <th className="rdtSwitch">
                    {this.props.viewDate.format(__('dateformat.year'))}
                  </th>
                )}

                <th
                  className="rdtNext"
                  onClick={this.props.addTime(1, 'years')}
                >
                  &raquo;
                </th>
              </tr>
            </thead>
          </table>
        )}

        <table>
          <tbody>{this.renderMonths()}</tbody>
        </table>
      </div>
    );
  }
}

export default localeable(CustomMonthsView as any);

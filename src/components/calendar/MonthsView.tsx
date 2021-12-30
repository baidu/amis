// @ts-ignore
import MonthsView from 'react-datetime/src/MonthsView';
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

export class CustomMonthsView extends MonthsView {
  props: {
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
    getColumns: (types: DateType[], dateBoundary: void) => any;
    timeCell: (value: number, type: DateType) => string;
    getDateBoundary: (currentDate: moment.Moment) => any;
    useMobileUI: boolean;
  } & LocaleProps &
    OtherProps;
  maxDateObject: {year: number; month: number; day?: number};
  minDateObject: {year: number; month: number; day?: number};
  state: { columns: { options: PickerOption[] }[]; pickerValue: number[]};
  setState: (arg0: any) => () => any;
  renderMonths: () => JSX.Element;


  constructor(props: any) {
    super(props);

    const {selectedDate, viewDate} =  props;
    const currentDate = (selectedDate || viewDate || moment());

    const dateBoundary = this.props.getDateBoundary(currentDate);
    const columns = this.props.getColumns(['year', 'month'], dateBoundary);
    this.state = {
      columns,
      pickerValue: currentDate.toArray()
    }
  }

  renderMonth = (props: any, month: number) => {
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

  onConfirm = (value: number[]) => {
    this.props.onConfirm && this.props.onConfirm(value, ['year', 'month']);
  };

  onPickerChange = (value: number[], index: number) => {
    const {maxDate, minDate} =  this.props;
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
      }
      else if (value[0] === minDateObject.years) {
        range = getRange(minDateObject.months, 11, 1);
      }
      else if (value[0] === maxDateObject.years) {
        range = getRange(0, maxDateObject.months, 1);
      }
      else {
        range = getRange(0, 11, 1);
      }
      columns[1] = {
        options: range.map(i => {
          return {
            text: this.props.timeCell(i+1, 'month'),
            value: i
          };
        })
      };
      this.setState({columns, pickerValue: value});
    }
  };

  renderPicker = () => {
    const {translate: __} =  this.props;
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
    const showYearHead = !/^mm$/i.test(this.props.inputFormat || '') && !this.props.hideHeader;
    const canClick = /yy/i.test(this.props.inputFormat || '');

    if (isMobile() && this.props.useMobileUI) {
      return <div className="rdtYears">{this.renderPicker()}</div>;
    }
    return (
      <div className="rdtMonths">
        {showYearHead && (
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

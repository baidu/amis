// @ts-ignore
import MonthsView from 'react-datetime/src/MonthsView';
import moment from 'moment';
import React from 'react';
import {LocaleProps, localeable, TranslateFn} from '../../locale';
import Picker from '../Picker';
import {convertDateToObject, getRange, isMobile} from "../../utils/helper";

export interface OtherProps {
  inputFormat?: string;
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
    useMobileUI: boolean;
  } & LocaleProps &
    OtherProps;
  maxDateObject: {year: number; month: number; day?: number;}
  minDateObject: {year: number; month: number; day?: number;}
  state: { columns: { options: number[]; }[]; };
  setState: (arg0: any) => () => any;
  renderMonths: () => JSX.Element;
  
  constructor(props: any) {
    super(props);

    const {minDate, maxDate, selectedDate, viewDate} =  props;
    const currentDate = (selectedDate || viewDate || moment());
    const year = currentDate.year();
    this.maxDateObject = maxDate ? convertDateToObject(maxDate) : {
      year: year + 100,
      month: 12
    };
    this.minDateObject = minDate ? convertDateToObject(minDate) : {
      year: year - 100,
      month: 1
    };

    const columns = ['year', 'month'].map((type: 'year' | 'month') => {
      if (type === 'month') {
        const minMonth = year === this.minDateObject.year ? this.minDateObject.month : 1;
        const maxMonth = year === this.maxDateObject.year ? this.maxDateObject.month : 12;
        return {
          options: getRange(minMonth, maxMonth, 1)
        }
      }
      return {
        options: getRange(this.minDateObject[type], this.maxDateObject[type], 1)
      };
    });

    this.state = {
      columns
    };
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
    // 将月份的值减1 ，月份是0-11
    value[1] && --value[1];
    this.props.onConfirm && this.props.onConfirm(value, ["year", "month"]);
  }

  onPickerChange = (value: number[], index: number) => {
    const columns = [...this.state.columns];
    // 选择年份是最大值的年或者最小值的月时，需要重新计算月分选择的cloumn
    if (index === 0) {
      if (value[0] === this.minDateObject.year && value[0] === this.maxDateObject.year)  {
        columns[1] = {
          options: getRange(this.minDateObject.month, this.maxDateObject.month, 1)
        };
      }
      else if(value[0] === this.minDateObject.year) {
        columns[1] = {
          options: getRange(this.minDateObject.month, 12, 1)
        };
      }
      else if (value[0] === this.maxDateObject.year) {
        columns[1] = {
          options: getRange(1, this.maxDateObject.month, 1)
        };
      }
      else {
        columns[1] = {
          options: getRange(1, 12, 1)
        };
      }
      this.setState({columns});
    }
  }

  renderPicker = () => {
    const {selectedDate, viewDate} =  this.props;
    const currentDate = (selectedDate || viewDate || moment());
    const year = currentDate.year();
    const month = parseInt(currentDate.format('MM'), 10);

    return (
      <Picker
        translate={this.props.translate}
        locale={this.props.locale}
        columns={this.state.columns}
        value={[year, month]}
        onChange={this.onPickerChange}
        onConfirm={this.onConfirm}
        onClose={this.props.onClose}
        />
    );
  };

  render() {
    const __ = this.props.translate;
    const showYearHead = !/^mm$/i.test(this.props.inputFormat || '');
    const canClick = /yy/i.test(this.props.inputFormat || '');
    if (isMobile() && this.props.useMobileUI) {
      return (
        <div className="rdtYears">
          {this.renderPicker()}
        </div>
      );
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

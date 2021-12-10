// @ts-ignore
import YearsView from 'react-datetime/src/YearsView';
import moment from 'moment';
import React from 'react';
import {LocaleProps, localeable} from '../../locale';
import Picker from '../Picker';
import {convertDateToObject, getRange, isMobile} from "../../utils/helper";

export class CustomYearsView extends YearsView {
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
  } & LocaleProps;
  renderYears: (year: number) => JSX.Element;
  renderYear = (props: any, year: number) => {
    return (
      <td {...props}>
        <span>{year}</span>
      </td>
    );
  };

  onConfirm = (value: number[]) => {
    this.props.onConfirm && this.props.onConfirm(value, ["year"])
  }

  renderYearPicker = () => {
    const {minDate, maxDate, selectedDate, viewDate} =  this.props;
    const year = (selectedDate || viewDate || moment()).year();
    const maxYear = maxDate ? convertDateToObject(maxDate)!.year : year + 100;
    const minYear = minDate ? convertDateToObject(minDate)!.year : year - 100;
    
    const columns = [{
      options: getRange(minYear, maxYear, 1)
    }];

    return (
      <Picker
        translate={this.props.translate}
        locale={this.props.locale}
        columns={columns}
        value={[year]} 
        onConfirm={this.onConfirm}
        onClose={this.props.onClose}
        />
    );
  };

  render() {
    let year = this.props.viewDate.year();
    year = year - (year % 10);
    const __ = this.props.translate;
    
    if (isMobile() && this.props.useMobileUI) {
      return (
        <div className="rdtYears">
          {this.renderYearPicker()}
        </div>
      );
    }
    return (
      <div className="rdtYears">
        <table>
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

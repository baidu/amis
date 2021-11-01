// @ts-ignore
import YearsView from 'react-datetime/src/YearsView';
import moment from 'moment';
import React from 'react';
import {LocaleProps, localeable} from '../../locale';

export class CustomYearsView extends YearsView {
  props: {
    viewDate: moment.Moment;
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
  } & LocaleProps;
  renderYears: (year: number) => JSX.Element;
  renderYear = (props: any, year: number) => {
    return (
      <td {...props}>
        <span>{year}</span>
      </td>
    );
  };
  render() {
    let year = this.props.viewDate.year();
    year = year - (year % 10);
    const __ = this.props.translate;

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

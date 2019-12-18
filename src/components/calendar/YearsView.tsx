// @ts-ignore
import YearsView from 'react-datetime/src/YearsView';
import moment from 'moment';
import React from 'react';

export default class CustomYearsView extends YearsView {
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
  };
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

    return (
      <div className="rdtYears">
        <table>
          <thead>
            <tr>
              <th
                className="rdtPrev"
                onClick={this.props.subtractTime(10, 'years')}
              >
                «
              </th>
              <th className="rdtSwitch">
                {year}年-{year + 9}年
              </th>
              <th className="rdtNext" onClick={this.props.addTime(10, 'years')}>
                »
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

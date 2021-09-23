// @ts-ignore
import MonthsView from 'react-datetime/src/MonthsView';
import moment from 'moment';
import React from 'react';
import {LocaleProps, localeable, TranslateFn} from '../../locale';

export interface OtherProps {
  inputFormat?: string;
}

export class CustomMonthsView extends MonthsView {
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
  } & LocaleProps &
    OtherProps;
  renderMonths: () => JSX.Element;
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
  render() {
    const __ = this.props.translate;
    const showYearHead = !/^mm$/i.test(this.props.inputFormat || '');
    const canClick = /yy/i.test(this.props.inputFormat || '');

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

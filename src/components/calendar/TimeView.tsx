// @ts-ignore
import TimeView from 'react-datetime/src/TimeView';
import moment from 'moment';
import React from 'react';
import {LocaleProps, localeable} from '../../locale';

export class CustomTimeView extends TimeView {
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
  onStartClicking: any;
  disableContextMenu: any;
  state: {daypart: any};

  renderDayPart() {
    const {translate: __} = this.props;
    return (
      <div key="dayPart" className="rdtCounter">
        <span
          key="up"
          className="rdtBtn"
          onClick={this.onStartClicking('toggleDayPart', 'hours')}
          onContextMenu={this.disableContextMenu}
        >
          ▲
        </span>
        <div className="rdtCount" key={this.state.daypart}>
          {__(this.state.daypart)}
        </div>
        <span
          key="down"
          className="rdtBtn"
          onClick={this.onStartClicking('toggleDayPart', 'hours')}
          onContextMenu={this.disableContextMenu}
        >
          ▼
        </span>
      </div>
    );
  }
}

export default localeable(CustomTimeView as any);

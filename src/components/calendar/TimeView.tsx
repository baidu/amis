// @ts-ignore
import TimeView from 'react-datetime/src/TimeView';
import moment from 'moment';
import React from 'react';
import {LocaleProps, localeable} from '../../locale';
import {Icon} from '../icons';
import {ClassNamesFn} from '../../theme';

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
    timeFormat: string;
    classnames: ClassNamesFn;
    setTime: (type: string, value: any) => void;
  } & LocaleProps;
  onStartClicking: any;
  disableContextMenu: any;
  updateMilli: any;
  renderHeader: any;
  pad: any;
  state: {daypart: any; counters: Array<string>; [propName: string]: any};
  timeConstraints: any;
  padValues = {
    hours: 2,
    minutes: 2,
    seconds: 2,
    milliseconds: 3
  };

  renderDayPart = () => {
    const {translate: __, classnames: cx} = this.props;
    return (
      <div
        key="dayPart"
        className={cx('CalendarCounter CalendarCounter--daypart')}
      >
        <span
          key="up"
          className={cx('CalendarCounter-btn CalendarCounter-btn--up')}
          onClick={this.onStartClicking('toggleDayPart', 'hours')}
          onContextMenu={this.disableContextMenu}
        >
          <Icon icon="right-arrow-bold" />
        </span>
        <div className={cx('CalendarCounter-value')} key={this.state.daypart}>
          {__(this.state.daypart)}
        </div>
        <span
          key="down"
          className={cx('CalendarCounter-btn CalendarCounter-btn--down')}
          onClick={this.onStartClicking('toggleDayPart', 'hours')}
          onContextMenu={this.disableContextMenu}
        >
          <Icon icon="right-arrow-bold" />
        </span>
      </div>
    );
  };

  renderCounter = (type: string) => {
    const cx = this.props.classnames;
    if (type !== 'daypart') {
      var value = this.state[type];
      if (
        type === 'hours' &&
        this.props.timeFormat.toLowerCase().indexOf(' a') !== -1
      ) {
        value = ((value - 1) % 12) + 1;

        if (value === 0) {
          value = 12;
        }
      }

      const {min, max, step} = this.timeConstraints[type];

      return (
        <div key={type} className={cx('CalendarCounter')}>
          <span
            key="up"
            className={cx('CalendarCounter-btn CalendarCounter-btn--up')}
            onMouseDown={this.onStartClicking('increase', type)}
            onContextMenu={this.disableContextMenu}
          >
            <Icon icon="right-arrow-bold" />
          </span>

          <div key="c" className={cx('CalendarCounter-value')}>
            <input
              type="text"
              value={this.pad(type, value)}
              className={cx('CalendarInput')}
              min={min}
              max={max}
              step={step}
              onChange={e =>
                this.props.setTime(
                  type,
                  Math.max(
                    min,
                    Math.min(
                      parseInt(e.currentTarget.value.replace(/\D/g, ''), 10) ||
                        0,
                      max
                    )
                  )
                )
              }
            />
          </div>

          <span
            key="do"
            className={cx('CalendarCounter-btn CalendarCounter-btn--down')}
            onMouseDown={this.onStartClicking('decrease', type)}
            onContextMenu={this.disableContextMenu}
          >
            <Icon icon="right-arrow-bold" />
          </span>
        </div>
      );
    }
    return null;
  };

  render() {
    const counters: Array<JSX.Element | null> = [];
    const cx = this.props.classnames;

    this.state.counters.forEach(c => {
      if (counters.length) {
        counters.push(
          <div
            key={`sep${counters.length}`}
            className={cx('CalendarCounter-sep')}
          >
            :
          </div>
        );
      }
      counters.push(this.renderCounter(c));
    });

    if (this.state.daypart !== false) {
      counters.push(this.renderDayPart());
    }

    if (
      this.state.counters.length === 3 &&
      this.props.timeFormat.indexOf('S') !== -1
    ) {
      counters.push(
        <div className={cx('CalendarCounter-sep')} key="sep5">
          :
        </div>
      );
      counters.push(
        <div className={cx('CalendarCounter CalendarCounter--milli')}>
          <input
            value={this.state.milliseconds}
            type="text"
            onChange={this.updateMilli}
          />
        </div>
      );
    }

    return <div className={cx('CalendarTime')}>{counters}</div>;
  }
}

export default localeable(CustomTimeView as any);

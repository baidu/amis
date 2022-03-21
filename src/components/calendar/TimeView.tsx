import moment from 'moment';
import React from 'react';
import merge from 'lodash/merge';
import {LocaleProps, localeable} from '../../locale';
import {Icon} from '../icons';
import {ClassNamesFn} from '../../theme';
import Picker from '../Picker';
import {PickerColumnItem} from '../PickerColumn';
import {getRange, isMobile} from '../../utils/helper';

interface CustomTimeViewProps extends LocaleProps {
  viewDate: moment.Moment;
  selectedDate: moment.Moment;
  dateFormat?: boolean | string;
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
  onClose?: () => void;
  onConfirm?: (value: number[], types: string[]) => void;
  useMobileUI: boolean;
  showToolbar?: boolean;
  onChange?: (value: any) => void;
  timeConstraints?: any;
}

interface CustomTimeViewState {
  daypart: any;
  hours: any;
  counters: Array<string>;
  [propName: string]: any;
}

type TimeScale = 'hours' | 'minutes' | 'seconds' | 'milliseconds';

export class CustomTimeView extends React.Component<
  CustomTimeViewProps & LocaleProps,
  CustomTimeViewState
> {
  padValues = {
    hours: 2,
    minutes: 2,
    seconds: 2,
    milliseconds: 3
  };

  timeConstraints = {
    hours: {
      min: 0,
      max: 23,
      step: 1
    },
    minutes: {
      min: 0,
      max: 59,
      step: 1
    },
    seconds: {
      min: 0,
      max: 59,
      step: 1
    },
    milliseconds: {
      min: 0,
      max: 999,
      step: 1
    }
  };

  static defaultProps = {
    showToolbar: true
  };

  timer?: any;
  increaseTimer?: any;

  constructor(props: any) {
    super(props);
    this.state = this.calculateState(this.props);

    if (this.props.timeConstraints) {
      this.timeConstraints = merge(
        this.timeConstraints,
        this.props.timeConstraints
      );
    }
  }

  componentDidUpdate(preProps: CustomTimeViewProps) {
    if (
      preProps.viewDate !== this.props.viewDate ||
      preProps.selectedDate !== this.props.selectedDate ||
      preProps.timeFormat !== this.props.timeFormat
    ) {
      this.setState(this.calculateState(this.props));
    }
  }

  onStartClicking(action: any, type: string) {
    let me: any = this;

    return function () {
      let update: any = {};
      update[type] = me[action](type);
      me.setState(update);

      me.timer = setTimeout(function () {
        me.increaseTimer = setInterval(function () {
          update[type] = me[action](type);
          me.setState(update);
        }, 70);
      }, 500);

      me.mouseUpListener = function () {
        clearTimeout(me.timer);
        clearInterval(me.increaseTimer);
        me.props.setTime(type, me.state[type]);
        document.body.removeEventListener('mouseup', me.mouseUpListener);
        document.body.removeEventListener('touchend', me.mouseUpListener);
      };

      document.body.addEventListener('mouseup', me.mouseUpListener);
      document.body.addEventListener('touchend', me.mouseUpListener);
    };
  }

  updateMilli(e: any) {
    var milli = parseInt(e.target.value, 10);
    if (milli === e.target.value && milli >= 0 && milli < 1000) {
      this.props.setTime('milliseconds', milli);
      this.setState({milliseconds: milli});
    }
  }

  renderHeader() {
    if (!this.props.dateFormat) return null;

    var date = this.props.selectedDate || this.props.viewDate;
    return React.createElement(
      'thead',
      {key: 'h'},
      React.createElement(
        'tr',
        {},
        React.createElement(
          'th',
          {
            className: 'rdtSwitch',
            colSpan: 4,
            onClick: this.props.showView('days')
          },
          date.format(this.props.dateFormat as string)
        )
      )
    );
  }

  toggleDayPart(type: 'hours') {
    // type is always 'hours'
    var value = parseInt(this.state[type], 10) + 12;
    if (value > this.timeConstraints[type].max)
      value =
        this.timeConstraints[type].min +
        (value - (this.timeConstraints[type].max + 1));
    return this.pad(type, value);
  }

  increase(type: TimeScale) {
    var value =
      parseInt(this.state[type], 10) + this.timeConstraints[type].step;
    if (value > this.timeConstraints[type].max)
      value =
        this.timeConstraints[type].min +
        (value - (this.timeConstraints[type].max + 1));
    if (value < this.timeConstraints[type].min) {
      value = this.timeConstraints[type].min;
    }
    return this.pad(type, value);
  }

  decrease(type: TimeScale) {
    var value =
      parseInt(this.state[type], 10) - this.timeConstraints[type].step;
    if (value < this.timeConstraints[type].min)
      value =
        this.timeConstraints[type].max +
        1 -
        (this.timeConstraints[type].min - value);
    return this.pad(type, value);
  }

  pad(type: TimeScale, value: number) {
    var str = value + '';
    while (str.length < this.padValues[type]) str = '0' + str;
    return str;
  }

  disableContextMenu(event: React.MouseEvent<any>) {
    event.preventDefault();
    return false;
  }

  calculateState(props: CustomTimeViewProps) {
    var date = props.selectedDate || props.viewDate,
      format = props.timeFormat,
      counters = [];
    if (format.toLowerCase().indexOf('h') !== -1) {
      counters.push('hours');
      if (format.indexOf('m') !== -1) {
        counters.push('minutes');
        if (format.indexOf('s') !== -1) {
          counters.push('seconds');
        }
      }
    }

    var hours = parseInt(date.format('H'), 10);

    let daypart: any = false;
    if (
      this.state !== null &&
      this.props.timeFormat.toLowerCase().indexOf(' a') !== -1
    ) {
      if (this.props.timeFormat.indexOf(' A') !== -1) {
        daypart = hours >= 12 ? 'PM' : 'AM';
      } else {
        daypart = hours >= 12 ? 'pm' : 'am';
      }
    }

    return {
      hours: hours,
      minutes: date.format('mm'),
      seconds: date.format('ss'),
      milliseconds: date.format('SSS'),
      daypart: daypart,
      counters: counters
    };
  }

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

  getCounterValue = (type: string) => {
    if (type !== 'daypart') {
      let value = this.state[type];
      if (
        type === 'hours' &&
        this.props.timeFormat.toLowerCase().indexOf(' a') !== -1
      ) {
        value = ((value - 1) % 12) + 1;

        if (value === 0) {
          value = 12;
        }
      }
      return parseInt(value);
    }
    return 0;
  };

  renderCounter = (type: TimeScale | 'daypart') => {
    const cx = this.props.classnames;
    if (type !== 'daypart') {
      const value = this.getCounterValue(type);

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

  onConfirm = (value: (number | string)[]) => {
    // 修正am、pm
    const hourIndex = this.state.counters.indexOf('hours');
    if (
      hourIndex !== -1 &&
      this.state.daypart !== false &&
      this.props.timeFormat.toLowerCase().indexOf(' a') !== -1
    ) {
      const amMode: string = value.splice(-1, 1)[0] as string;
      let hour = (value[hourIndex] as number) % 12;
      // 修正pm
      amMode.toLowerCase().indexOf('p') !== -1 && (hour = hour + 12);
      value[hourIndex] = hour;
    }

    this.props.onConfirm &&
      this.props.onConfirm(value as number[], this.state.counters);
  };

  getDayPartOptions = () => {
    const {translate: __} = this.props;
    let options = ['am', 'pm'];
    if (this.props.timeFormat.indexOf(' A') !== -1) {
      options = ['AM', 'PM'];
    }

    return options.map(daypart => ({
      text: __(daypart),
      value: daypart
    }));
  };

  onPickerChange = (value: (number | string)[], index: number) => {
    const time: {[prop: string]: any} = {};
    this.state.counters.forEach((type, i) => (time[type] = value[i]));
    if (
      this.state.daypart !== false &&
      index > this.state.counters.length - 1
    ) {
      time.daypart = value[value.length - 1];
    }
    this.setState((prevState: CustomTimeViewState) => {
      return {...prevState, ...time};
    });
    this.props.onChange && this.props.onChange(value);
  };

  renderTimeViewPicker = () => {
    const {translate: __} = this.props;
    const title = __('Date.titleTime');
    const columns: PickerColumnItem[] = [];
    const values = [];

    this.state.counters.forEach((type: TimeScale | 'daypart') => {
      if (type !== 'daypart') {
        let {min, max, step} = this.timeConstraints[type];
        // 修正am pm时hours可选最大值
        if (
          type === 'hours' &&
          this.state.daypart !== false &&
          this.props.timeFormat.toLowerCase().indexOf(' a') !== -1
        ) {
          max = max > 12 ? 12 : max;
        }
        columns.push({
          options: getRange(min, max, step).map(item => {
            return {
              text: this.pad(type, item),
              value: item
            };
          })
        });
        values.push(parseInt(this.state[type], 10));
      }
    });
    if (this.state.daypart !== false) {
      columns.push({
        options: this.getDayPartOptions()
      });
      values.push(this.state.daypart);
    }

    return (
      <Picker
        translate={this.props.translate}
        locale={this.props.locale}
        title={title}
        columns={columns}
        value={values}
        onConfirm={this.onConfirm}
        onClose={this.props.onClose}
        showToolbar={this.props.showToolbar}
        onChange={this.onPickerChange}
      />
    );
  };

  render() {
    let counters: Array<JSX.Element | null> = [];
    const cx = this.props.classnames;

    if (isMobile() && this.props.useMobileUI) {
      return (
        <div className={cx('CalendarTime')}>{this.renderTimeViewPicker()}</div>
      );
    }
    this.state.counters.forEach((c: any) => {
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

import React from 'react';
import { FormItem, FormControlProps } from './Item';
import cx from 'classnames';
import { filterDate } from '../../utils/tpl-builtin';
import moment from 'moment';
import 'moment/locale/zh-cn';
import DatePicker from '../../components/DatePicker';

export interface DateProps extends FormControlProps {
  placeholder?: string;
  inputFormat?: string;
  timeFormat?: string;
  format?: string;
  timeConstraints?: object;
  closeOnSelect?: boolean;
  disabled: boolean;
  iconClassName?: string;
  utc?: boolean; // 设定是否存储 utc 时间。
  minDate?: string;
  maxDate?: string;
}

interface DateControlState {
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
}

export default class DateControl extends React.PureComponent<
  DateProps,
  DateControlState
  > {
  static defaultProps = {
    format: 'X',
    viewMode: 'days',
    inputFormat: 'YYYY-MM-DD',
    timeConstraints: {
      minutes: {
        step: 1
      }
    },
    clearable: true
  };

  componentWillMount() {
    const {
      minDate,
      maxDate,
      value,
      defaultValue,
      setPrinstineValue,
      data,
      format,
      utc
    } = this.props;

    if (defaultValue && value === defaultValue) {
      const date = filterDate(defaultValue, data, format);
      setPrinstineValue((utc ? moment.utc(date) : date).format(format));
    }

    this.setState({
      minDate: minDate ? filterDate(minDate, data, format) : undefined,
      maxDate: maxDate ? filterDate(maxDate, data, format) : undefined
    });
  }

  componentWillReceiveProps(nextProps: DateProps) {
    const props = this.props;

    if (props.defaultValue !== nextProps.defaultValue) {
      const date = filterDate(
        nextProps.defaultValue,
        nextProps.data,
        nextProps.format
      );
      nextProps.setPrinstineValue(
        (nextProps.utc ? moment.utc(date) : date).format(nextProps.format)
      );
    }

    if (
      props.minDate !== nextProps.minDate ||
      props.maxDate !== nextProps.maxDate ||
      props.data !== nextProps.data
    ) {
      this.setState({
        minDate: nextProps.minDate
          ? filterDate(nextProps.minDate, nextProps.data, this.props.format)
          : undefined,
        maxDate: nextProps.maxDate
          ? filterDate(nextProps.maxDate, nextProps.data, this.props.format)
          : undefined
      });
    }
  }

  render() {
    const {
      className,
      defaultValue,
      defaultData,
      classnames: cx,
      minDate,
      maxDate,
      ...rest
    } = this.props;

    return (
      <div className={cx(`DateControl`, className)}>
        <DatePicker {...rest} {...this.state} classnames={cx} />
      </div>
    );
  }
}

@FormItem({
  type: 'date',
  weight: -150
})
export class DateControlRenderer extends DateControl {
  static defaultProps = {
    ...DateControl.defaultProps,
    placeholder: '请选择日期',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '',
    strictMode: false
  };
}

@FormItem({
  type: 'datetime'
})
export class DatetimeControlRenderer extends DateControl {
  static defaultProps = {
    ...DateControl.defaultProps,
    placeholder: '请选择日期以及时间',
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    dateFormat: 'LL',
    timeFormat: 'HH:mm:ss',
    closeOnSelect: false,
    strictMode: false
  };
}

@FormItem({
  type: 'time'
})
export class TimeControlRenderer extends DateControl {
  static defaultProps = {
    ...DateControl.defaultProps,
    placeholder: '请选择时间',
    inputFormat: 'HH:mm',
    dateFormat: '',
    timeFormat: 'HH:mm',
    viewMode: 'time',
    closeOnSelect: false
  };
}

@FormItem({
  type: 'months'
})
export class MonthControlRenderer extends DateControl {
  static defaultProps = {
    ...DateControl.defaultProps,
    placeholder: '请选择月份',
    inputFormat: 'MM',
    dateFormat: 'MM',
    timeFormat: 'MM',
    viewMode: 'months',
    closeOnSelect: false
  };
}

import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import {filterDate} from '../../utils/tpl-builtin';
import moment from 'moment';
import 'moment/locale/zh-cn';
import DateRangePicker, {
  DateRangePicker as BaseDateRangePicker
} from '../../components/DateRangePicker';

export interface DateRangeProps extends FormControlProps {
  placeholder?: string;
  disabled: boolean;
  format: string;
  joinValues: boolean;
  delimiter: string;
  minDate?: any;
  maxDate?: any;
}

interface DateControlState {
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
}

export default class DateRangeControl extends React.Component<
  DateRangeProps,
  DateControlState
> {
  static defaultProps = {
    format: 'X',
    joinValues: true,
    delimiter: ','
  };

  constructor(props: DateRangeProps) {
    super(props);

    const {minDate, maxDate, data, format} = props;

    this.state = {
      minDate: minDate ? filterDate(minDate, data, format) : undefined,
      maxDate: maxDate ? filterDate(maxDate, data, format) : undefined
    };
  }

  componentWillMount() {
    const {
      defaultValue,
      setPrinstineValue,
      delimiter,
      format,
      data,
      value,
      joinValues,
      utc
    } = this.props;

    if (defaultValue && value === defaultValue) {
      let arr =
        typeof defaultValue === 'string'
          ? defaultValue.split(delimiter)
          : defaultValue;
      setPrinstineValue(
        BaseDateRangePicker.formatValue(
          {
            startDate: filterDate(arr[0], data, format),
            endDate: filterDate(arr[1], data, format)
          },
          format,
          joinValues,
          delimiter,
          utc
        )
      );
    }
  }

  componentWillReceiveProps(nextProps: DateRangeProps) {
    const {data, minDate, maxDate, format} = nextProps;
    const props = this.props;

    if (
      props.minDate !== minDate ||
      props.maxDate !== maxDate ||
      props.data !== data
    ) {
      this.setState({
        minDate: minDate ? filterDate(minDate, data, format) : undefined,
        maxDate: maxDate ? filterDate(maxDate, data, format) : undefined
      });
    }
  }

  componentDidUpdate(prevProps: DateRangeProps) {
    const {
      defaultValue,
      delimiter,
      joinValues,
      setPrinstineValue,
      data,
      utc,
      format
    } = this.props;

    if (prevProps.defaultValue !== defaultValue) {
      let arr =
        typeof defaultValue === 'string'
          ? defaultValue.split(delimiter)
          : defaultValue;

      setPrinstineValue(
        arr
          ? BaseDateRangePicker.formatValue(
              {
                startDate: filterDate(arr[0], data, format),
                endDate: filterDate(arr[1], data, format)
              },
              format,
              joinValues,
              delimiter,
              utc
            )
          : undefined
      );
    }
  }

  render() {
    const {
      className,
      classPrefix: ns,
      defaultValue,
      defaultData,
      ...rest
    } = this.props;

    return (
      <div className={cx(`${ns}DateRangeControl`, className)}>
        <DateRangePicker {...rest} {...this.state} classPrefix={ns} />
      </div>
    );
  }
}

@FormItem({
  type: 'date-range'
})
export class DateRangeControlRenderer extends DateRangeControl {
  static defaultProps = {
    ...DateRangeControl.defaultProps,
    timeFormat: ''
  };
}

@FormItem({
  type: 'datetime-range',
  sizeMutable: false
})
export class DateTimeRangeControlRenderer extends DateRangeControl {
  static defaultProps = {
    ...DateRangeControl.defaultProps,
    timeFormat: 'HH:mm',
    inputFormat: 'YYYY-MM-DD HH:mm'
  };
}

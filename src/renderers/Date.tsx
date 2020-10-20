import React from 'react';
import {Renderer, RendererProps} from '../factory';
import moment from 'moment';

export interface DateProps extends RendererProps {
  className?: string;
  placeholder?: string;
  format?: string;
  valueFormat?: string;
  fromNow?: boolean;
  updateFrequency?: number;
}

export interface DateState {
  random?: number;
}

export class DateField extends React.Component<DateProps, DateState> {
  refreshInterval: NodeJS.Timeout;

  static defaultProps: Partial<DateProps> = {
    placeholder: '-',
    format: 'YYYY-MM-DD',
    valueFormat: 'X',
    fromNow: false,
    updateFrequency: 60000
  };

  // 动态显示相对时间时，用来触发视图更新
  state: DateState = {
    random: 0
  };

  componentDidMount() {
    const {fromNow, updateFrequency} = this.props;

    if (fromNow && updateFrequency) {
      this.refreshInterval = setInterval(() => {
        this.setState({
          random: Math.random()
        });
      }, updateFrequency);
    }
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  render() {
    const {
      value,
      valueFormat,
      format,
      placeholder,
      fromNow,
      className,
      classnames: cx,
      translate: __
    } = this.props;
    let viewValue: React.ReactNode = (
      <span className="text-muted">{placeholder}</span>
    );

    if (value) {
      let ISODate = moment(value, moment.ISO_8601);
      let NormalDate = moment(value, valueFormat);

      viewValue = ISODate.isValid()
        ? ISODate.format(format)
        : NormalDate.isValid()
        ? NormalDate.format(format)
        : false;
    }

    if (fromNow) {
      viewValue = moment(viewValue as string).fromNow();
    }

    viewValue = !viewValue ? (
      <span className="text-danger">{__('日期无效')}</span>
    ) : (
      viewValue
    );

    return <span className={cx('DateField', className)}>{viewValue}</span>;
  }
}

@Renderer({
  test: /(^|\/)date$/,
  name: 'date-field'
})
export class DateFieldRenderer extends DateField {
  static defaultProps: Partial<DateProps> = {
    ...DateField.defaultProps,
    format: 'YYYY-MM-DD'
  };
}

@Renderer({
  test: /(^|\/)datetime$/,
  name: 'datetime-field'
})
export class DateTimeFieldRenderer extends DateField {
  static defaultProps: Partial<DateProps> = {
    ...DateField.defaultProps,
    format: 'YYYY-MM-DD HH:mm:ss'
  };
}

@Renderer({
  test: /(^|\/)time$/,
  name: 'time-field'
})
export class TimeFieldRenderer extends DateField {
  static defaultProps: Partial<DateProps> = {
    ...DateField.defaultProps,
    format: 'HH:mm'
  };
}
@Renderer({
  test: /(^|\/)months$/,
  name: 'month-field'
})
export class MonthFieldRenderer extends DateField {
  static defaultProps: Partial<DateProps> = {
    ...DateField.defaultProps,
    format: 'MM'
  };
}

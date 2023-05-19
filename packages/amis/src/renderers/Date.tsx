import React from 'react';
import {Renderer, RendererProps, normalizeDate} from 'amis-core';
import moment, {Moment} from 'moment';
import {BaseSchema} from '../Schema';
import {getPropValue} from 'amis-core';

/**
 * Date 展示渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/date
 */
export interface DateSchema extends BaseSchema {
  /**
   * 指定为日期展示类型
   */
  type:
    | 'date'
    | 'datetime'
    | 'time'
    | 'static-date'
    | 'static-datetime'
    | 'static-time';

  /**
   * 展示的时间格式，参考 moment 中的格式说明。
   */
  format?: string;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 值的时间格式，参考 moment 中的格式说明。
   */
  valueFormat?: string;

  /**
   * 显示成相对时间，比如1分钟前
   */
  fromNow?: boolean;

  /**
   * 更新频率， 默认为1分钟
   */
  updateFrequency?: number;
}

export interface DateProps
  extends RendererProps,
    Omit<DateSchema, 'type' | 'className'> {}

export interface DateState {
  random?: number;
}

export class DateField extends React.Component<DateProps, DateState> {
  refreshInterval: ReturnType<typeof setTimeout>;

  static defaultProps: Pick<
    DateProps,
    'placeholder' | 'format' | 'valueFormat' | 'fromNow' | 'updateFrequency'
  > = {
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
      valueFormat,
      format,
      placeholder,
      fromNow,
      className,
      style,
      classnames: cx,
      locale,
      translate: __
    } = this.props;
    let viewValue: React.ReactNode = (
      <span className="text-muted">{placeholder}</span>
    );

    const value = getPropValue(this.props);

    // 主要是给 fromNow 用的
    let date: any = null;
    if (value && (date = normalizeDate(value, valueFormat))) {
      const normalizeDate: Moment = date;
      viewValue = normalizeDate.format(format);

      if (viewValue) {
        date = viewValue as string;
      }

      if (fromNow) {
        viewValue = normalizeDate.locale(locale).fromNow();
      }
    }

    viewValue = !viewValue ? (
      <span className="text-danger">{__('Date.invalid')}</span>
    ) : (
      viewValue
    );

    return (
      <span
        className={cx('DateField', className)}
        style={style}
        title={fromNow && date ? date : undefined}
      >
        {viewValue}
      </span>
    );
  }
}

@Renderer({
  type: 'date'
})
export class DateFieldRenderer extends DateField {
  static defaultProps: Partial<DateProps> = {
    ...DateField.defaultProps,
    format: 'YYYY-MM-DD'
  };
}

@Renderer({
  type: 'datetime'
})
export class DateTimeFieldRenderer extends DateField {
  static defaultProps: Partial<DateProps> = {
    ...DateField.defaultProps,
    format: 'YYYY-MM-DD HH:mm:ss'
  };
}

@Renderer({
  type: 'time'
})
export class TimeFieldRenderer extends DateField {
  static defaultProps: Partial<DateProps> = {
    ...DateField.defaultProps,
    format: 'HH:mm'
  };
}
@Renderer({
  type: 'month'
})
export class MonthFieldRenderer extends DateField {
  static defaultProps: Partial<DateProps> = {
    ...DateField.defaultProps,
    format: 'YYYY-MM'
  };
}

import React from 'react';
import {
  Renderer,
  RendererProps,
  normalizeDate,
  CustomStyle,
  setThemeClassName
} from 'amis-core';
import moment, {Moment} from 'moment';
import 'moment-timezone';
import {BaseSchema} from '../Schema';
import {getPropValue} from 'amis-core';
import {AMISSchemaBase} from 'amis-core';

/**
 * Date 展示渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/date
 */
/**
 * 日期展示组件，用于格式化显示日期/时间。支持多格式与相对时间。
 */
export interface AMISDateSchema extends AMISSchemaBase {
  /**
   * 指定为 date 组件
   */
  type:
    | 'date'
    | 'datetime'
    | 'time'
    | 'static-date'
    | 'static-datetime'
    | 'static-time';

  /**
   * 展示的时间格式
   */
  format?: string;

  /**
   * 展示的时间格式（新：同format）
   */
  displayFormat?: string;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 值的时间格式
   */
  valueFormat?: string;

  /**
   * 显示成相对时间
   */
  fromNow?: boolean;

  /**
   * 更新频率
   */
  updateFrequency?: number;

  /**
   * 时区
   */
  displayTimeZone?: string;
}

export interface DateProps
  extends RendererProps,
    Omit<AMISDateSchema, 'type' | 'className'> {}

export interface DateState {
  random?: number;
}

export class DateField extends React.Component<DateProps, DateState> {
  refreshInterval: ReturnType<typeof setTimeout>;

  static defaultProps: Pick<
    DateProps,
    | 'placeholder'
    | 'format'
    | 'valueFormat'
    | 'fromNow'
    | 'updateFrequency'
    | 'displayFormat'
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
      displayFormat,
      placeholder,
      fromNow,
      className,
      style,
      classnames: cx,
      locale,
      translate: __,
      displayTimeZone,
      data,
      id,
      wrapperCustomStyle,
      env,
      themeCss,
      baseControlClassName
    } = this.props;
    let viewValue: React.ReactNode = (
      <span className="text-muted">{placeholder}</span>
    );

    const value = getPropValue(this.props);

    // 主要是给 fromNow 用的
    let date: any = null;
    if (value && (date = normalizeDate(value, valueFormat))) {
      let normalizeDate: Moment = date;

      if (displayTimeZone) {
        normalizeDate = normalizeDate.clone().tz(displayTimeZone);
      }

      viewValue = normalizeDate.format(displayFormat || format);

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
      <>
        <span
          style={style}
          title={fromNow && date ? date : undefined}
          className={cx(
            'DateField',
            className,
            setThemeClassName({
              ...this.props,
              name: 'baseControlClassName',
              id,
              themeCss
            }),
            setThemeClassName({
              ...this.props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle
            })
          )}
        >
          {viewValue}
        </span>
        <CustomStyle
          {...this.props}
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'baseControlClassName'
              }
            ]
          }}
          env={env}
        />
      </>
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

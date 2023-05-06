import React from 'react';
import merge from 'lodash/merge';
import assign from 'lodash/assign';
import {
  generateIcon,
  isPureVariable,
  Renderer,
  RendererProps,
  resolveVariableAndFilter
} from 'amis-core';
import {filter} from 'amis-core';
import {Icon} from 'amis-ui';
import {BaseSchema} from '../Schema';
import {getPropValue} from 'amis-core';

export interface StatusSource {
  [propName: string]: {
    icon?: string;
    label?: string;
    color?: string;
    className?: string;
  };
}

/**
 * 状态展示控件。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/status
 */
export interface StatusSchema extends BaseSchema {
  /**
   * 指定为状态展示控件
   */
  type: 'status';

  /**
   * 占位符
   * @default -
   */
  placeholder?: string;

  /**
   * 状态图标映射关系
   * @deprecated 已废弃，2.8.0 废弃，兼容中
   * @default {
   *    0: 'svg-fail',
   *    1: 'svg-success',
   *    success: 'svg-success',
   *    pending: 'rolling',
   *    fail: 'svg-fail',
   *    queue: 'svg-warning',
   *    schedule: 'svg-schedule'
   *  }
   */
  map?: {
    [propName: string]: string;
  };

  /**
   * 文字映射关系
   * @deprecated 已废弃，2.8.0 废弃，兼容中
   * @default {
   *     success: '成功',
   *     pending: '运行中',
   *     fail: '失败',
   *     queue: '排队中',
   *     schedule: '调度中'
   * }
   */
  labelMap?: {
    [propName: string]: string;
  };

  /**
   * 新版配置映射源的字段
   * 可以兼容新版icon并且配置颜色
   * 2.8.0 新增
   */
  source?: StatusSource;
}

export interface StatusProps
  extends RendererProps,
    Omit<StatusSchema, 'className'> {}

export class StatusField extends React.Component<StatusProps, object> {
  static defaultProps: Partial<StatusProps> = {
    placeholder: '-',
    map: {
      0: 'svg-fail',
      1: 'svg-success',
      success: 'svg-success',
      pending: 'rolling',
      fail: 'svg-fail',
      queue: 'svg-warning',
      schedule: 'svg-schedule'
    },
    labelMap: {
      success: '成功',
      pending: '运行中',
      fail: '失败',
      queue: '排队中',
      schedule: '调度中'
    }
  };

  render() {
    const {
      defaultValue,
      className,
      style,
      placeholder,
      classnames: cx,
      data
    } = this.props;
    const map = merge(StatusField.defaultProps.map, this.props?.map);
    const labelMap = merge(
      StatusField.defaultProps.labelMap,
      this.props?.labelMap
    );

    // 兼容旧版
    let oldSource: StatusSource = {};
    map &&
      Object.entries(map).forEach(([value, icon]) => {
        if (!oldSource[value]) {
          oldSource[value] = {icon};
        } else {
          oldSource[value] = {...oldSource[value], icon};
        }
      });
    labelMap &&
      Object.entries(labelMap).forEach(([value, label]) => {
        if (!oldSource[value]) {
          oldSource[value] = {label};
        } else {
          oldSource[value] = {...oldSource[value], label};
        }
      });

    // 合并source
    let source = this.props.source || {};
    if (isPureVariable(source)) {
      source = resolveVariableAndFilter(source, data, '| raw');
    }
    source = assign(oldSource, source);

    // 获取默认值，支持表达式
    let value = getPropValue(this.props);
    if (defaultValue && isPureVariable(defaultValue)) {
      value = resolveVariableAndFilter(defaultValue, data, '| raw');
    }

    if (value != undefined && value !== '') {
      if (typeof value === 'boolean') {
        value = value ? 1 : 0;
      } else if (/^\d+$/.test(value)) {
        value = parseInt(value, 10) || 0;
      }
    }

    let status = source[value] || {};

    if (!status.icon && !status.label) {
      return (
        <span className={cx('StatusField', className)} style={style}>
          <span className="text-muted" key="status-value">
            {placeholder}
          </span>
        </span>
      );
    }

    let wrapClassName: string = '';

    // icon element
    let iconElement = null;
    if (status.icon) {
      wrapClassName = `StatusField--${value}`;
      let icon = status.icon;
      let svgIcon: string = '';
      let itemClassName: string = '';

      if (typeof icon === 'string') {
        icon = filter(icon, data) || '';
        itemClassName = icon.replace(
          /\bsvg-([^\s|$]+)\b/g,
          (_: string, svgName: string) => {
            svgIcon = svgName;
            return 'icon';
          }
        );
      }

      // 兼容 默认icon 和 旧版 iconfont icon
      if (svgIcon) {
        iconElement = (
          <Icon
            icon={svgIcon}
            className={cx('Status-icon icon', itemClassName)}
            key="icon"
          />
        );
      } else {
        iconElement = generateIcon(cx, icon, 'Status-icon');
      }
    }

    let labelElement = null;
    if (status.label !== '' && status.label != null) {
      labelElement = (
        <span className={cx('StatusField-label')} key="label">
          {filter('' + status.label, data)}
        </span>
      );
    }

    return (
      <span
        className={cx(
          'StatusField',
          wrapClassName,
          className,
          status.className
        )}
        style={{
          ...style,
          ...(status.color ? {color: filter(status.color, data)} : {})
        }}
      >
        {iconElement}
        {labelElement}
      </span>
    );
  }
}

@Renderer({
  type: 'status'
})
export class StatusFieldRenderer extends StatusField {}

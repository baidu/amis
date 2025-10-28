import React from 'react';
import merge from 'lodash/merge';
import assign from 'lodash/assign';
import {
  AMISSchemaBase,
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
  /**
   * 状态映射配置
   */
  [propName: string]: {
    /**
     * 状态图标
     */
    icon?: string;

    /**
     * 状态标签文本
     */
    label?: string;

    /**
     * 状态颜色
     */
    color?: string;

    /**
     * 状态样式类名
     */
    className?: string;
  };
}

/**
 * 状态展示组件，用于显示各种状态信息
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/status
 */
/**
 * 状态组件，用于显示状态点/标签等。支持多状态映射与颜色标识。
 */
export interface AMISStatusSchema extends AMISSchemaBase {
  /**
   * 指定为 status 组件
   */
  type: 'status';

  /**
   * 占位符文本
   * @default -
   */
  placeholder?: string;

  /**
   * 状态图标映射关系
   * @deprecated 已废弃，2.8.0 废弃，建议使用 source 配置
   */
  map?: {
    [propName: string]: string;
  };

  /**
   * 文字映射关系
   * @deprecated 已废弃，2.8.0 废弃，建议使用 source 配置
   */
  labelMap?: {
    [propName: string]: string;
  };

  /**
   * 新版状态映射源配置
   */
  source?: StatusSource;
}

export interface StatusProps
  extends RendererProps,
    Omit<AMISStatusSchema, 'className'> {}

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

    let classNameProp: string = '';

    // icon element
    let iconElement = null;
    if (status.icon) {
      classNameProp = `StatusField--${value}`;
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
      iconElement = (
        <Icon
          cx={cx}
          icon={svgIcon || icon}
          className="Status-icon icon"
          classNameProp={itemClassName}
          key="icon"
        />
      );
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
          classNameProp,
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

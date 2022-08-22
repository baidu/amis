import React from 'react';
import {Renderer, RendererProps, filter} from 'amis-core';
import cx from 'classnames';
import {BaseSchema, SchemaClassName, SchemaTpl} from '../Schema';
import {autobind, getPropValue, createObject} from 'amis-core';

import {Progress} from 'amis-ui';
import type {ColorMapType} from 'amis-ui/lib/components/Progress';

/**
 * 进度展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/progress
 */
export interface ProgressSchema extends BaseSchema {
  type: 'progress';

  /**
   * 关联字段名
   */
  name?: string;

  /**
   * 进度值
   */
  value: number;

  /**
   * 进度条类型
   */
  mode: 'line' | 'circle' | 'dashboard';

  /**
   * 进度条 CSS 类名
   */
  progressClassName?: SchemaClassName;

  /**
   * 配置不同的值段，用不同的样式提示用户
   */
  map?: ColorMapType;

  /**
   * 是否显示值
   */
  showLabel?: boolean;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 是否显示背景间隔
   */
  stripe?: boolean;

  /**
   * 是否显示动画（只有在开启的时候才能看出来）
   */
  animate?: boolean;

  /**
   * 进度条线的宽度
   */
  strokeWidth?: number;

  /**
   * 仪表盘进度条缺口角度，可取值 0 ~ 295
   */
  gapDegree?: number;

  /**
   * 仪表盘进度条缺口位置
   */
  gapPosition?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * 内容的模板函数
   */
  valueTpl?: string;

  /**
   * 阈值
   */
  threshold?:
    | {value: SchemaTpl; color?: string}
    | {value: SchemaTpl; color?: string}[];

  /**
   * 是否显示阈值数值
   */
  showThresholdText?: boolean;
}

export interface ProgressProps
  extends RendererProps,
    Omit<ProgressSchema, 'type' | 'className'> {}

export class ProgressField extends React.Component<ProgressProps, object> {
  static defaultProps = {
    placeholder: '-',
    progressClassName: '',
    progressBarClassName: '',
    map: ['bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success'],
    valueTpl: '${value}%',
    showLabel: true,
    stripe: false,
    animate: false
  };

  @autobind
  format(value: number) {
    const {valueTpl, render, data} = this.props;
    return render(`progress-value`, valueTpl || '${value}%', {
      data: createObject(data, {value})
    });
  }

  render() {
    const {
      data,
      mode,
      className,
      placeholder,
      progressClassName,
      map,
      stripe,
      animate,
      showLabel,
      strokeWidth,
      gapDegree,
      gapPosition,
      classnames: cx,
      threshold,
      showThresholdText
    } = this.props;

    let value = getPropValue(this.props);
    value = typeof value === 'number' ? value : filter(value, data);

    if (/^\d*\.?\d+$/.test(value)) {
      value = parseFloat(value);
    }

    if (threshold) {
      if (Array.isArray(threshold)) {
        threshold.forEach(item => {
          item.value =
            typeof item.value === 'string'
              ? filter(item.value, data)
              : item.value;
          item.color && (item.color = filter(item.color, data));
        });
      } else {
        threshold.value = filter(threshold.value, data);
        threshold.color && (threshold.color = filter(threshold.color, data));
      }
    }

    return (
      <Progress
        value={value}
        type={mode}
        map={map}
        stripe={stripe}
        animate={animate}
        showLabel={showLabel}
        placeholder={placeholder}
        format={this.format}
        strokeWidth={strokeWidth}
        gapDegree={gapDegree}
        gapPosition={gapPosition}
        className={className}
        progressClassName={progressClassName}
        threshold={threshold}
        showThresholdText={showThresholdText}
      />
    );
  }
}

@Renderer({
  type: 'progress'
})
export class ProgressFieldRenderer extends ProgressField {}

import React from 'react';
import {
  Renderer,
  RendererProps,
  filter,
  ActionObject,
  ScopedContext,
  IScopedContext,
  ScopedComponentType,
  AMISSchemaBase
} from 'amis-core';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import cx from 'classnames';
import {BaseSchema, AMISClassName, SchemaTpl} from '../Schema';
import {autobind, getPropValue, createObject} from 'amis-core';

import {Progress} from 'amis-ui';
import type {ColorMapType} from 'amis-ui/lib/components/Progress';

/**
 * 进度展示控件。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/progress
 */
/**
 * 进度条组件，用于显示任务进度。支持条形/环形、多状态与格式化显示。
 */
export interface AMISProgressSchema extends AMISSchemaBase {
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
   * 进度条CSS类名
   */
  progressClassName?: AMISClassName;

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
   * 是否显示动画
   */
  animate?: boolean;

  /**
   * 进度条线的宽度
   */
  strokeWidth?: number;

  /**
   * 仪表盘进度条缺口角度
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
    Omit<AMISProgressSchema, 'type' | 'className'> {}

interface ProgressState {
  value: number;
}

const COMPARE_KEYS = ['name', 'value', 'data', 'defaultValue'];

export class ProgressField extends React.Component<
  ProgressProps,
  ProgressState
> {
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

  constructor(props: ProgressProps) {
    super(props);

    this.state = {
      value: this.getValue()
    };
  }

  componentDidUpdate(prevProps: Readonly<ProgressProps>): void {
    if (
      !isEqual(pick(prevProps, COMPARE_KEYS), pick(this.props, COMPARE_KEYS))
    ) {
      this.setState({value: this.getValue()});
    }
  }

  getValue() {
    let value = getPropValue(this.props);
    value = typeof value === 'number' ? value : filter(value, this.props.data);

    if (/^\d*\.?\d+$/.test(value)) {
      value = parseFloat(value);
    }
    return value;
  }

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
      style,
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
    const {value} = this.state;

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
        style={style}
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
export class ProgressFieldRenderer extends ProgressField {
  static contextType = ScopedContext;

  constructor(props: ProgressProps, context: IScopedContext) {
    super(props);
    const scoped = context;
    scoped.registerComponent(this as unknown as ScopedComponentType);
  }

  componentWillUnmount() {
    super.componentWillUnmount?.();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this as unknown as ScopedComponentType);
  }

  doAction(
    action: ActionObject,
    data: any,
    throwErrors: boolean,
    args?: any
  ): any {
    const actionType = action?.actionType as string;

    if (actionType === 'reset') {
      this.setState({value: 0});
    }
  }

  setData(value: number) {
    if (typeof value === 'number' || typeof +value === 'number') {
      this.setState({value: +value});
    }
  }
}

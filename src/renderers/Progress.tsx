import React from 'react';
import {Renderer, RendererProps} from '../factory';
import cx from 'classnames';
import {BaseSchema, SchemaClassName} from '../Schema';
import {autobind, getPropValue, createObject} from '../utils/helper';
import {filter} from '../utils/tpl';

import Progress from '../components/Progress';
/**
 * 进度展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/progress
 */
export interface ProgressSchema extends BaseSchema {
  type: 'progress';

  /**
   * 关联字段名。
   */
  name?: string;

  /**
   * 进度条类型。
   */
  mode: 'line' | 'circle' | 'dashboard';

  /**
   * 进度条 CSS 类名
   */
  progressClassName?: SchemaClassName;

  /**
   * 进度外层 CSS 类名
   */
  progressBarClassName?: SchemaClassName;

  /**
   * 配置不通的值段，用不通的样式提示用户
   */
  map?: Array<string>;

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
      mode,
      className,
      placeholder,
      progressClassName,
      progressBarClassName,
      map,
      stripe,
      animate,
      showLabel,
      strokeWidth,
      gapDegree,
      gapPosition,
      classnames: cx
    } = this.props;

    let value = getPropValue(this.props);

    if (/^\d*\.?\d+$/.test(value)) {
      value = parseFloat(value);
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
        progressBarClassName={progressBarClassName}
      />
    );
  }
}

@Renderer({
  type: 'progress'
})
export class ProgressFieldRenderer extends ProgressField {}

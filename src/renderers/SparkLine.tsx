import SparkLine, {SparkLineProps} from '../components/SparkLine';
import {Renderer, RendererProps} from '../factory';
import React from 'react';
import {resolveVariableAndFilter} from '../utils/tpl-builtin';
import {BaseSchema, SchemaClassName} from '../Schema';
import {ActionSchema} from './Action';
import {autobind, createObject} from '../utils/helper';

export interface SparkLineSchema extends BaseSchema {
  type: 'sparkline';

  /**
   * css 类名
   */
  className?: SchemaClassName;

  /**
   * 关联数据变量。
   */
  name?: string;

  /**
   * 宽度
   * @default 100
   */
  width?: number;

  /**
   * 高度
   * @default 50
   */
  height?: number;

  /**
   * 点击行为
   */
  clickAction?: ActionSchema;

  // /**
  //  * 线的转折是否要有圆角。默认为 2
  //  */
  // lineRadius?: number;

  // /**
  //  * 默认为2，线的宽度。
  //  */
  // lineWidth?: number;

  // /**
  //  * 线的颜色，默认为 primaryColor
  //  */
  // lineColor?: string;

  // /**
  //  * 下面堆积区域的颜色。
  //  */
  // areaColor?: string;

  // /**
  //  * 光标移动上来的点的颜色值
  //  */
  // cursorColor?: number;

  // 如果有 label 就有 hover 效果，如果没有没有鼠标hover 交互。
  value?: Array<
    | number
    | {
        value: number;
        label?: string;
      }
  >;
}

interface SparkLineRendProps
  extends RendererProps,
    Omit<SparkLineSchema, 'type' | 'className'> {}

@Renderer({
  test: /(^|\/)sparkline$/,
  name: 'sparkline'
})
export class SparkLineRenderer extends React.Component<SparkLineRendProps> {
  @autobind
  handleClick(e: React.MouseEvent, ctx: any) {
    const {disabled, onAction, clickAction, data} = this.props;
    if (e.defaultPrevented || !clickAction || disabled) {
      return;
    }

    onAction?.(null, clickAction, ctx ? createObject(data, ctx) : data);
  }

  render() {
    const {value, name, data, clickAction} = this.props;

    const finalValue =
      value ?? (name ? resolveVariableAndFilter(name, data) : [1, 1]);

    return (
      <SparkLine
        onClick={clickAction ? this.handleClick : undefined}
        {...this.props}
        value={finalValue}
      />
    );
  }
}

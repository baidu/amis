import {SparkLine} from 'amis-ui';
import {Renderer, RendererProps} from 'amis-core';
import React from 'react';
import {resolveVariableAndFilter} from 'amis-core';
import {BaseSchema, SchemaClassName} from '../Schema';
import {ActionSchema} from './Action';
import {autobind, createObject, getPropValue} from 'amis-core';

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

  /**
   * 空数据时显示的内容
   */
  placeholder?: string;

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
  type: 'sparkline'
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
    const finalValue = getPropValue(this.props) || [1, 1];

    return (
      <SparkLine
        onClick={clickAction ? this.handleClick : undefined}
        {...this.props}
        value={finalValue}
      />
    );
  }
}

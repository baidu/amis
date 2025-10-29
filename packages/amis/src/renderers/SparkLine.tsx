import {SparkLine} from 'amis-ui';
import {
  Renderer,
  RendererProps,
  autobind,
  createObject,
  getPropValue,
  CustomStyle,
  AMISSchemaBase
} from 'amis-core';
import React from 'react';
import {resolveVariableAndFilter} from 'amis-core';
import {BaseSchema, AMISClassName} from '../Schema';
import {ActionSchema} from './Action';

/**
 * 迷你图组件，用于紧凑展示趋势数据。支持折线、柱状等类型。
 */
export interface AMISSparkLineSchema extends AMISSchemaBase {
  type: 'sparkline';

  /**
   * CSS 类名
   */
  className?: AMISClassName;

  /**
   * 关联数据变量
   */
  name?: string;

  /**
   * 宽度
   */
  width?: number;

  /**
   * 高度
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
    Omit<AMISSparkLineSchema, 'type' | 'className'> {}

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
    const {value, name, clickAction, id, wrapperCustomStyle, env, themeCss} =
      this.props;
    const finalValue = getPropValue(this.props) || [1, 1];

    return (
      <>
        <SparkLine
          onClick={clickAction ? this.handleClick : undefined}
          {...this.props}
          value={finalValue}
        />
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

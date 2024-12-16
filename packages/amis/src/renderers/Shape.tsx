/**
 * @file Shape.tsx 图形组件
 *
 * @author allenve(yupeng12@baidu.com)
 * @created: 2024/12/12
 */

import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {Shape, IShapeType} from 'amis-ui';
import cx from 'classnames';
import {BaseSchema} from '../Schema';

export interface IShapeSchema extends BaseSchema {
  type: 'shape';
  /**
   * 图形类型
   */
  shapeType: IShapeType;

  /**
   * 图形宽度
   */
  width?: number;
  /**
   * 图形宽度
   */
  height?: number;
  /**
   * 圆角大小 1~10
   */
  radius: number;
  /**
   * 颜色
   */
  color?: string;
}

interface IShapeRenderProps
  extends RendererProps,
    Omit<IShapeSchema, 'className'> {}

@Renderer({
  type: 'shape'
})
export class ShapeRenderer extends React.Component<IShapeRenderProps> {
  render() {
    const {className, shapeType, radius, width, height, color} = this.props;

    return (
      <Shape
        className={cx(className)}
        shapeType={shapeType}
        width={width}
        height={height}
        color={color}
        radius={radius}
      />
    );
  }
}

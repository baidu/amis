/**
 * @file Shape.tsx 图形组件
 *
 * @author allenve(yupeng12@baidu.com)
 * @created: 2024/12/12
 */

import React from 'react';
import {autobind, filter, Renderer, RendererProps} from 'amis-core';
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
  /**
   * 自定义路径，仅 shapeType 为 custom 时有效
   */
  paths?: string[];
  /**
   * 边框颜色
   */
  stroke?: string;
  /**
   * 边框宽度
   */
  strokeWidth?: number;
  /**
   * 边框类型
   */
  strokeType?: 'line' | 'dash' | 'dot';
}

interface IShapeRenderProps
  extends RendererProps,
    Omit<IShapeSchema, 'className'> {}

@Renderer({
  type: 'shape'
})
export class ShapeRenderer extends React.Component<IShapeRenderProps> {
  @autobind
  handleClick() {
    this.props.dispatchEvent('click', this.props.data);
  }

  render() {
    const {className, radius, shapeType, data, ...rest} = this.props;
    const shapeTypeValue = (filter(shapeType, data) as IShapeType) || shapeType;
    const radiusValue = +filter(radius, data) || radius;

    return (
      <Shape
        {...rest}
        className={cx(className)}
        shapeType={shapeTypeValue}
        radius={radiusValue}
        onClick={this.handleClick}
      />
    );
  }
}

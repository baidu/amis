/**
 * @file 简化版 Flex 布局，主要用于不熟悉 CSS 的开发者
 */

import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Schema} from '../types';
import {BaseSchema, SchemaObject} from '../Schema';

export type FlexItemProps = {
  /**
   * 宽度
   */
  width?: number;

  /**
   * 高度
   */
  height?: number;

  /**
   * 这个 Flex 的布局
   */
  align: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };
};

export type FlexItem = FlexItemProps & SchemaObject;

/**
 * Flex 布局
 * 文档：https://baidu.gitee.io/amis/docs/components/flex
 */
export interface FlexSchema extends BaseSchema {
  /**
   * 指定为 flex 展示类型
   */
  type: 'flex';

  /**
   * 水平分布
   */
  justify?:
    | 'start'
    | 'flex-start'
    | 'center'
    | 'end'
    | 'flex-end'
    | 'space-around'
    | 'space-between'
    | 'space-evenly';

  /**
   * 垂直布局
   */
  alignItems?:
    | 'stretch'
    | 'start'
    | 'flex-start'
    | 'flex-end'
    | 'end'
    | 'center'
    | 'baseline';

  /**
   * 多行情况下的垂直分布
   */
  alignContent?:
    | 'normal'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';

  /**
   * 方向
   */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';

  /**
   * 每个 flex 的设置
   */
  items: Array<FlexItem>;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };
}

export interface FlexProps
  extends RendererProps,
    Omit<FlexSchema, 'type' | 'className'> {}

export default class Flex extends React.Component<FlexProps, object> {
  static defaultProps: Partial<FlexProps> = {
    direction: 'row',
    justify: 'center',
    alignItems: 'center',
    alignContent: 'center'
  };

  constructor(props: FlexProps) {
    super(props);
  }

  render() {
    const {
      items,
      direction,
      justify,
      alignItems,
      alignContent,
      style,
      render,
      className
    } = this.props;

    const flexStyle = {
      display: 'flex',
      flexDirection: direction,
      justifyContent: justify,
      alignItems,
      alignContent,
      ...style
    };

    return (
      <div style={flexStyle} className={className}>
        {items.map((item, key) => render(`flexItem/${key}`, item))}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)flex$/,
  name: 'flex'
})
export class FlexRenderer extends Flex {}

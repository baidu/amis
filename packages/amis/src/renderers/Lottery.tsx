import React from 'react';
import {
  anyChanged,
  getPropValue,
  IListStore,
  isPureVariable,
  Renderer,
  RendererProps,
  resolveVariableAndFilter
} from 'amis-core';
import {Lottery as SquareNineComponent} from 'amis-ui';
import {SchemaTokenizeableString} from '../Schema';

import type {BaseSchema} from 'amis';
import {ListProps} from './List';

interface SquareNineProps extends RendererProps {
  width?: number;
  height?: number;
  items: {name: string; pictureUrl: string; id: number}[];
  source: SchemaTokenizeableString;
  children?: React.ReactNode;
}
/**
 * Lottery 九宫格抽奖。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/lottery
 */

export interface LotterySchema extends BaseSchema {
  /**
   * 指定为提示框类型
   */
  type: 'lottery';

  //宽度，默认300px
  width?: number;
  //高度，默认300px
  height?: number;
  //奖品列表
  items: {name: string; pictureUrl: string; id: number}[];
  // 开始按钮
  children?: React.ReactNode;
  //目标索引（中奖）
  targetIndex?: number;
  // 结束回调
  callback?: (index: number) => void;
  // 数据源： 绑定当前环境变量, @default: '${items}'
  source?: SchemaTokenizeableString;
}

@Renderer({
  type: 'lottery'
})
export class LotteryRenderer extends React.Component<
  Omit<SquareNineProps, 'actions'> & RendererProps
> {
  static propList: Array<keyof ListProps> = [
    'width',
    'height',
    'items',
    'source',
    'targetIndex',
    'callback',
    'children'
  ];

  render() {
    const {items, ...rest} = this.props;
    return <SquareNineComponent items={items} {...rest} />;
  }
}

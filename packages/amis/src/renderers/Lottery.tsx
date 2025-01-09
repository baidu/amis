import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {Lottery as SquareNineComponent} from 'amis-ui';

import type {BaseSchema} from 'amis';

interface SquareNineProps extends RendererProps {
  width?: number;
  height?: number;
  items: {name: string; pictureUrl: string; id: number}[];
  children?: React.ReactNode;
}
/**
 * Lottery 九宫格抽奖。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/alert
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
}

@Renderer({
  type: 'lottery'
})
export class LotteryRenderer extends React.Component<
  Omit<SquareNineProps, 'actions'> & RendererProps
> {
  render() {
    const {items, ...rest} = this.props;
    return <SquareNineComponent items={items} {...rest} />;
  }
}

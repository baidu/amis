import React, { ReactNode, useState } from 'react';
import { SchemaExpression } from '../Schema';
import {themeable, ThemeProps} from '../theme';
import TimelineItem from './TimelineItem';

export interface TimelineItemProps {
  /**
   * 时间点
   */
  time: string;

  /**
   * 事件名称
   */
  title?: string| ReactNode;

  /**
    * 详细内容
    */
  detail?: string;

  /**
   * detail折叠时文案
   */
  detailCollapsedText?: string;

   /**
    * detail展开时文案
    */
  detailExpandedText?: string;

  /**
   * 时间点圆圈颜色,可传入英文/颜色值/level样式（info、success、warning、danger）
   */
  color?: SchemaExpression;

  /**
   * 图标
   */
  icon?: string | ReactNode;
}

export interface TimelineProps extends ThemeProps {
  timelineItems: Array<TimelineItemProps>;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  mode?: 'left' | 'right' | 'alternate';
}

export function Timeline(props: TimelineProps) {
  const {
    timelineItems,
    classnames: cx,
    direction = 'vertical',
    reverse = false,
    mode = 'right',
  } = props;

  const timelineDatasource = timelineItems.slice();

  reverse && timelineDatasource.reverse();

  return (
    <>
      <div className={cx(`${direction === 'horizontal' ? `Timeline-${direction}` : `Timeline Timeline-${mode}`}`)}>
        {timelineDatasource?.map((timeItem: TimelineItemProps, index) => {
          let showMode = mode;
          if (showMode === 'alternate') {
            showMode = index % 2 === 0 ? 'left' : 'right';
          }
          return (<TimelineItem
              timelineItem={timeItem}
              itemCnt={timelineDatasource.length}
              index={index}
              mode={showMode}
              last={index === timelineDatasource.length - 1}
              />)
        })}
      </div>
    </>)
}

export default themeable(Timeline);

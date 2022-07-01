import React from 'react';
import {themeable, ThemeProps} from 'amis-core';
import TimelineItem, {TimelineItemProps} from './TimelineItem';

export interface TimelineProps extends ThemeProps {
  items: Array<TimelineItemProps>;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  mode?: 'left' | 'right' | 'alternate';
}

export function Timeline(props: TimelineProps) {
  const {
    items,
    classnames: cx,
    direction = 'vertical',
    reverse = false,
    mode = 'right'
  } = props;

  const timelineDatasource = items?.slice();

  reverse && timelineDatasource?.reverse();

  return (
    <div
      className={cx('Timeline', `Timeline-${direction}`, `Timeline-${mode}`)}
    >
      {timelineDatasource?.map((item: TimelineItemProps, index: number) => (
        <TimelineItem {...item} key={`TimelineItem-${index}`} />
      ))}
    </div>
  );
}

export default themeable(Timeline);

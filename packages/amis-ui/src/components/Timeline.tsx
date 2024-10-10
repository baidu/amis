import React from 'react';
import {themeable, ThemeProps} from 'amis-core';
import TimelineItem, {TimelineItemProps} from './TimelineItem';

export interface TimelineProps extends ThemeProps {
  items: Array<TimelineItemProps>;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  mode?: 'left' | 'right' | 'alternate';
  iconClassName?: string;
  timeClassName?: string;
  titleClassName?: string;
  detailClassName?: string;
}

export function Timeline(props: TimelineProps) {
  const {
    items,
    style,
    classnames: cx,
    className,
    iconClassName,
    timeClassName,
    titleClassName,
    detailClassName,
    direction = 'vertical',
    reverse = false,
    mode = 'right'
  } = props;

  const timelineDatasource = items?.slice();

  reverse && timelineDatasource?.reverse();

  return (
    <div
      className={cx(
        'Timeline',
        `Timeline-${direction}`,
        `Timeline-${mode}`,
        className
      )}
      style={style}
    >
      {timelineDatasource?.map((item: TimelineItemProps, index: number) => (
        <TimelineItem
          {...item}
          key={`TimelineItem-${index}`}
          iconClassName={item.iconClassName || iconClassName}
          timeClassName={item.timeClassName || timeClassName}
          titleClassName={item.titleClassName || titleClassName}
          detailClassName={item.detailClassName || detailClassName}
        />
      ))}
    </div>
  );
}

export default themeable(Timeline);

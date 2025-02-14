import React from 'react';
import {themeable, ThemeProps} from 'amis-core';
import TimelineItem, {
  TimelineContentComponent,
  TimelineItemProps,
  TimelineLineComponent,
  TimelineTimeComponent,
  getAlignByDirection
} from './TimelineItem';

export enum DirectionMode {
  left = 'left',
  right = 'right',
  top = 'top',
  bottom = 'bottom',
  alternate = 'alternate'
}

export interface TimelineProps extends ThemeProps {
  items: Array<TimelineItemProps>;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  mode?: DirectionMode;
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
    reverse = false
  } = props;

  let {mode = DirectionMode.right} = props;

  const timelineDatasource = items?.slice();

  reverse && timelineDatasource?.reverse();

  // 分成水平和垂直两种模式渲染
  if (direction === 'horizontal') {
    if ([DirectionMode.right, DirectionMode.left].includes(mode)) {
      mode = DirectionMode.top;
    }

    // alternate模式下，交替生成时间和内容
    const isReverseScenario = (index: number, isAlternate: boolean) =>
      isAlternate ? index % 2 === 0 : false;

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
        <div className={cx('Timeline-first-line')}>
          {timelineDatasource?.map((item: TimelineItemProps, index: number) => {
            // 内容区偏移
            const align = getAlignByDirection(direction, item.align);

            return (
              <div
                className={cx('TimelineItem-content', {
                  [`TimelineItem-content-align--${align}`]: !!align
                })}
              >
                {isReverseScenario(index, mode === DirectionMode.alternate) ||
                mode === DirectionMode.top ? (
                  <TimelineTimeComponent
                    key={`TimelineItem-${index}`}
                    {...item}
                  />
                ) : (
                  <div className={cx('Timeline-inner-content-wrapper')}>
                    <TimelineContentComponent
                      key={`TimelineItem-${index}`}
                      {...item}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className={cx('Timeline-line')}>
          {timelineDatasource?.map((item: TimelineItemProps, index: number) => (
            <TimelineLineComponent
              key={`TimelineItem-${index}`}
              {...item}
              direction={direction}
            />
          ))}
        </div>
        <div className={cx('Timeline-second-line')}>
          {timelineDatasource?.map((item: TimelineItemProps, index: number) => {
            // 内容区偏移
            const align = getAlignByDirection(direction, item.align);

            return (
              <div
                className={cx('TimelineItem-content', {
                  [`TimelineItem-content-align--${align}`]: !!align
                })}
              >
                {isReverseScenario(index, mode === DirectionMode.alternate) ||
                mode === DirectionMode.top ? (
                  <div className={cx('Timeline-inner-content-wrapper')}>
                    <TimelineContentComponent
                      key={`TimelineItem-${index}`}
                      {...item}
                    />
                  </div>
                ) : (
                  <TimelineTimeComponent
                    key={`TimelineItem-${index}`}
                    {...item}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

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
          direction={direction}
        />
      ))}
    </div>
  );
}

export default themeable(Timeline);

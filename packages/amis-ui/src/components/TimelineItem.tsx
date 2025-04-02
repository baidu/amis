import React, {ReactNode} from 'react';
import {themeable, ThemeProps, localeable, LocaleProps} from 'amis-core';
import {Icon} from './icons';
import type {IconCheckedSchema} from './index';

export type DotSize = 'sm' | 'md' | 'lg' | 'xl';

export interface TimelineItemProps {
  /**
   * 时间点
   */
  time?: string | ReactNode;

  /**
   * 事件名称
   */
  title?: string | ReactNode;

  /**
   * 详细内容
   */
  detail?: string | ReactNode;

  /**
   * 时间点圆圈颜色,可传入英文/颜色值/level样式（info、success、warning、danger）
   */
  color?: string;

  /**
   * 时间点圆圈背景色，默认为空字符串（跟随主题色）
   */
  backgroundColor?: string;

  /**
   * 图标
   */
  icon?: string | IconCheckedSchema | ReactNode;

  /** ICON的CSS类名 */
  iconClassName?: string;
  /**
   * 时间的CSS类名 （优先级高于外层titleClassName）
   */
  timeClassName?: string;
  /**
   * 节点标题的CSS类名（优先级高于外层titleClassName）
   */
  titleClassName?: string;
  /**
   * 节点详情的CSS类名（优先级高于外层detailClassName）
   */
  detailClassName?: string;

  /**
   * 节点大小，可选值为 sm md lg xl，默认为md
   */
  dotSize?: DotSize;

  /**
   * 连线颜色，默认为空字符串（跟随主题色）
   */
  lineColor?: string;

  /**
   * 隐藏当前节点的圆圈
   */
  hideDot?: boolean;

  /**
   * 圆点的对齐方式
   * 水平排列时，可选值为 left center right，默认为center
   * 垂直排列时，可选值为 top bottom center，默认为top
   */
  align?: 'left' | 'center' | 'right' | 'top' | 'bottom';

  /**
   * 卡片展示配置，如果传入则以卡片形式展示，传入对象转为卡片展示，传入的time、title、detail及相关属性将被忽略，只有连线配置和节点圆圈配置生效
   */
  cardNode?: React.JSX.Element;
}

export interface TimelineItem
  extends ThemeProps,
    LocaleProps,
    TimelineItemProps {
  key: string;
}

/**
 * 判断颜色值是否合法
 * @param color 颜色值
 * @returns {boolean} 是否合法
 */
export const isColor = (color?: string): boolean =>
  !!color && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color);

/**
 * 根据连线方向返回对齐方式
 * @param direction 连线方向，'vertical'表示垂直方向，'horizontal'表示水平方向
 * @param align 对齐方式，可选值有'left'、'center'、'right'、'top'、'bottom'
 * @returns 返回对齐方式，默认根据方向设置，若方向和对齐方式不匹配则根据方向调整对齐方式
 */
export const getAlignByDirection = (
  direction: 'vertical' | 'horizontal',
  align?: 'left' | 'center' | 'right' | 'top' | 'bottom'
) => {
  // 检查当前对齐方式和连线方向是否相同，并设置默认对齐方式
  let alignVal = align ? align : direction === 'vertical' ? 'top' : 'center';

  // 这里可以使用css做兼容不用JS检查，但是JS处理可以更清楚
  if (
    (['left', 'right'].includes(alignVal) && direction === 'vertical') ||
    (['top', 'bottom'].includes(alignVal) && direction === 'horizontal')
  ) {
    alignVal = direction === 'vertical' ? 'top' : 'center';
  }

  return alignVal;
};

/**
 * TimelineTime 函数组件，用于展示时间线中的时间节点。
 * @param props 组件的属性
 * @param props.time 时间文本
 * @param props.timeClassName 时间节点的自定义类名
 * @param props.classnames 类名辅助函数，用于动态生成类名字符串
 * @returns 返回包含时间文本的 div 元素
 */
function TimelineTime(props: TimelineItem) {
  const {time, timeClassName, classnames: cx} = props;

  return <div className={cx('TimelineItem-time', timeClassName)}>{time}</div>;
}

/**
 * TimelineContent 函数组件，用于展示时间线中的内容节点，包括标题和详情。
 * @param props 组件的属性
 */
function TimelineContent(props: TimelineItem) {
  const {
    title,
    detail,
    titleClassName,
    classnames: cx,
    detailClassName,
    translate: __,
    cardNode
  } = props;

  return cardNode ? (
    cardNode
  ) : (
    <>
      <div className={cx('TimelineItem-title', titleClassName)}>{title}</div>
      {detail && (
        <div className={cx('TimelineItem-detail')}>
          <div className={cx('TimelineItem-detail-visible', detailClassName)}>
            {detail}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * TImelineLine 函数组件，用于展示时间线中的连线部分。
 * @param props 组件的属性
 */
function TimelineLine(
  props: TimelineItem & {direction: 'vertical' | 'horizontal'}
) {
  const {
    color,
    icon,
    iconClassName,
    classnames: cx,
    translate: __,
    classPrefix,
    dotSize = 'md',
    lineColor,
    backgroundColor,
    align,
    direction
  } = props;

  // 判断是否为颜色值
  const isColorVal = isColor(color);

  // 判断是否为背景颜色值
  const isBgColorVal = isColor(backgroundColor);

  // 取level级颜色
  const levelColor = !isColorVal && color;

  const alignVal = getAlignByDirection(direction, align);

  return (
    <div
      className={cx('TimelineItem-axle', `TimelineItem-size-${dotSize}`, {
        'TimelineItem-hide-dot': !!props.hideDot,
        [`TimelineItem-point-align--${alignVal}`]: !!alignVal
      })}
    >
      <div
        className={cx('TimelineItem-line')}
        style={isColor(lineColor) ? {backgroundColor: lineColor} : undefined}
      ></div>
      {icon ? (
        <div className={cx('TimelineItem-icon', iconClassName)}>
          <Icon
            cx={cx}
            icon={icon}
            className="icon"
            classPrefix={classPrefix}
          />
        </div>
      ) : (
        <div className={cx('TimelineItem-round-wrapper', iconClassName)}>
          <div
            style={
              isBgColorVal ? {backgroundColor: backgroundColor} : undefined
            }
            className={cx('TimelineItem-round', {
              [`TimelineItem-round-background--${levelColor}`]: !!levelColor
            })}
          ></div>
          <div
            style={isColorVal ? {backgroundColor: color} : undefined}
            className={cx('TimelineItem-dot', {
              [`TimelineItem-round--${levelColor}`]: !!levelColor
            })}
          ></div>
        </div>
      )}
    </div>
  );
}

// 纵向时间轴组件。横向时间轴由于需要统一上半部的高度，不能封装到TimelineItem中，所以分别暴露出去调用
export function TimelineItem(props: TimelineItem & {direction: 'vertical'}) {
  const {classnames: cx, key} = props;

  return (
    <div className={cx('TimelineItem')} key={key}>
      <TimelineLine {...props} />
      <div className={cx('TimelineItem-content')}>
        <TimelineTime {...props} />
        <TimelineContent {...props} />
      </div>
    </div>
  );
}

export default themeable(localeable(TimelineItem));

export const TimelineTimeComponent = themeable(localeable(TimelineTime));
export const TimelineLineComponent = themeable(localeable(TimelineLine));
export const TimelineContentComponent = themeable(localeable(TimelineContent));

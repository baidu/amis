import React, { ReactNode, useState } from 'react';
import { localeable, LocaleProps } from '../locale';
import { SchemaExpression } from '../Schema';
import {themeable, ThemeProps} from '../theme';
import {Icon} from './icons';
import {TimelineItemProps} from './Timeline';

export interface TimelineItem extends ThemeProps, LocaleProps {
  timelineItem: TimelineItemProps;
  itemCnt: number,
  index: number;
  mode: 'left' | 'right';
  last: boolean;
}

export function TimelineItem(props: TimelineItem) {
  const {
    timelineItem,
    itemCnt,
    index,
    mode,
    last,
    classnames: cx,
    translate: __,
  } = props;

  const [detailVisible, setDetailVisible] = useState<Array<boolean>>(new Array(itemCnt).fill(false));

  const renderDetail = (index: number, detail: string, detailCollapsedText: string = __('Timeline.collapseText'), detailExpandedText: string = __('Timeline.expandText')) : ReactNode => {
    const handleClick = () => {
      setDetailVisible((prev) => {
        const curList = prev.slice();
        curList[index] = !curList[index];
        return curList;
      });
    }

    return (<>
      <div className={cx('TimelineItem-detail-button')} onClick={handleClick}>
        {detailVisible[index] ? detailExpandedText : detailCollapsedText}
        <div className={cx('TimelineItem-detail-arrow', `${detailVisible[index] && 'TimelineItem-detail-arrow-top'}`)}>
          <Icon icon="tree-down"/>
        </div>
      </div>
      <div className={cx(`${detailVisible[index] ? 'TimelineItem-detail-visible' : 'TimelineItem-detail-invisible'}`)}>
        {detail}
      </div>
    </>);
  }

  // 判断是否为颜色值
  const isColorVal = (color: SchemaExpression | undefined) => {
    return color ? /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color) : false;
  }

  return (
    <div className={cx('TimelineItem', `TimelineItem-${mode}`)} key={index + timelineItem.time}>
      <div className={cx('TimelineItem-axle')}>
        <div className={cx('TimelineItem-line', `${last ? 'last' : ''}`)}></div>
        {timelineItem.icon
          ? <div className={cx('TimelineItem-icon')}><Icon icon={timelineItem.icon} className="icon"/></div>
          : <div
              className={cx('TimelineItem-round',
                      `TimelineItem-round--${!isColorVal(timelineItem.color) && `${timelineItem.color}`}`)}
              style={{backgroundColor: `${isColorVal(timelineItem.color) && `${timelineItem.color}`}`}}
            ></div>
        }
      </div>
      <div className={cx('TimelineItem-content')}>
        <div className={cx('TimelineItem-time')}>{timelineItem.time}</div>
        <div className={cx('TimelineItem-title')}>{timelineItem.title}</div>
        {timelineItem.detail
          && <div className={cx('TimelineItem-detail')}>{renderDetail(index, timelineItem.detail, timelineItem.detailCollapsedText, timelineItem.detailExpandedText)}</div>}
      </div>
    </div>)

}

export default themeable(localeable(TimelineItem));

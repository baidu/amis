import {ViewRange} from '../../sheet/ViewRange';
import {findInViewRangeX} from './findInViewRangeX';
import {findInViewRangeY} from './findInViewRangeY';

/**
 * 在视图范围内查找
 */
export function findInViewRange(
  offsetX: number,
  offsetY: number,
  gridLineHitRange: number,
  viewRange: ViewRange
) {
  return {
    ...findInViewRangeX(offsetX, viewRange, gridLineHitRange),
    ...findInViewRangeY(offsetY, viewRange, gridLineHitRange)
  };
}

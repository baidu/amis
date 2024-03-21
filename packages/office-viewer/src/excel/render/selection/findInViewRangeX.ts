import {ViewRange} from '../../sheet/ViewRange';
import {binarySearchSize} from './binarySearchSize';
import {HitTestResult} from './hitTest';

/**
 * 在视图范围水平方向内查找
 */
export function findInViewRangeX(
  offsetX: number,
  viewRange: ViewRange,
  gridLineHitRange: number,
  // 是否在是 header 区域
  isHeader: boolean = false
) {
  let x = 0;
  let width = 0;
  let colIndex = binarySearchSize(viewRange.colSizes, offsetX);
  let col = -1;
  // 点到线上还是点到单元格上
  let type: HitTestResult['type'] = 'cell';
  if (isHeader) {
    type = 'col-header';
  }

  if (colIndex !== -1) {
    x = viewRange.colSizes[colIndex].offset;
    width = viewRange.colSizes[colIndex].size;
    col = viewRange.cols[colIndex];
    if (isHeader) {
      // 点到了顶部单元格
      if (x + width - offsetX < gridLineHitRange) {
        type = 'col-grid';
      }
      // 点到了左边的线
      if (offsetX - x < gridLineHitRange) {
        type = 'col-grid';
        if (colIndex > 0) {
          x = viewRange.colSizes[colIndex - 1].offset;
          width = viewRange.colSizes[colIndex - 1].size;
          col = viewRange.cols[colIndex - 1];
        }
      }
    }
  }

  return {col, x, width, type};
}

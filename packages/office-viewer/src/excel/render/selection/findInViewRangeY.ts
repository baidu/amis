import {ViewRange} from '../../sheet/ViewRange';
import {binarySearchSize} from './binarySearchSize';
import {HitTestResult} from './hitTest';

/**
 * 在视图范围垂直方向内查找
 */
export function findInViewRangeY(
  offsetY: number,
  viewRange: ViewRange,
  gridLineHitRange: number,
  // 是否在是 header 区域
  isHeader: boolean = false
) {
  let y = 0;
  let height = 0;
  let rowIndex = binarySearchSize(viewRange.rowSizes, offsetY);
  // 点到线上还是点到单元格上
  let type: HitTestResult['type'] = 'cell';
  if (isHeader) {
    type = 'row-header';
  }

  let row = -1;
  if (rowIndex !== -1) {
    y = viewRange.rowSizes[rowIndex].offset;
    height = viewRange.rowSizes[rowIndex].size;
    row = viewRange.rows[rowIndex];
    if (isHeader) {
      if (y + height - offsetY < gridLineHitRange) {
        type = 'row-grid';
      }
      // 点到了上边的线
      if (offsetY - y < gridLineHitRange) {
        type = 'row-grid';
        if (rowIndex > 0) {
          y = viewRange.rowSizes[rowIndex - 1].offset;
          height = viewRange.rowSizes[rowIndex - 1].size;
          row = viewRange.rows[rowIndex - 1];
        }
      }
    }
  }

  return {row, y, height, type};
}

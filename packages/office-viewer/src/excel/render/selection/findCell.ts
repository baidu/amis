import {Region, ViewRange} from '../../sheet/ViewRange';
import {RangeRef} from '../../types/RangeRef';
import {cellToMergeCell} from '../cell/cellToMergeCell';
import {findInViewRange} from './findInViewRange';
import {HitTestResult} from './hitTest';

/**
 * 查找单元格
 */
export function findCell(
  region: Region,
  offsetX: number,
  offsetY: number,
  gridLineHitRange: number,
  viewRange: ViewRange,
  mergeCells: RangeRef[]
): HitTestResult {
  // 节点，也可能返回合并单元格
  const {row, col, x, y, width, height} = findInViewRange(
    offsetX,
    offsetY,
    gridLineHitRange,
    viewRange
  );
  const mergeCell = cellToMergeCell(row, col, mergeCells);
  return {
    type: 'cell',
    region,
    ...mergeCell,
    realCol: col,
    realRow: row,
    x,
    y,
    width,
    height
  };
}

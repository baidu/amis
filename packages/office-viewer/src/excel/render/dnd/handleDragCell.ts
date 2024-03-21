import {objectEqual} from '../../../util/objectEqual';
import {mergeRange} from '../../io/excel/util/Range';
import {RangeRef} from '../../types/RangeRef';
import {cellToMergeCell} from '../cell/cellToMergeCell';
import {dragState} from './handleMousedown';

/**
 * 判断某个单元格是否在合并单元格内，如果在就扩展选区
 */
function mergeWithNewCell(
  range: RangeRef,
  mergeCells: RangeRef[],
  row: number,
  col: number
) {
  const mergeCell = cellToMergeCell(row, col, mergeCells);
  return mergeRange(range, mergeCell);
}

/**
 * 判断边缘是否接触到了合并单元格，如果接触到了就扩展选区
 */
function mergeWithAllBorder(range: RangeRef, mergeCells: RangeRef[]): RangeRef {
  let newRange = {...range};
  // 上边
  for (let i = newRange.startCol; i <= newRange.endCol; i++) {
    newRange = mergeWithNewCell(newRange, mergeCells, newRange.startRow, i);
  }
  // 下边
  for (let i = newRange.startCol; i <= newRange.endCol; i++) {
    newRange = mergeWithNewCell(newRange, mergeCells, newRange.endRow, i);
  }
  // 左边
  for (let i = newRange.startRow; i <= newRange.endRow; i++) {
    newRange = mergeWithNewCell(newRange, mergeCells, i, newRange.startCol);
  }
  // 右边
  for (let i = newRange.startRow; i <= newRange.endRow; i++) {
    newRange = mergeWithNewCell(newRange, mergeCells, i, newRange.endCol);
  }

  // 如果选区变化就需要遍历再执行一次，因为扩展选区后可能又触碰到了另一个合并单元格
  if (!objectEqual(newRange, range)) {
    return mergeWithAllBorder(newRange, mergeCells);
  }
  return newRange;
}

/**
 * 处理拖拽单元格扩展选区
 */
export function handleDragCell(offsetX: number, offsetY: number) {
  // 没有 selection 的情况不大可能，但避免出错
  if (!dragState.selection) {
    console.warn('没有 selection');
    return;
  }

  if (dragState.selection.cellRanges.length === 0) {
    console.warn('没有 cellRanges');
    return;
  }

  // 后续要支持多选得改这里
  const firstCellRange = dragState.selection.cellRanges[0];

  // 如果超出当前单元格，需要做 hitTest，判断是否在其他单元格内
  const hitTestResult = dragState.workbook
    ?.getActiveSheet()
    .hitTest(offsetX, offsetY);

  // 目前只支持在相同类型的单元格内拖拽
  if (hitTestResult && hitTestResult.type === dragState.dragType) {
    const mergeCells =
      dragState.workbook?.getActiveSheet().getMergeCells() || [];

    // 如果在选区范围内
    let newRange = mergeRange(dragState.selection.activeCell, hitTestResult);

    if (mergeCells.length) {
      // 选区扩展过程中可能某个边触碰到另一个合并单元格了，需要遍历四个边来判断
      newRange = mergeWithAllBorder(newRange, mergeCells);
    }

    if (!objectEqual(newRange, firstCellRange)) {
      Object.assign(firstCellRange, newRange);
      dragState.workbook?.uiEvent.emit('CHANGE_SELECTION', dragState.selection);
    }
  }
}

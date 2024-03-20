import {RangeRef} from '../../types/RangeRef';
import {Sheet} from '../Sheet';

export type RelationPosition = {
  // 行类型
  rowType: 'header' | 'odd' | 'even' | 'total';
  colType: 'odd' | 'even';
  rowPosition: 'header' | 'first' | 'last' | 'middle' | 'total';
  colPosition: 'first' | 'last' | 'middle';
};

/**
 * 计算出这个位置相对于表格区域的位置，这个可以缓存的，但先不优化
 */

export function calcTableRelativePosition(
  tableRange: RangeRef,
  isRowHidden: (rowIndex: number) => boolean,
  isColHidden: (colIndex: number) => boolean,
  row: number,
  col: number,
  headerRowCount: number,
  totalsRowCount: number,
  totalsRowShown: boolean
): RelationPosition {
  let rowType: RelationPosition['rowType'] | undefined = undefined;
  let colType: RelationPosition['colType'] | undefined = undefined;
  let rowPosition: RelationPosition['rowPosition'] = 'middle';
  let colPosition: RelationPosition['colPosition'] = 'middle';

  // 总行数
  let rowCount = 0;
  // 当前行在表格中的相对位置，这个是包含表头的
  let relativeRow = 0;

  for (
    let rowIndex = tableRange.startRow;
    rowIndex <= tableRange.endRow;
    rowIndex++
  ) {
    if (!isRowHidden(rowIndex)) {
      rowCount++;
    }
    if (rowIndex === row) {
      relativeRow = rowCount - 1;
    }
  }
  // 当前行在表格中的相对位置，这个是去掉表头的
  let relativeRowWithoutHeader = relativeRow;
  if (headerRowCount > 0) {
    relativeRowWithoutHeader = relativeRowWithoutHeader - headerRowCount;
  }

  if (relativeRowWithoutHeader % 2 === 0) {
    rowType = 'odd';
  } else {
    rowType = 'even';
  }

  if (relativeRowWithoutHeader === 0) {
    rowPosition = 'first';
  }

  if (headerRowCount && relativeRow < headerRowCount) {
    rowPosition = 'header';
    rowType = 'header';
  }

  if (
    relativeRowWithoutHeader ===
    rowCount - headerRowCount - totalsRowCount - 1
  ) {
    rowPosition = 'last';
  }

  if (totalsRowShown) {
    if (
      relativeRowWithoutHeader >=
      rowCount - headerRowCount - totalsRowCount
    ) {
      rowType = 'total';
      rowPosition = 'total';
    }
  }

  // 总列数
  let colCount = 0;
  // 当前列在表格中的相对位置
  let relativeCol = 0;

  for (
    let colIndex = tableRange.startCol;
    colIndex <= tableRange.endCol;
    colIndex++
  ) {
    if (!isColHidden(colIndex)) {
      colCount++;
    }
    if (colIndex === col) {
      relativeCol = colCount - 1;
    }
  }

  if (relativeCol % 2 === 0) {
    colType = 'odd';
  } else {
    colType = 'even';
  }

  if (relativeCol === 0) {
    colPosition = 'first';
  }

  if (relativeCol === colCount - 1) {
    colPosition = 'last';
  }

  if (rowType === undefined) {
    console.warn('calcRelativeType error', row, col, tableRange);
    rowType = 'odd';
  }

  if (colType === undefined) {
    console.warn('calcRelativeType error', row, col, tableRange);
    colType = 'odd';
  }

  return {
    rowType,
    colType,
    rowPosition,
    colPosition
  };
}

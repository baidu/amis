import {RangeRef} from '../../types/RangeRef';
import {CellData} from '../../types/worksheet/CellData';

/**
 * 比较两个单元格的值，目前还有很多类型没有处理，比如富文本
 * @returns 如果 a > b 返回 1，如果 a < b 返回 -1，如果 a === b 返回 0
 */
export function compareCellData(a?: CellData, b?: CellData) {
  if (a === b) {
    return 0;
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
  }

  if (a === undefined) {
    return 1;
  }

  if (b === undefined) {
    return -1;
  }

  if (
    typeof a === 'object' &&
    'value' in a &&
    typeof b === 'object' &&
    'value' in b
  ) {
    const aValue = a.value;
    const bValue = b.value;
    return aValue.localeCompare(bValue, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  }

  return 0;
}

export function sortByRange(
  cellData: CellData[][],
  range: RangeRef,
  sortOrder: 'asc' | 'desc'
) {
  const rows = cellData.slice(range.startRow, range.endRow + 1);

  rows.sort((a, b) => {
    const aVal = a[range.startCol];
    const bVal = b[range.startCol];
    const compareResult = compareCellData(aVal, bVal);

    if (sortOrder === 'asc') {
      return compareResult;
    } else {
      return -compareResult;
    }
  });
  // 似乎不需要
  for (let i = 0; i < rows.length; i++) {
    cellData[i + range.startRow] = rows[i];
  }
}

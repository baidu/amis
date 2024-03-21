/**
 * 获取配置中这一列的排序状态
 */

import {CT_SortState} from '../../../../openxml/ExcelTypes';
import {parseRange} from '../../../io/excel/util/Range';
import {RangeRef} from '../../../types/RangeRef';

export function getColumnSortOrder(
  colIndex: number,
  rangeRef: RangeRef,
  sortState?: CT_SortState
) {
  if (!sortState) {
    return 'none';
  }

  for (const condition of sortState.sortCondition || []) {
    const ref = condition.ref;
    if (!ref) {
      continue;
    }
    const conditionRangeRef = parseRange(ref);
    const {startCol, endCol} = rangeRef;
    if (startCol + colIndex === conditionRangeRef.startCol) {
      return condition.descending ? 'desc' : 'asc';
    }
  }

  return 'none';
}

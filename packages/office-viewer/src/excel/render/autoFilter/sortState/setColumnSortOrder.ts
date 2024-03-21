import {CT_AutoFilter, CT_SortState} from '../../../../openxml/ExcelTypes';
import {parseRange, rangeRefToString} from '../../../io/excel/util/Range';
import {Sheet} from '../../../sheet/Sheet';
import {RangeRef} from '../../../types/RangeRef';
import {ColumnSortOrder} from './ColumnSortOrder';

/**
 * 设置列排序，这里实际上应该是命令，但目前只当成一种状态变化，主要是因为现阶段只支持浏览
 */
export function setColumnSortOrder(
  sheet: Sheet,
  colIndex: number,
  rangeRef: RangeRef,
  autoFilter: CT_AutoFilter,
  sortOrder: 'asc' | 'desc',
  headerRowCount: number
) {
  const sortStateRangeRef = {...rangeRef};
  sortStateRangeRef.startCol += colIndex;
  sortStateRangeRef.endCol += colIndex;

  const sortConditionRef = rangeRefToString(sortStateRangeRef);
  const sortCondition = {
    ref: sortConditionRef,
    descending: sortOrder === 'desc'
  };

  if (!autoFilter.sortState) {
    const sortStateRangeRef = {...rangeRef};

    sortStateRangeRef.startRow += headerRowCount;

    const sortStateRef = rangeRefToString(sortStateRangeRef);

    autoFilter.sortState = {
      ref: sortStateRef,
      sortCondition: [sortCondition]
    };
    sheet.applyAutoFilter(autoFilter, headerRowCount);
    return;
  }

  if (autoFilter.sortState.sortCondition === undefined) {
    autoFilter.sortState.sortCondition = [];
  }

  for (const condition of autoFilter.sortState?.sortCondition || []) {
    const rangeRef = parseRange(condition.ref || '');
    if (sortStateRangeRef.startCol === rangeRef.startCol) {
      // 统一一下 endRow
      rangeRef.endRow = sortStateRangeRef.endRow;
      condition.descending = sortOrder === 'desc';
      sheet.applyAutoFilter(autoFilter, headerRowCount);
      return;
    }
  }

  autoFilter.sortState.sortCondition.push(sortCondition);
  sheet.applyAutoFilter(autoFilter, headerRowCount);
}

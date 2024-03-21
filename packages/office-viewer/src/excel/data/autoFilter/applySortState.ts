import {CT_AutoFilter} from '../../../openxml/ExcelTypes';
import {parseRange} from '../../io/excel/util/Range';
import {IDataProvider} from '../../types/IDataProvider';
import {ISheet} from '../../types/ISheet';
import {IWorkbook} from '../../types/IWorkbook';

/**
 * 应用排序状态
 */

export function applySortState(
  sheetIndex: number,
  dataProvider: IDataProvider,
  autoFilter: CT_AutoFilter,
  headerRowCount: number = 1
) {
  const sortState = autoFilter.sortState;
  if (!sortState) {
    return;
  }
  for (const sortCondition of sortState.sortCondition || []) {
    const ref = sortCondition.ref;
    if (!ref) {
      continue;
    }
    const rangeRef = parseRange(ref);
    rangeRef.startRow += headerRowCount;
    const sortOrder = sortCondition.descending ? 'desc' : 'asc';
    dataProvider.sortColumn(sheetIndex, rangeRef, sortOrder);
  }
}

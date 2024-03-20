import {CT_AutoFilter} from '../../../../openxml/ExcelTypes';

/**
 * 判断是否有任意列过滤条件
 */
export function hasFilterColumn(autoFilter: CT_AutoFilter, colIndex: number) {
  const filterColumn = autoFilter.filterColumn;
  if (!filterColumn) {
    return false;
  }

  for (const column of filterColumn) {
    if (column.colId !== colIndex) {
      continue;
    }
    if (column.filters && column.filters?.filter?.length) {
      return true;
    }
    if (column.customFilters && column.customFilters?.customFilter?.length) {
      return true;
    }
  }

  return false;
}

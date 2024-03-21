import {CT_AutoFilter, CT_CustomFilters} from '../../../../openxml/ExcelTypes';

/**
 * 设置自定义过滤条件
 */
export function setCustomFilters(
  autoFilter: CT_AutoFilter,
  colIndex: number,
  customFilters: CT_CustomFilters
) {
  const filterColumn = autoFilter.filterColumn?.find(
    column => column.colId === colIndex
  );

  if (filterColumn) {
    filterColumn.customFilters = customFilters;
  } else {
    autoFilter.filterColumn = autoFilter.filterColumn || [];
    autoFilter.filterColumn.push({
      colId: colIndex,
      customFilters
    });
  }
}

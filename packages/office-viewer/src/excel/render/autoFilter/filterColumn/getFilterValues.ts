import {CT_AutoFilter} from '../../../../openxml/ExcelTypes';

/**
 * 获取配置中的过滤值，目前子支持 val 的情况
 */
export function getFilterValues(autoFilter: CT_AutoFilter, colIndex: number) {
  const filterValues: Set<string> = new Set();

  const filterColumn = autoFilter.filterColumn?.find(
    column => column.colId === colIndex
  );

  if (filterColumn) {
    for (const filter of filterColumn.filters?.filter || []) {
      if (filter.val) {
        filterValues.add(filter.val);
      }
    }
  }

  return filterValues;
}

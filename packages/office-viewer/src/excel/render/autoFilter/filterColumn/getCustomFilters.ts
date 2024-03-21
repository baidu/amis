import {CT_AutoFilter} from '../../../../openxml/ExcelTypes';

export function getCustomFilters(autoFilter: CT_AutoFilter, colIndex: number) {
  const filterColumn = autoFilter.filterColumn?.find(
    column => column.colId === colIndex
  );

  if (filterColumn) {
    return filterColumn.customFilters;
  }

  return null;
}

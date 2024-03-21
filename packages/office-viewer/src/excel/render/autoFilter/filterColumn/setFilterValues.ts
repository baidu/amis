import {CT_AutoFilter} from '../../../../openxml/ExcelTypes';
import {CheckBoxOption} from '../../ui/CheckBox';

/**
 * 获取配置中的过滤值，目前子支持 val 的情况
 */
export function setFilterValues(
  autoFilter: CT_AutoFilter,
  colIndex: number,
  options: CheckBoxOption[]
) {
  const allChecked = options.every(option => option.checked);

  const filterColumn = autoFilter.filterColumn?.find(
    column => column.colId === colIndex
  );
  const filters = [];
  for (const option of options) {
    if (option.checked) {
      filters.push({val: option.value});
    }
  }

  if (filterColumn) {
    if (allChecked) {
      filterColumn.filters = undefined;
      return;
    }
    filterColumn.filters = {filter: filters};
  } else {
    if (!allChecked) {
      autoFilter.filterColumn = autoFilter.filterColumn || [];
      autoFilter.filterColumn.push({
        colId: colIndex,
        filters: {filter: filters}
      });
    }
  }
}

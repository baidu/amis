import {CT_CustomFilters} from '../../../openxml/ExcelTypes';
import {CellValueNum} from './CellValueNum';
import {evalCustomFilter} from './evalCustomFilter';

/**
 * 自定义筛选
 */
export function customFilter(
  values: CellValueNum[],
  customFilters?: CT_CustomFilters
) {
  if (!customFilters) {
    return new Set<number>();
  }
  const hiddenRows = new Set<number>();
  const showRows = new Set<number>();
  const and = customFilters.and;
  const filters = customFilters.customFilter || [];

  for (const cellValue of values) {
    for (const filter of filters) {
      const operator = filter.operator;
      const val = filter.val;
      if (val === undefined) {
        continue;
      }

      const evalResult = evalCustomFilter(operator, val, cellValue);

      // 在并的场景下，只要有个条件不匹配就隐藏
      if (and) {
        if (!evalResult) {
          hiddenRows.add(cellValue.row);
          break;
        }
      } else {
        // 在或的场景下，只要有个条件匹配就显示
        hiddenRows.add(cellValue.row);
        if (evalResult) {
          showRows.add(cellValue.row);
        }
      }
    }
  }

  if (!and) {
    for (const row of showRows) {
      hiddenRows.delete(row);
    }
  }

  return hiddenRows;
}

import {CT_Filters} from '../../../openxml/ExcelTypes';
import {fromExcelDate} from '../../io/excel/util/fromExcelDate';
import {CellValueNum} from './CellValueNum';
import {DateGroupItem, inDateGroupItems} from './inDateGroupItems';

export function filters(
  values: CellValueNum[],
  filters?: CT_Filters,
  is1904: boolean = false
) {
  const hiddenRows = new Set<number>();
  if (!filters) {
    return hiddenRows;
  }

  const filter = filters.filter || [];
  const filterValues = new Set(filter.map(f => f.val));

  const dateGroupItem = filters.dateGroupItem || [];

  const dateGroupItemDates = dateGroupItem
    .map(item => {
      const dateTimeGrouping = item.dateTimeGrouping;
      const year = item.year || 2024;
      const month = item.month || 1;
      const day = item.day || 1;
      const hour = item.hour || 0;
      const minute = item.minute || 0;
      const second = item.second || 0;

      const date = new Date(
        Date.UTC(year, month - 1, day, hour, minute, second)
      );
      return {
        date,
        dateTimeGrouping
      };
    })
    .filter(Boolean) as DateGroupItem[];

  for (const cellValue of values) {
    // 不在筛选范围内就隐藏
    if (filterValues.size > 0 && !filterValues.has(cellValue.value)) {
      hiddenRows.add(cellValue.row);
    }

    if (dateGroupItemDates.length > 0) {
      if (
        !inDateGroupItems(
          dateGroupItemDates,
          fromExcelDate(cellValue.value, is1904)
        )
      ) {
        hiddenRows.add(cellValue.row);
      }
    }
  }

  return hiddenRows;
}

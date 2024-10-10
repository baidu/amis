import {CT_AutoFilter, CT_Row} from '../../openxml/ExcelTypes';
import {parseRange} from '../io/excel/util/Range';
import {IDataProvider} from '../types/IDataProvider';
import {ISheet} from '../types/ISheet';
import {customFilter} from './autoFilter/customFilter';
import {filters} from './autoFilter/filters';
import {IWorkbook} from '../types/IWorkbook';
import {applySortState} from './autoFilter/applySortState';
import {toNumber} from './toNumber';

/**
 * 应用 autoFilter，将相关行隐藏
 *
 * @headerRowCount 表头行数，需要忽略这些行
 */
export function applyAutoFilter(
  sheetIndex: number,
  workbook: IWorkbook,
  sheet: ISheet,
  dataProvider: IDataProvider,
  autoFilter: CT_AutoFilter,
  headerRowCount: number = 1
) {
  const {ref} = autoFilter;
  if (!ref) {
    console.warn('缺少 ref 字段', autoFilter);
    return;
  }

  const rangeRef = parseRange(ref);

  rangeRef.startRow += headerRowCount;

  // 排序需要先应用
  applySortState(sheetIndex, dataProvider, autoFilter, headerRowCount);

  // 首先将行的隐藏状态重置
  for (let r = rangeRef.startRow; r <= rangeRef.endRow; r++) {
    if (sheet.worksheet?.rows[r]) {
      sheet.worksheet.rows[r].hidden = false;
    }
  }

  const is1904 = workbook.workbookPr?.date1904 ?? false;

  let hiddenRows = new Set<number>();

  for (const filterColumn of autoFilter.filterColumn || []) {
    const colId = filterColumn.colId || 0;
    const cellValues = dataProvider.getCellValueByRange(
      sheetIndex,
      {
        startRow: rangeRef.startRow,
        startCol: rangeRef.startCol + colId,
        endRow: rangeRef.endRow,
        endCol: rangeRef.startCol + colId
      },
      true
    );

    const cellValuesBigNumber = cellValues.map(cellValue => {
      let num;
      try {
        num = toNumber(cellValue.value);
      } catch (e) {
        console.error('toNumber error', cellValue.value);
        num = 0;
      }
      return {row: cellValue.row, num, value: cellValue.value + ''};
    });

    const customFiltersHiddenRows = customFilter(
      cellValuesBigNumber,
      filterColumn.customFilters
    );

    hiddenRows = new Set([...hiddenRows, ...customFiltersHiddenRows]);

    const filtersHiddenRows = filters(
      cellValuesBigNumber,
      filterColumn.filters,
      is1904
    );

    hiddenRows = new Set([...hiddenRows, ...filtersHiddenRows]);
  }

  for (const row of hiddenRows) {
    if (!sheet.worksheet!.rows[row]) {
      sheet.worksheet!.rows[row] = {
        hidden: true
      };
    } else {
      sheet.worksheet!.rows[row].hidden = true;
    }
  }
}

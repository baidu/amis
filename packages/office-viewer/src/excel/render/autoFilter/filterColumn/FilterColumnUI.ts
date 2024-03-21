import {CT_AutoFilter} from '../../../../openxml/ExcelTypes';
import {Sheet} from '../../../sheet/Sheet';
import {RangeRef} from '../../../types/RangeRef';
import {Divider} from '../../ui/Divider';
import type {AutoFilterIconUI} from '../AutoFilterIconUI';
import {CustomFiltersUI} from './CustomFiltersUI';
import {FiltersUI} from './FiltersUI';

/**
 * 对应 filterColumn 配置项
 */
export class FilterColumnUI {
  constructor(
    autoFilterIcon: AutoFilterIconUI,
    container: HTMLElement,
    sheet: Sheet,
    autoFilter: CT_AutoFilter,
    rangeRef: RangeRef,
    colIndex: number,
    headerRowCount: number
  ) {
    const columnDataRange = {...rangeRef};
    columnDataRange.startRow += headerRowCount;

    columnDataRange.startCol += colIndex;
    columnDataRange.endCol = columnDataRange.startCol;

    const values = sheet.getCellValueByRange(columnDataRange, true);

    const uniqueTexts: Set<string> = new Set();

    let isDate = false;

    for (const value of values) {
      if (value === null || value === undefined || value.text === '') {
        continue;
      }
      if (value.isDate) {
        isDate = true;
      }
      uniqueTexts.add(value.text);
    }

    const texts = Array.from(uniqueTexts).sort();

    new Divider(container);

    const customFilters = new CustomFiltersUI(
      autoFilterIcon,
      container,
      sheet,
      autoFilter,
      colIndex,
      headerRowCount,
      texts,
      isDate
    );

    new Divider(container);

    const filters = new FiltersUI(
      autoFilterIcon,
      container,
      sheet,
      autoFilter,
      colIndex,
      headerRowCount,
      texts
    );
  }
}

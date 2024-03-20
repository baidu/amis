import {Sheet} from '../../sheet/Sheet';
import {ViewRange} from '../../sheet/ViewRange';
import {renderAutoFilterIcon} from './renderAutoFilterIcon';

let tableId = 0;

export function renderAutoFilter(
  currentSheet: Sheet,
  dataContainer: HTMLElement
) {
  const autoFilter = currentSheet.getAutoFilter();

  if (autoFilter) {
    // sheet 级别的 autoFilter
    renderAutoFilterIcon(
      currentSheet,
      autoFilter,
      'sheetAutoFilter',
      dataContainer
    );
  }

  // 表格级别的 autoFilter
  const tables = currentSheet.getTables();
  for (const table of tables) {
    if (table.autoFilter) {
      renderAutoFilterIcon(
        currentSheet,
        table.autoFilter,
        `table-${tableId++}`,
        dataContainer
      );
    }
  }
}

import {CT_AutoFilter} from '../../../../openxml/ExcelTypes';
import {H} from '../../../../util/H';
import {Sheet} from '../../../sheet/Sheet';
import {RangeRef} from '../../../types/RangeRef';
import {Icons} from '../../Icons';
import type {AutoFilterIconUI} from '../AutoFilterIconUI';
import {SortButtonUI} from './SortButtonUI';
import {getColumnSortOrder} from './getColumnSortOrder';
import {setColumnSortOrder} from './setColumnSortOrder';

/**
 * 排序相关的操作
 */
export class SortStateUI {
  sortContainer: HTMLElement;

  sortAscButton: SortButtonUI;

  sortDescButton: SortButtonUI;

  autoFilter: CT_AutoFilter;

  rangeRef: RangeRef;

  colIndex: number;

  headerRowCount: number;

  sheet: Sheet;

  autoFilterIcon: AutoFilterIconUI;

  constructor(
    autoFilterIcon: AutoFilterIconUI,
    container: HTMLElement,
    sheet: Sheet,
    autoFilter: CT_AutoFilter,
    rangeRef: RangeRef,
    colIndex: number,
    headerRowCount: number = 1
  ) {
    this.autoFilterIcon = autoFilterIcon;
    this.rangeRef = rangeRef;
    const sortContainer = H('div', {
      className: 'excel-auto-filter__menu-sort',
      parent: container
    });
    this.sortContainer = sortContainer;
    this.colIndex = colIndex;
    this.autoFilter = autoFilter;
    this.headerRowCount = headerRowCount;
    this.sheet = sheet;

    const sortAscButton = new SortButtonUI(
      sortContainer,
      sheet.translate('autoFilter.sortAscending'),
      checked => {
        this.clickButton('asc');
      },
      false,
      Icons.sortUP
    );

    this.sortAscButton = sortAscButton;

    const sortDescButton = new SortButtonUI(
      sortContainer,
      sheet.translate('autoFilter.sortDescending'),
      checked => {
        this.clickButton('desc');
      },
      false,
      Icons.sortDown
    );

    this.sortDescButton = sortDescButton;

    this.syncButtonActive();
  }

  clickButton(sortState: 'asc' | 'desc') {
    const sheet = this.sheet;
    const colIndex = this.colIndex;
    const rangeRef = this.rangeRef;
    const autoFilter = this.autoFilter;
    const headerRowCount = this.headerRowCount;
    setColumnSortOrder(
      sheet,
      colIndex,
      rangeRef,
      autoFilter,
      sortState,
      headerRowCount
    );

    this.sheet
      .getWorkbook()
      .uiEvent.emit('APPLY_AUTO_FILTER', this.sheet.getIndex());

    this.syncButtonActive();
    this.autoFilterIcon.syncFilterIcon();
  }

  syncButtonActive() {
    const colIndex = this.colIndex;
    const rangeRef = this.rangeRef;
    const autoFilter = this.autoFilter;
    const columnSortState = getColumnSortOrder(
      colIndex,
      rangeRef,
      autoFilter.sortState
    );

    if (columnSortState === 'asc') {
      this.sortAscButton.setActive(true);
      this.sortDescButton.setActive(false);
    } else if (columnSortState === 'desc') {
      this.sortAscButton.setActive(false);
      this.sortDescButton.setActive(true);
    }
  }
}

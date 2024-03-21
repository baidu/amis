import {CT_AutoFilter} from '../../../openxml/ExcelTypes';
import {H} from '../../../util/H';
import {Sheet} from '../../sheet/Sheet';
import {RangeRef} from '../../types/RangeRef';
import {FilterColumnUI} from './filterColumn/FilterColumnUI';
import {SortStateUI} from './sortState/SortStateUI';
import type {AutoFilterIconUI} from './AutoFilterIconUI';

export class AutoFilterMenuUI {
  menuContainer: HTMLElement;

  sheet: Sheet;

  autoFilter: CT_AutoFilter;

  colIndex: number;

  constructor(
    autoFilterIcon: AutoFilterIconUI,
    container: HTMLElement,
    sheet: Sheet,
    autoFilter: CT_AutoFilter,
    rangeRef: RangeRef,
    colIndex: number,
    headerRowCount: number = 1
  ) {
    const menuContainer = H('div', {
      className: 'ov-excel-auto-filter-menu',
      parent: container
    });
    this.menuContainer = menuContainer;

    const autoFilterMenuSort = new SortStateUI(
      autoFilterIcon,
      menuContainer,
      sheet,
      autoFilter,
      rangeRef,
      colIndex,
      headerRowCount
    );

    const autoFilterMenuFilterColumn = new FilterColumnUI(
      autoFilterIcon,
      menuContainer,
      sheet,
      autoFilter,
      rangeRef,
      colIndex,
      headerRowCount
    );

    this.autoFilter = autoFilter;
    this.colIndex = colIndex;
    this.sheet = sheet;

    menuContainer.addEventListener('mousedown', e => {
      e.stopPropagation();
    });

    menuContainer.addEventListener('wheel', e => {
      e.stopPropagation();
    });
  }

  hide() {
    this.menuContainer.style.display = 'none';
  }

  show() {
    this.menuContainer.style.display = 'flex';
  }
}

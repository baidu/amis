import {CT_AutoFilter} from '../../../openxml/ExcelTypes';
import {H} from '../../../util/H';
import {onClickOutside} from '../../../util/onClickOutside';
import {Sheet} from '../../sheet/Sheet';
import {RangeRef} from '../../types/RangeRef';
import {Icons} from '../Icons';
import {AutoFilterMenuUI} from './AutoFilterMenuUI';
import {hasFilterColumn} from './filterColumn/hasFilterColumn';
import {getColumnSortOrder} from './sortState/getColumnSortOrder';

export class AutoFilterIconUI {
  /**
   * 过滤图标容器
   */
  filterIconContainer: HTMLElement;

  /**
   * 过滤图标
   */
  filterIcon: HTMLElement;

  /**
   * 过滤界面
   */
  filterMenu: AutoFilterMenuUI;

  sheet: Sheet;

  rangeRef: RangeRef;

  colIndex: number;

  autoFilter: CT_AutoFilter;

  removeClickOutsideEvent: () => void;

  constructor(
    sheet: Sheet,
    dataContainer: HTMLElement,
    autoFilter: CT_AutoFilter,
    rangeRef: RangeRef,
    colIndex: number,
    fid: string,
    headerRowCount: number = 1
  ) {
    this.sheet = sheet;
    this.rangeRef = rangeRef;
    this.colIndex = colIndex;
    this.autoFilter = autoFilter;
    const filterIconContainer = H('div', {
      className: 'ov-excel-auto-filter-icon-container',
      parent: dataContainer
    });
    filterIconContainer.dataset.fid = fid;
    this.filterIconContainer = filterIconContainer;
    // 默认隐藏
    filterIconContainer.style.display = 'none';

    const filterIcon = H('div', {
      className: 'ov-excel-auto-filter-icon',
      parent: filterIconContainer
    });
    filterIcon.innerHTML = this.getFilterIcon();
    this.filterIcon = filterIcon;

    this.filterMenu = new AutoFilterMenuUI(
      this,
      filterIconContainer,
      sheet,
      autoFilter,
      rangeRef,
      colIndex,
      headerRowCount
    );

    filterIcon.addEventListener('click', this.handleClick.bind(this));
    this.removeClickOutsideEvent = onClickOutside(filterIconContainer, () => {
      this.hideMenu();
    });
  }

  /**
   * 更新过滤图标
   */
  syncFilterIcon() {
    this.filterIcon.innerHTML = this.getFilterIcon();
  }

  getFilterIcon() {
    const columnSortState = getColumnSortOrder(
      this.colIndex,
      this.rangeRef,
      this.autoFilter.sortState
    );
    let filterIconSrc = Icons.filter;

    const filterColumn = hasFilterColumn(this.autoFilter, this.colIndex);

    if (filterColumn) {
      filterIconSrc = Icons.hasFilter;
    }

    if (columnSortState === 'asc') {
      filterIconSrc = Icons.filterUp;
    } else if (columnSortState === 'desc') {
      filterIconSrc = Icons.filterDown;
    }
    return filterIconSrc;
  }

  updatePosition(x: number, y: number, height: number, width: number) {
    this.filterIconContainer.style.display = 'block';
    this.filterIconContainer.style.left = `${x}px`;
    this.filterIconContainer.style.top = `${y}px`;
    this.filterIconContainer.style.width = `${width}px`;
    this.filterIconContainer.style.height = `${height}px`;

    this.filterIcon.style.width = `${height - 4}px`;
  }

  handleClick() {
    const lastAutoFilter = this.sheet.getLastAutoFilterIcon();
    if (lastAutoFilter) {
      lastAutoFilter.hideMenu();
    }
    this.sheet.setLastAutoFilterIcon(this);
    this.showMenu();
  }

  showMenu() {
    this.filterMenu.show();
  }

  hideMenu() {
    this.filterMenu.hide();
  }

  hide() {
    this.filterIconContainer.style.display = 'none';
  }

  destroy() {
    this.filterIconContainer.remove();
    this.removeClickOutsideEvent();
  }
}

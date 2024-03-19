import {H} from '../../../util/H';
import {Color} from '../../../util/color';
import {onClickOutside} from '../../../util/onClickOutside';
import {Workbook} from '../../Workbook';
import {ExcelRenderOptions} from '../../sheet/ExcelRenderOptions';
import {Icons} from '../Icons';

const activeTabClass = 'ov-excel-sheet-tab-bar__list-tab--active';

const iconEnableClass = 'ov-excel-sheet-tab-bar__nav-icon--enabled';

const menuListActiveClass = 'ov-excel-sheet-tab-bar__menu-list-item--active';

/**
 * Sheet 列表
 */
export class SheetList {
  sheetTabs: HTMLElement[] = [];

  sheetMenuItems: HTMLElement[] = [];

  workbook: Workbook;

  sheetMenu: HTMLElement;

  sheetListContainer: HTMLElement;

  sheetList: HTMLElement;

  // 水平滚动距离
  scrollLeft = 0;

  // sheet 内容总长度，由于宽度 list 宽度设置为 0 导致这里需要重新计算
  sheetListWidth = 0;

  leftNav: HTMLElement;

  rightNav: HTMLElement;

  constructor(
    container: HTMLElement,
    workbook: Workbook,
    renderOptions: ExcelRenderOptions
  ) {
    this.workbook = workbook;
    this.initDOM(container);

    workbook.uiEvent.on('SWITCH_SHEET', () => {
      this.updateActiveTab();
    });

    this.updateActiveTab();
  }

  initDOM(container: HTMLElement) {
    this.renderNav(container);
    this.renderSheetMenu(container);
    const sheetListContainer = H('div', {
      className: 'ov-excel-sheet-tab-bar__list-container',
      parent: container
    });

    this.sheetListContainer = sheetListContainer;

    const sheetList = H('div', {
      className: 'ov-excel-sheet-tab-bar__list',
      parent: sheetListContainer
    });
    this.sheetList = sheetList;

    sheetListContainer.addEventListener('wheel', e => {
      this.handleWheel(e);
    });

    this.renderSheets(sheetList, true);
  }

  renderSheetMenu(container: HTMLElement) {
    const sheetMenu = H('div', {
      className: 'ov-excel-sheet-tab-bar__menu',
      parent: container
    });
    this.sheetMenu = sheetMenu;
    this.renderSheetMenuList(sheetMenu);
  }

  renderSheetMenuList(sheetMenu: HTMLElement) {
    this.sheetMenu.innerHTML = '';

    const sheetMenuIcon = H('div', {
      className: 'ov-excel-sheet-tab-bar__menu-icon',
      parent: sheetMenu,
      innerHTML: Icons.menu
    });

    const sheetMenuList = H('div', {
      className: 'ov-excel-sheet-tab-bar__menu-list',
      parent: sheetMenu
    });

    sheetMenu.onclick = () => {
      sheetMenuList.style.display = 'block';
    };

    this.workbook.sheets.forEach(sheet => {
      if (sheet.isHidden()) {
        return;
      }
      const sheetMenuItem = H('div', {
        className: 'ov-excel-sheet-tab-bar__menu-list-item',
        parent: sheetMenuList
      });
      sheetMenuItem.textContent = sheet.getSheetName();
      sheetMenuItem.dataset.sheetIndex = sheet.getIndex().toString();
      sheetMenuItem.addEventListener('click', () => {
        this.workbook.setActiveSheet(sheet.getSheetName());
        this.makeActiveSheetVisible();
      });
      if (sheet.getIndex() === this.workbook.getActiveSheet().getIndex()) {
        sheetMenuItem.classList.add(menuListActiveClass);
      }
      this.sheetMenuItems.push(sheetMenuItem);
    });

    onClickOutside(sheetMenu, () => {
      sheetMenuList.style.display = 'none';
    });
  }

  /**
   * 改变 sheet 水平滚动的左右导航
   */
  renderNav(container: HTMLElement) {
    const sheetNav = H('div', {
      className: 'ov-excel-sheet-tab-bar__nav',
      parent: container
    });
    const holdTime = 100;
    const moveDelta = 20;

    const leftNav = H('div', {
      className: 'ov-excel-sheet-tab-bar__nav-icon',
      parent: sheetNav,
      innerHTML: Icons.left
    });
    this.leftNav = leftNav;

    let leftNavTimer: ReturnType<typeof setInterval>;
    leftNav.addEventListener('mousedown', () => {
      leftNavTimer = setInterval(() => {
        this.updateScrollLeft(moveDelta);
      }, holdTime);
    });
    document.addEventListener('mouseup', () => {
      clearInterval(leftNavTimer);
    });

    const rightNav = H('div', {
      className: 'ov-excel-sheet-tab-bar__nav-icon',
      parent: sheetNav,
      innerHTML: Icons.right
    });

    this.rightNav = rightNav;

    let rightNavTimer: ReturnType<typeof setInterval>;
    rightNav.addEventListener('mousedown', () => {
      rightNavTimer = setInterval(() => {
        this.updateScrollLeft(-moveDelta);
      }, holdTime);
    });
    document.addEventListener('mouseup', () => {
      clearInterval(rightNavTimer);
    });
  }

  syncNavStatus() {
    const containerWidth = this.sheetListContainer.clientWidth;
    const sheetListWidth = this.sheetListWidth;
    if (sheetListWidth < containerWidth) {
      return;
    }

    let {scrollLeft} = this;
    if (scrollLeft < 0) {
      this.leftNav.classList.add(iconEnableClass);
      this.sheetListContainer.classList.add(
        'ov-excel-sheet-tab-bar__list-container--enable-left-nav'
      );
    } else {
      this.sheetListContainer.classList.remove(
        'ov-excel-sheet-tab-bar__list-container--enable-left-nav'
      );
      this.leftNav.classList.remove(iconEnableClass);
    }

    if (scrollLeft > containerWidth - sheetListWidth) {
      this.sheetListContainer.classList.add(
        'ov-excel-sheet-tab-bar__list-container--enable-right-nav'
      );
      this.rightNav.classList.add(iconEnableClass);
    } else {
      this.sheetListContainer.classList.remove(
        'ov-excel-sheet-tab-bar__list-container--enable-right-nav'
      );
      this.rightNav.classList.remove(iconEnableClass);
    }
  }

  /**
   * 支持在 sheet 上使用滚轮
   */
  handleWheel(e: WheelEvent) {
    const {deltaY} = e;
    this.updateScrollLeft(-deltaY);
  }

  updateScrollLeft(delta: number) {
    const containerWidth = this.sheetListContainer.clientWidth;
    const sheetListWidth = this.sheetListWidth;
    if (sheetListWidth < containerWidth) {
      return;
    }

    let {scrollLeft} = this;
    scrollLeft += delta;
    scrollLeft = Math.max(
      Math.min(0, scrollLeft),
      containerWidth - sheetListWidth
    );

    this.scrollLeft = scrollLeft;
    // 目前是用 transform 来实现的，因为 list 的宽度设置为 0 了
    this.sheetList.style.transform = `translateX(${scrollLeft}px)`;

    this.syncNavStatus();
  }

  /**
   * 初始化的时候保证激活的 sheet 可见
   * @param offsetX 当前 sheet 的偏移量
   */
  makeActiveSheetVisible() {
    let offsetX = 0;
    const currentIndex = this.workbook.getActiveSheet().getIndex().toString();
    for (const sheetTab of this.sheetTabs) {
      const marginLeft = parseInt(getComputedStyle(sheetTab).marginLeft);
      const marginRight = parseInt(getComputedStyle(sheetTab).marginRight);
      offsetX += sheetTab.clientWidth + marginLeft + marginRight;
      if (sheetTab.dataset.sheetIndex === currentIndex) {
        break;
      }
    }

    // 需要延迟一下不然 containerWidth 不准确
    setTimeout(() => {
      const containerWidth = this.sheetListContainer.clientWidth;
      this.scrollLeft = Math.min(0, containerWidth - offsetX);
      this.sheetList.style.transform = `translateX(${this.scrollLeft}px)`;
      this.syncNavStatus();
    }, 100);
  }

  /**
   * 渲染 sheet 列表，如果 sheet 有变化可以重新调用这个方法
   * @param sheetList sheet 列表容器
   * @param firstRender 是否是第一次渲染，第一次渲染会调用 makeActiveSheetVisible
   */
  renderSheets(sheetList: HTMLElement, firstRender = false) {
    sheetList.innerHTML = '';
    this.sheetTabs = [];

    let sheetListWidth = 0;
    this.workbook.sheets.forEach(sheet => {
      if (sheet.isHidden()) {
        return;
      }
      const sheetTab = H('div', {
        className: 'ov-excel-sheet-tab-bar__list-tab',
        parent: sheetList
      });

      const tabColor = sheet.getTabColor();
      if (tabColor !== 'none') {
        const color = new Color(tabColor);
        sheetTab.style.backgroundImage = `linear-gradient(${color.toRgba(
          0.1
        )}, ${color.toRgba(0.5)})`;
        sheetTab.style.color = tabColor;
      }
      const name = sheet.getSheetName();
      sheetTab.textContent = name;
      sheetTab.dataset.sheetIndex = sheet.getIndex().toString();
      sheetTab.addEventListener('click', () => {
        this.workbook.setActiveSheet(name);
      });
      this.sheetTabs.push(sheetTab);
      const marginLeft = parseInt(getComputedStyle(sheetTab).marginLeft);
      const marginRight = parseInt(getComputedStyle(sheetTab).marginRight);
      sheetListWidth += sheetTab.clientWidth + marginLeft + marginRight;

      if (sheet.getIndex() === this.workbook.getActiveSheet().getIndex()) {
        sheetTab.classList.add(activeTabClass);
        if (firstRender) {
          this.makeActiveSheetVisible();
        }
      }
    });
    this.sheetListWidth = sheetListWidth;
  }

  updateActiveTab() {
    const currentSheet = this.workbook!.getActiveSheet();
    const sheetIndex = currentSheet.getIndex();
    this.sheetTabs.forEach(tab => {
      const index = parseInt(tab.dataset.sheetIndex!, 10);
      if (index === sheetIndex) {
        tab.classList.add(activeTabClass);
      } else {
        tab.classList.remove(activeTabClass);
      }
    });

    this.sheetMenuItems.forEach(item => {
      const index = parseInt(item.dataset.sheetIndex!, 10);
      if (index === sheetIndex) {
        item.classList.add(menuListActiveClass);
      } else {
        item.classList.remove(menuListActiveClass);
      }
    });
  }
}

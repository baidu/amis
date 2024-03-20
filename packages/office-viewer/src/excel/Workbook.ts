/**
 * 这个类作为主要入口，包含运行时数据及相关操作
 */

import type {ExcelRenderOptions} from './sheet/ExcelRenderOptions';
import {EventEmitter} from '../util/EventEmitter';
import {StyleSheet} from './StyleSheet';
import {ExcelRender} from './render/ExcelRender';
import {Sheet} from './sheet/Sheet';
import {IDataProvider} from './types/IDataProvider';
import {SheetSelection} from './render/selection/SheetSelection';
import {Scroll} from './render/scroll/Scroll';
import {handleKeydown} from './render/keyboard/handleKeydown';
import {handlePaste} from './render/keyboard/handlePaste';
import {FormulaBar} from './render/formulaBar/FormulaBar';
import {SheetTabBar} from './render/sheetTab/SheetTabBar';
import {H} from '../util/H';
import {IWorkbook} from './types/IWorkbook';
import {EnKeys} from './lang/en_US';
import {getTranslate} from './lang/lang';
import {RangeRef} from './types/RangeRef';
import {MAX_COL, MAX_ROW} from './render/Consts';
import {rangeToHTML} from './render/selection/buildHTML/rangeToHTML';
import {printIframe} from '../util/print';
import {renderInIframe} from './print/renderInIframe';

export class Workbook {
  /**
   * 总容器
   */
  container: HTMLElement;

  /**
   * 顶部公式栏容器
   */
  formulaBarContainer?: HTMLElement;

  /**
   * 内容容器，包括表头
   */
  contentContainer?: HTMLElement;

  /**
   * 数据容器，不包括表头
   */
  dataContainer?: HTMLElement;

  /**
   * 底部 sheet 页签容器
   */
  sheetTabBarContainer?: HTMLElement;

  workbookData: IWorkbook;

  /**
   * 数据提供者
   */
  dataProvider: IDataProvider;

  /**
   * 当前工作表
   */
  private currentSheet?: Sheet;

  /**
   * 所有的工作表
   */
  sheets: Sheet[] = [];

  /**
   * 样式表
   */
  styleSheet: StyleSheet;

  /**
   * 渲染配置项
   */
  renderOptions: ExcelRenderOptions;

  /**
   * 公式栏
   */
  formulaBar: FormulaBar;

  /**
   * 渲染实例
   */
  excelRender: ExcelRender;

  /**
   * 底部 sheet 页签
   */
  sheetTabBar: SheetTabBar;

  translator: (key: EnKeys) => string;

  /**
   * UI 交互事件监听，主要是和数据无关的变化
   */
  uiEvent = new EventEmitter<{
    /**
     * 水平滚动
     */
    SCROLL_X: (x: number) => void;

    /**
     * 垂直滚动
     */
    SCROLL_Y: (y: number) => void;

    /**
     * 滚动后触发
     */
    AFTER_SCROLL: (scroll: Scroll) => void;

    /**
     * 切换 sheet
     */
    SWITCH_SHEET: (sheet: Sheet) => void;

    /**
     * 选区变化
     */
    CHANGE_SELECTION: (selection: SheetSelection) => void;

    /**
     * 拖动行网格线过程中
     */
    DRAG_ROW_GRID_LINE: (y: number) => void;

    /**
     * 拖动列网格线过程中
     */
    DRAG_COL_GRID_LINE: (x: number) => void;

    /**
     * 拖动列网格线结束
     */
    DRAG_COL_GRID_LINE_END: (col: number, width: number) => void;

    /**
     * 拖动行网格线结束
     */
    DRAG_ROW_GRID_LINE_END: (row: number, height: number) => void;

    /**
     * 改变缩放等级
     */
    CHANGE_ZOOM_LEVEL: (zoomLevel: number) => void;

    /**
     * 复制选区
     */
    COPY_SELECTION: () => void;

    /**
     * 应用自动过滤
     */
    APPLY_AUTO_FILTER: (sheetIndex: number) => void;

    /**
     * 范围内的数据更新
     */
    UPDATE_RANGE: (sheetIndex: number, rangeRef: RangeRef) => void;

    UPDATE_ROW_HEIGHT: (row: number, height: number) => void;

    UPDATE_COL_WIDTH: (col: number, width: number) => void;
  }>();

  constructor(
    container: HTMLElement,
    workbookData: IWorkbook,
    dataProvider: IDataProvider,
    renderOptions: ExcelRenderOptions,
    sheetName?: string
  ) {
    this.renderOptions = renderOptions;
    this.container = container;
    this.dataProvider = dataProvider;
    dataProvider.getSheets().forEach((sheetData, index) => {
      this.sheets.push(
        new Sheet(index, dataProvider, sheetData, this, renderOptions)
      );
    });

    this.workbookData = workbookData;

    this.initActiveSheet();

    this.initDom(container);

    // 公式栏
    this.formulaBar = new FormulaBar(
      this.formulaBarContainer!,
      this,
      renderOptions
    );

    this.styleSheet = new StyleSheet(dataProvider);
    this.excelRender = new ExcelRender(
      this.contentContainer!,
      this.dataContainer!,
      this,
      dataProvider,
      renderOptions
    );

    // 底部 sheet 切换
    this.sheetTabBar = new SheetTabBar(
      this.sheetTabBarContainer!,
      this,
      renderOptions
    );

    this.handleKeydown = this.handleKeydown.bind(this);
    document.addEventListener('keydown', this.handleKeydown);
    this.handlePaste = this.handlePaste.bind(this);
    document.addEventListener('paste', this.handlePaste);

    this.translator = getTranslate(this.renderOptions.locale);
  }

  initActiveSheet() {
    let activeTabIndex = 0;
    if (this.workbookData.workbookView?.activeTab) {
      activeTabIndex = this.workbookData.workbookView.activeTab;
    }
    this.currentSheet = this.sheets[activeTabIndex];
  }

  /**
   * 初始化 dom 结构，这个要先运行才能保证后面 Canvas 能正确拿到高宽
   */
  initDom(container: HTMLElement) {
    // 清空容器
    container.innerHTML = '';
    container.classList.add('ov-excel');

    if (this.renderOptions.showFormulaBar) {
      this.formulaBarContainer = H('div', {
        className: 'ov-excel-formula-bar',
        parent: container
      });
    }

    this.contentContainer = H('div', {
      className: 'ov-excel-content',
      parent: container
    });

    this.dataContainer = H('div', {
      className: 'ov-excel-data',
      parent: this.contentContainer
    });

    if (this.renderOptions.showSheetTabBar) {
      this.sheetTabBarContainer = H('div', {
        className: 'ov-excel-sheet-tab-bar',
        parent: container
      });
    }
  }

  /**
   * 销毁
   */
  destroy() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown(e: KeyboardEvent) {
    handleKeydown(e, this);
  }

  handlePaste(e: ClipboardEvent) {
    handlePaste(e, this);
  }

  /**
   * 初始渲染
   */
  render() {
    this.excelRender.draw();
  }

  /**
   * 设置当前显示的 sheet
   */
  setActiveSheet(sheetName?: string) {
    if (!sheetName) {
      this.currentSheet = this.sheets[0];
      this.uiEvent.emit('SWITCH_SHEET', this.currentSheet);
    } else {
      for (const sheet of this.sheets) {
        if (sheet.getSheetName() === sheetName && this.currentSheet !== sheet) {
          this.currentSheet = sheet;
          this.uiEvent.emit('SWITCH_SHEET', this.currentSheet);
          break;
        }
      }
      if (!this.currentSheet) {
        console.warn(
          `Workbook 中没有找到 ${sheetName} 对应的 sheet，所以使用第一个 sheet`
        );
      }
    }
  }

  /**
   * 获取当前的 sheet
   */
  getActiveSheet() {
    return this.currentSheet!;
  }

  /**
   * 查找对应的 sheet
   */
  getSheetByName(sheet: string) {
    for (const s of this.sheets) {
      if (s.getSheetName() === sheet) {
        return s;
      }
    }
    return null;
  }

  /**
   * 获取样式表
   */
  getStyleSheet() {
    return this.styleSheet;
  }

  /**
   * 获取可视区域大小
   */
  getViewpointSize() {
    const {width, height} = this.contentContainer!.getBoundingClientRect();
    const currentSheet = this.currentSheet;
    const zoom = currentSheet!.getZoomLevel();
    return {
      width: width / zoom,
      height: height / zoom
    };
  }

  getDataProvider() {
    return this.dataProvider;
  }

  is1904() {
    return this.dataProvider.is1904();
  }

  getContainer() {
    return this.container;
  }

  getDataContainer() {
    return this.dataContainer!;
  }

  updateDataContainerSize(rowHeaderWidth: number, colHeaderHeight: number) {
    this.dataContainer!.style.left = `${rowHeaderWidth}px`;
    this.dataContainer!.style.top = `${colHeaderHeight}px`;
  }

  getWorkbookData() {
    return this.workbookData;
  }

  /**
   * 在 iframe 中打印
   */
  renderInIframe(iframe: HTMLIFrameElement) {
    renderInIframe(iframe, this);
  }
}

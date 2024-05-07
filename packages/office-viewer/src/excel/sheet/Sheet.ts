/**
 * sheet 的相关操作及临时状态
 */

import type {ExcelRenderOptions} from '../sheet/ExcelRenderOptions';
import {CT_AutoFilter, CT_SheetView} from '../../openxml/ExcelTypes';

import type {Workbook} from '../Workbook';

import {IDataProvider} from '../types/IDataProvider';
import {FontSize} from '../types/FontSize';
import {CellInfo} from '../types/CellInfo';

import {ISheet} from '../types/ISheet';
import {RangeRef} from '../types/RangeRef';
import {CellData} from '../types/worksheet/CellData';
import {IndexInfo, getViewRange} from './getViewRange';
import {ViewRange} from './ViewRange';
import {PADDING_SIZE} from '../render/Consts';
import {calcCellDisplaySize, getViewPointData} from './getViewPointData';
import {getFrozenLeftViewPointRange} from '../render/cell/frozen/getFrozenLeftViewPointRange';
import {getFrozenTopLeftViewPointRange} from '../render/cell/frozen/getFrozenTopLeftViewPointRange';
import {getFrozenTopViewPointRange} from '../render/cell/frozen/getFrozenTopViewPointRange';
import {FrozenViewRange} from '../render/cell/frozen/drawFrozen';
import {HitTestResult, hitTest} from '../render/selection/hitTest';
import {SheetSelection} from '../render/selection/SheetSelection';
import {isMergeCell} from '../io/excel/util/Range';
import {Rect, pointInRect} from '../render/Rect';
import {applyConditionalFormat} from './applyConditionalFormat';
import {RangeCache} from './RangeCache';
import {CellValue} from '../types/CellValue';
import {applyTablePartsStyle} from './applyTablePartsStyle';
import {getCellAbsolutePosition} from './getCellAbsolutePosition';
import {getAbsoluteAnchorPosition} from '../render/drawing/getAbsoluteAnchorPosition';
import {getOneCellAnchorPosition} from '../render/drawing/getOneCellAnchorPosition';
import {getTwoCellAnchorPosition} from '../render/drawing/getTwoCellAnchorPosition';
import {AutoFilterIconUI} from '../render/autoFilter/AutoFilterIconUI';
import {EnKeys} from '../lang/en_US';
import {applyAutoFilter} from '../data/applyAutoFilter';

export type DisplayData = {
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
  col: number;
  value: CellData;
  /**
   * 是否需要清空
   */
  needClear: boolean;
};

export class Sheet {
  /**
   * 数据提供者
   */
  dataProvider: IDataProvider;

  /**
   * 当前的 sheet 的索引，根据这个来获取数据
   */
  private sheetIndex: number;

  workbook: Workbook;

  rangeCache = new RangeCache();

  /**
   * 水平滚动条位置
   */
  private scrollLeft = 0;

  /**
   * 垂直滚动条位置
   */
  private scrollTop = 0;

  /**
   * 行高，这里只记录自定义的行高
   */
  customRowHeight: number[] = [];

  /**
   * 列宽，这里只记录自定义的列宽
   */
  customColumnWidth: number[] = [];

  /**
   * 渲染配置项
   */
  renderOptions: ExcelRenderOptions;

  /**
   * 表头的宽度，这个会随着滚动而变化，这里设置个初始值
   */
  rowHeaderWidth: number = 29.34765625;

  /**
   * 表头的高度，这个是固定的，如果不显示
   */
  colHeaderHeight: number = 25;

  /**
   * 缩放比例
   */
  private zoomLevel: number = 1;

  /**
   * 选区
   */
  selection?: SheetSelection;

  sheetData: ISheet;

  private currentSheetView: CT_SheetView;

  /**
   * 内容及冻结区的访问，主要用于判断当前鼠标下是哪个单元格
   */
  private dataViewRange?: ViewRange;
  private frozenViewRange?: FrozenViewRange;

  /**
   * 默认字体大小，用于一些计算
   */
  defaultFontSize: FontSize;

  /**
   * 最新的 AutoFilterIcon 图标实例，主要用于关闭
   */
  private lastAutoFilterIcon?: AutoFilterIconUI;

  constructor(
    sheetIndex: number,
    dataProvider: IDataProvider,
    sheetData: ISheet,
    workbook: Workbook,
    renderOptions: ExcelRenderOptions
  ) {
    this.sheetIndex = sheetIndex;
    this.dataProvider = dataProvider;
    this.sheetData = sheetData;
    this.workbook = workbook;
    this.renderOptions = renderOptions;

    // 设置默认展示方式
    if (sheetData.worksheet?.sheetViews?.length) {
      this.currentSheetView = sheetData.worksheet.sheetViews[0];
    } else {
      // 如果没有就加个默认设置避免报错
      this.currentSheetView = {
        showGridLines: true,
        showRowColHeaders: true
      };
    }

    if (!this.showRowColHeaders()) {
      this.colHeaderHeight = 0;
      this.rowHeaderWidth = 0;
    }

    this.defaultFontSize = dataProvider.getDefaultFontSize();
    // 初始按两个字符宽度来计算
    this.rowHeaderWidth = 2 * this.defaultFontSize.width + 4 * PADDING_SIZE;

    workbook.uiEvent.on(
      'CHANGE_SELECTION',
      this.handleChangeSelection.bind(this)
    );
  }

  handleChangeSelection(selection: SheetSelection) {
    if (selection.sheetIndex === this.sheetIndex) {
      this.selection = selection;
    }
    if (this.lastAutoFilterIcon) {
      this.lastAutoFilterIcon.hideMenu();
    }
  }

  getSheetName() {
    return this.dataProvider.getSheetByIndex(this.sheetIndex)!.name;
  }

  /**
   * 获取当前 sheet 的视图设置
   */
  getCurrentSheetView() {
    return this.currentSheetView;
  }

  getScrollLeft() {
    return this.scrollLeft;
  }

  setScrollLeft(scrollLeft: number) {
    if (Math.round(scrollLeft) !== Math.round(this.scrollLeft)) {
      this.scrollLeft = scrollLeft;
      if (this.scrollLeft < 0) {
        this.scrollLeft = 0;
      }
    }
  }

  updateViewRange(viewRange: ViewRange) {
    this.dataViewRange = viewRange;
  }

  updateFrozenViewRange(viewRange: FrozenViewRange) {
    this.frozenViewRange = viewRange;
  }

  getViewRange() {
    return this.dataViewRange;
  }

  getFrozenViewRange() {
    return this.frozenViewRange;
  }

  /**
   * 增量修改水平滚动条
   */
  deltaScrollLeft(delta: number) {
    this.scrollLeft += delta;
    if (this.scrollLeft < 0) {
      this.scrollLeft = 0;
    }
  }

  getScrollTop() {
    return this.scrollTop;
  }

  setScrollTop(scrollTop: number) {
    if (Math.round(scrollTop) !== Math.round(this.scrollTop)) {
      this.scrollTop = scrollTop;
      if (this.scrollTop < 0) {
        this.scrollTop = 0;
      }
    }
  }

  /**
   * 增量修改垂直滚动条
   */
  deltaScrollTop(delta: number) {
    this.scrollTop += delta;
    if (this.scrollTop < 0) {
      this.scrollTop = 0;
    }
  }

  /**
   * 判断当前坐标下是什么
   * @param offsetX
   * @param offsetY
   * @returns
   */
  hitTest(offsetX: number, offsetY: number): HitTestResult | null {
    const {rowHeaderWidth, colHeaderHeight} = this.getRowColSize();
    const gridLineHitRange = this.renderOptions.gridLineHitRange;
    const hitTestDrawingResult = this.hitTestDrawing(offsetX, offsetY);
    if (hitTestDrawingResult) {
      return hitTestDrawingResult;
    }

    const hitTestResult = hitTest(
      offsetX,
      offsetY,
      rowHeaderWidth,
      colHeaderHeight,
      gridLineHitRange,
      this.dataViewRange,
      this.frozenViewRange,
      this.getMergeCells()
    );

    return hitTestResult;
  }

  /**
   * 判断是否点到图形上
   */
  hitTestDrawing(offsetX: number, offsetY: number): HitTestResult | null {
    const drawing = this.getDrawing();
    const fakeCell = {
      startRow: 0,
      startCol: 0,
      endRow: 0,
      endCol: 0
    };
    if (drawing) {
      for (const absoluteAnchor of drawing.absoluteAnchors) {
        const position = this.absolutePositionToRelativePosition(
          getAbsoluteAnchorPosition(absoluteAnchor)
        );
        if (pointInRect(offsetX, offsetY, position)) {
          return {
            type: 'drawing',
            drawing: absoluteAnchor,
            region: 'normal',
            ...fakeCell,
            ...position
          };
        }
      }

      for (const oneCellAnchor of drawing.oneCellAnchors) {
        const position = getOneCellAnchorPosition(oneCellAnchor, this);
        if (pointInRect(offsetX, offsetY, position)) {
          return {
            type: 'drawing',
            drawing: oneCellAnchor,
            region: 'normal',
            ...fakeCell,
            ...position
          };
        }
      }

      for (const twoCellAnchor of drawing.twoCellAnchors) {
        const position = getTwoCellAnchorPosition(twoCellAnchor, this);
        if (pointInRect(offsetX, offsetY, position)) {
          return {
            type: 'drawing',
            drawing: twoCellAnchor,
            region: 'normal',
            ...fakeCell,
            ...position
          };
        }
      }
    }

    return null;
  }

  /**
   * 将绝对地址转成在视图内的相对地址
   */
  absolutePositionToRelativePosition(absolutePos: Rect) {
    return {
      x: absolutePos.x - this.scrollLeft + this.rowHeaderWidth,
      y: absolutePos.y - this.scrollTop + this.colHeaderHeight,
      width: absolutePos.width,
      height: absolutePos.height
    };
  }

  /**
   * 是否显示网格线，如果没有设置就使用 sheet 里的设置
   */
  showGridLines() {
    if (typeof this.renderOptions.showGridLines === 'undefined') {
      return this.currentSheetView.showGridLines;
    } else {
      return this.renderOptions.showGridLines;
    }
  }

  showRowColHeaders() {
    return (
      this.renderOptions.showRowColHeaders &&
      this.currentSheetView.showRowColHeaders
    );
  }

  /**
   * 滚动时需要动态更新当前表的表头宽度
   */
  updateRowHeaderWidth(viewRange: ViewRange) {
    // 这里的是 padding 的 4 倍
    const lastIndex = viewRange.rows[viewRange.rows.length - 1];
    this.rowHeaderWidth =
      String(lastIndex).length * this.defaultFontSize.width + 4 * PADDING_SIZE;

    this.workbook.updateDataContainerSize(
      this.rowHeaderWidth,
      this.colHeaderHeight
    );
  }

  /**
   * 获取表头的大小
   */
  getRowColSize() {
    if (this.showRowColHeaders()) {
      return {
        rowHeaderWidth: this.rowHeaderWidth,
        colHeaderHeight: this.colHeaderHeight
      };
    } else {
      return {
        rowHeaderWidth: 0,
        colHeaderHeight: 0
      };
    }
  }

  /**
   * 获取范围内的数据
   */
  getCellValueByRange(
    range: RangeRef,
    includeHidden: boolean = false
  ): CellValue[] {
    return this.dataProvider.getCellValueByRange(
      this.sheetIndex,
      range,
      includeHidden
    );
  }

  /**
   * 获取多个范围内的数据
   */
  getCellValueByRanges(
    ranges: RangeRef[],
    includeHidden: boolean = false
  ): CellValue[] {
    const result: CellValue[] = [];
    for (const range of ranges) {
      result.push(...this.getCellValueByRange(range, includeHidden));
    }
    return result;
  }

  /**
   * 返回可视区域的数据及位置信息
   */
  getViewPointData(viewRange: ViewRange): DisplayData[] {
    return getViewPointData(
      (row: number) => {
        return this.dataProvider.getSheetRowData(this.sheetIndex, row);
      },
      () => {
        return this.dataProvider.getMergeCells(this.sheetIndex);
      },
      this.getRowHeight.bind(this),
      this.getColWidth.bind(this),
      viewRange
    );
  }

  getSheetRowData(row: number) {
    return this.dataProvider.getSheetRowData(this.sheetIndex, row);
  }

  getRowHeight(row: number): number {
    return this.dataProvider.getRowHeight(this.sheetIndex, row);
  }

  getColWidth(col: number): number {
    return this.dataProvider.getColWidth(this.sheetIndex, col);
  }

  getTotalWidth(): number {
    return Math.max(
      this.getMaxDrawingHeightAndWidth().width,
      this.dataProvider.getTotalWidth(this.sheetIndex)
    );
  }

  getTotalHeight(): number {
    return Math.max(
      this.getMaxDrawingHeightAndWidth().height,
      this.dataProvider.getTotalHeight(this.sheetIndex)
    );
  }

  /**
   * 获取某个单元格的实际位置信息
   * 如果这个单元格属于某个合并单元格，这里将返回合并单元格的位置信息
   *
   * @param x 单元格的 x 坐标
   * @param y 单元格的 y 坐标
   */
  getCellDisplaySize(row: number, col: number, x: number, y: number) {
    let rowHeight = this.getRowHeight(row);
    let colWidth = this.getColWidth(col);
    const mergeCells = this.getMergeCells();
    for (const mergeCell of mergeCells) {
      const {startRow, endRow, startCol, endCol} = mergeCell;
      if (
        row >= startRow &&
        row <= endRow &&
        col >= startCol &&
        col <= endCol
      ) {
        // 如果是合并单元格，需要计算出总高度和宽度
        let totalHeight = 0;
        for (let i = startRow; i <= endRow; i++) {
          totalHeight += this.getRowHeight(i);
        }
        rowHeight = totalHeight;
        let totalWidth = 0;
        for (let i = startCol; i <= endCol; i++) {
          totalWidth += this.getColWidth(i);
        }
        colWidth = totalWidth;

        // 根据当前单元格 row 的 x 和 y 反选 startRow 和 startCol 的 x 和 y
        for (let i = startRow; i < row; i++) {
          y -= this.getRowHeight(i);
        }
        for (let i = startCol; i < col; i++) {
          x -= this.getColWidth(i);
        }
      }
    }

    return {
      x,
      y,
      height: rowHeight,
      width: colWidth
    };
  }

  /**
   * 获取最大行数
   */
  getMaxRow() {
    return this.dataProvider.getMaxRow(this.sheetIndex);
  }

  /**
   * 获取最大列数
   */
  getMaxCol() {
    return this.dataProvider.getMaxCol(this.sheetIndex);
  }

  private rowPositionCache: IndexInfo[] = [];
  private colPositionCache: IndexInfo[] = [];

  /**
   * 获取可视范围内的数据范围，这个包括没有数据的部分，这个函数的性能很关键
   * @returns 从 0 开始的行和列
   */
  getViewPointRange(width: number, height: number): ViewRange {
    return getViewRange(
      this.scrollLeft,
      this.scrollTop,
      this.rowHeaderWidth,
      this.colHeaderHeight,
      height,
      width,
      (index: number) => this.dataProvider.getRowHeight(this.sheetIndex, index),
      this.rowPositionCache,
      (index: number) => this.dataProvider.getColWidth(this.sheetIndex, index),
      this.colPositionCache,
      this.dataProvider.getColHiddenRange(this.sheetIndex)
    );
  }

  getFrozenTopLeftViewPointRange(xSplit: number, ySplit: number) {
    return getFrozenTopLeftViewPointRange(
      xSplit,
      ySplit,
      this.rowHeaderWidth,
      this.colHeaderHeight,
      (index: number) => this.dataProvider.getRowHeight(this.sheetIndex, index),
      (index: number) => this.dataProvider.getColWidth(this.sheetIndex, index)
    );
  }

  getFrozenTopViewPointRange(ySplit: number, width: number) {
    return getFrozenTopViewPointRange(
      ySplit,
      width,
      this.scrollLeft,
      this.rowHeaderWidth,
      this.colHeaderHeight,
      (index: number) => this.dataProvider.getRowHeight(this.sheetIndex, index),
      (index: number) => this.dataProvider.getColWidth(this.sheetIndex, index),
      this.colPositionCache,
      this.dataProvider.getColHiddenRange(this.sheetIndex)
    );
  }

  getFrozenLeftViewPointRange(xSplit: number, height: number) {
    return getFrozenLeftViewPointRange(
      xSplit,
      height,
      this.scrollTop,
      this.rowHeaderWidth,
      this.colHeaderHeight,
      (index: number) => this.dataProvider.getRowHeight(this.sheetIndex, index),
      (index: number) => this.dataProvider.getColWidth(this.sheetIndex, index),
      this.rowPositionCache
    );
  }

  /**
   * 获取单元格样式及数据
   */
  getCellInfo(row: number, col: number): CellInfo {
    const cellInfo = this.dataProvider.getCellInfo(this.sheetIndex, row, col);
    applyConditionalFormat(this, cellInfo, row, col);
    applyTablePartsStyle(this, cellInfo);
    return cellInfo;
  }

  getCellData(row: number, col: number): CellData | undefined {
    return this.dataProvider.getCellData(this.sheetIndex, row, col);
  }

  getCellValue(row: number, col: number) {
    return this.dataProvider.getCellValue(this.sheetIndex, row, col);
  }

  /**
   * 获取某个单元格在渲染时的位置信息，这个方法可以获取到没在渲染区域内的单元格位置
   */
  getCellPosition(row: number, col: number) {
    const cellAbsolutePosition = getCellAbsolutePosition(
      row,
      col,
      (index: number) => this.dataProvider.getRowHeight(this.sheetIndex, index),
      this.rowPositionCache,
      (index: number) => this.dataProvider.getColWidth(this.sheetIndex, index),
      this.colPositionCache
    );

    return {
      x: cellAbsolutePosition.x - this.scrollLeft + this.rowHeaderWidth,
      y: cellAbsolutePosition.y - this.scrollTop + this.colHeaderHeight,
      width: cellAbsolutePosition.width,
      height: cellAbsolutePosition.height
    };
  }

  getMergeCells() {
    return this.dataProvider.getMergeCells(this.sheetIndex);
  }

  getSelection() {
    return this.selection;
  }

  // 用于缓存最大的 drawing 的高度和宽度
  maxDrawingHeightAndWidthCache: {height: number; width: number} | null = null;
  /**
   * 获取最大 drawing 的高度和宽度，这个主要是为了滚动条计算
   */
  getMaxDrawingHeightAndWidth() {
    if (this.maxDrawingHeightAndWidthCache) {
      return this.maxDrawingHeightAndWidthCache;
    }
    const drawing = this.getDrawing();
    if (drawing) {
      let maxWidth = 0;
      let maxHeight = 0;

      for (const absoluteAnchor of drawing.absoluteAnchors) {
        const size = getAbsoluteAnchorPosition(absoluteAnchor);
        maxWidth = Math.max(maxWidth, size.x + size.width);
        maxHeight = Math.max(maxHeight, size.y + size.height);
      }

      for (const oneCellAnchor of drawing.oneCellAnchors) {
        const size = getOneCellAnchorPosition(oneCellAnchor, this);
        maxWidth = Math.max(maxWidth, size.x + size.width);
        maxHeight = Math.max(maxHeight, size.y + size.height);
      }

      for (const twoCellAnchor of drawing.twoCellAnchors) {
        const size = getTwoCellAnchorPosition(twoCellAnchor, this);
        maxWidth = Math.max(maxWidth, size.x + size.width);
        maxHeight = Math.max(maxHeight, size.y + size.height);
      }

      this.maxDrawingHeightAndWidthCache = {
        height: maxHeight,
        width: maxWidth
      };

      return {
        height: maxHeight,
        width: maxWidth
      };
    }

    return {
      height: 0,
      width: 0
    };
  }

  /**
   * 判断是否是某个合并单元格
   */
  isMergeCell(mergeCell: RangeRef) {
    return isMergeCell(mergeCell, this.getMergeCells());
  }

  getDrawing() {
    return this.dataProvider.getDrawing(this.sheetIndex);
  }

  /**
   * 获取当前 sheet 的显示区域
   */
  getDisplayRect(): Rect {
    const {width, height} = this.workbook.getViewpointSize();
    return {
      x: this.scrollLeft,
      y: this.scrollTop,
      width: width,
      height: height
    };
  }

  /**
   * 获取数据区域的显示区域
   */
  getDataDisplayRect(): Rect {
    const {width, height} = this.workbook.getViewpointSize();
    return {
      x: this.scrollLeft + this.rowHeaderWidth,
      y: this.scrollTop + this.colHeaderHeight,
      width: width - this.rowHeaderWidth,
      height: height - this.colHeaderHeight
    };
  }

  getZoomLevel() {
    return this.zoomLevel;
  }

  setZoomLevel(zoomLevel: number) {
    this.zoomLevel = zoomLevel;
    this.workbook.uiEvent.emit('CHANGE_ZOOM_LEVEL', zoomLevel);
  }

  getIndex() {
    return this.sheetIndex;
  }

  getConditionalFormatting() {
    return this.dataProvider.getConditionalFormatting(this.sheetIndex);
  }

  getRangeCache() {
    return this.rangeCache;
  }

  getWorkbook() {
    return this.workbook;
  }

  getExtLst() {
    return this.sheetData.worksheet?.extLst;
  }

  getSparklineGroups() {
    for (const ext of this.getExtLst()?.ext || []) {
      if (ext['x14:sparklineGroups']) {
        return ext['x14:sparklineGroups']['x14:sparklineGroup'] || [];
      }
    }
    return [];
  }

  isHidden() {
    return this.sheetData.state === 'hidden';
  }

  getTableParts() {
    return this.sheetData.worksheet?.tableParts || [];
  }

  isRowHidden(row: number) {
    return this.dataProvider.isRowHidden(this.sheetIndex, row);
  }

  isColHidden(col: number) {
    return this.dataProvider.isColHidden(this.sheetIndex, col);
  }

  getAutoFilter() {
    return this.sheetData.worksheet?.autoFilter;
  }

  getTables() {
    return this.sheetData.worksheet?.tableParts || [];
  }

  getLastAutoFilterIcon() {
    return this.lastAutoFilterIcon;
  }

  setLastAutoFilterIcon(autoFilterIcon: AutoFilterIconUI) {
    this.lastAutoFilterIcon = autoFilterIcon;
  }

  translate(key: EnKeys) {
    return this.workbook.translator(key);
  }

  /**
   * 同步 AutoFilter，当 AutoFilter 有变化的时候调用
   */
  syncAutoFilter() {}

  /**
   * 应用单个 AutoFilter
   */
  applyAutoFilter(autoFilter: CT_AutoFilter, headerRowCount: number = 1) {
    return applyAutoFilter(
      this.sheetIndex,
      this.workbook.getWorkbookData(),
      this.sheetData,
      this.dataProvider,
      autoFilter,
      headerRowCount
    );
  }

  getSheetPr() {
    return this.sheetData.worksheet?.sheetPr;
  }

  getTabColor() {
    return this.dataProvider.getColor(this.getSheetPr()?.tabColor);
  }

  updateCellValue(row: number, col: number, data: CellData) {
    this.dataProvider.updateCellData(this.sheetIndex, row, col, data);
  }

  /**
   * 修改行高
   * @param row
   * @param height 行高，使用 px
   */
  setRowHeight(row: number, height: number) {
    this.dataProvider.setRowHeight(this.sheetIndex, row, height);
  }

  setColWidth(col: number, width: number) {
    this.dataProvider.setColWidth(this.sheetIndex, col, width);
  }

  clearFontCache() {
    this.dataProvider.clearDefaultFontSizeCache();
  }
}

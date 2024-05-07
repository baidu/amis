/**
 * 本地数据，这个主要用于不远程协作的情况
 */

import {
  CT_Border,
  CT_CellAlignment,
  CT_Color,
  CT_Fill,
  CT_Font
} from '../../openxml/ExcelTypes';
import {pt2px} from '../../util/ptToPx';
import {baseColWidth2px, colWidth2px, px2colWidth} from '../sheet/ColWidth';
import {IDataProvider} from '../types/IDataProvider';
import {FontSize} from '../types/FontSize';
import {FontStyle} from '../types/FontStyle';
import {CellInfo} from '../types/CellInfo';
import {IWorkbook} from '../types/IWorkbook';
import {CellData, FormulaData, hasValue} from '../types/worksheet/CellData';
import defaultFont from './defaultFont';
// @ts-ignore 这个没类型定义
import numfmt from 'numfmt';
import type {ExcelRenderOptions} from '../sheet/ExcelRenderOptions';
import BuiltInNumFmt from '../sheet/BuiltInNumFmt';
import {rgbTint} from '../../util/color';
import {AUTO_COLOR, DEFAULT_FONT_SIZE, MAX_ROW} from '../render/Consts';
import {measureTextWithCache} from '../render/cell/measureTextWithCache';
import {genFontStr} from '../render/cell/genFontStr';
import {IndexedColors} from '../render/IndexedColors';
import {PresetColorMap} from '../../openxml/colorNameMap';
import {HiddenRange} from '../sheet/getViewRange';
import {ISheet} from '../types/ISheet';
import {IDrawing} from '../types/IDrawing';
import {RangeRef} from '../types/RangeRef';
import {CellValue} from '../types/CellValue';
import {applyAutoFilter} from './applyAutoFilter';
import {numfmtExtend} from './numfmtExtend';
import {getThemeColor} from './getThemeColor';
import {sortByRange} from './autoFilter/sortByRange';
import {px2pt} from '../../util/px2pt';

export class LocalDataProvider implements IDataProvider {
  /**
   * 工作簿，包含所有数据定义
   */
  workbook: IWorkbook;

  renderOptions: ExcelRenderOptions;

  /**
   * numfmt 实例，用于提升性能
   */
  numfmtInstances: any[] = [];

  defaultFont: CT_Font;

  defaultFontStyle: FontStyle;

  constructor(workbook: IWorkbook, renderOptions: ExcelRenderOptions) {
    this.workbook = workbook;
    this.renderOptions = renderOptions;
    this.initNumfmt();
    this.defaultFont = this.getDefaultFont();
    this.defaultFontStyle = this.getFontStyle(this.defaultFont);
    this.applyFilter();
  }

  /**
   * 初始化 numfmt 实例
   */
  private initNumfmt() {
    const locale = this.renderOptions.locale;
    BuiltInNumFmt.forEach((numFmt, index) => {
      const instance = numfmt(numFmt, {
        locale
      });
      this.numfmtInstances[index] = instance;
    });
    for (const numFmt of this.workbook.styleSheet?.numFmts?.numFmt || []) {
      let instance;
      try {
        // 不知为啥还有 aaaa 这种写法，在稻壳里比较常见
        instance = numfmt(
          numFmt.formatCode?.replace('aaaa', 'dddd').replace('aaa', 'ddd'),
          {
            locale
          }
        );
      } catch (error) {
        console.warn('numfmt error', error);
        instance = numfmtExtend(numFmt.formatCode);
      }
      const numFmtId = numFmt.numFmtId || 0;
      this.numfmtInstances[numFmtId] = instance;
    }
  }

  /**
   * 应用自动过滤
   */
  applyFilter() {
    for (const [sheetIndex, sheet] of this.workbook.sheets.entries()) {
      // sheet 本身的 autoFilter 配置
      if (sheet.worksheet?.autoFilter) {
        const autoFilter = sheet.worksheet.autoFilter;
        applyAutoFilter(sheetIndex, this.workbook, sheet, this, autoFilter);
      }

      // 应用表格中的自动过滤
      for (const tableParts of sheet.worksheet?.tableParts || []) {
        if (tableParts.autoFilter) {
          const headerRowCount = tableParts.headerRowCount || 1;
          applyAutoFilter(
            sheetIndex,
            this.workbook,
            sheet,
            this,
            tableParts.autoFilter,
            headerRowCount
          );
        }
      }
    }
  }

  getSheets() {
    return this.workbook.sheets;
  }

  /**
   * 获取指定行的数据
   * @param sheetName 表名
   * @param row
   */
  getSheetRowData(sheetIndex: number, row: number): CellData[] {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      const rowData = sheet.worksheet?.cellData[row] || [];
      return rowData;
    }
    return [];
  }

  getCellData(
    sheetIndex: number,
    row: number,
    col: number
  ): CellData | undefined {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      return sheet.worksheet?.cellData[row]?.[col] || undefined;
    }
    return undefined;
  }

  /**
   * 更新单元格数据
   */
  updateCellData(sheetIndex: number, row: number, col: number, data: CellData) {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet && sheet.worksheet) {
      if (!sheet.worksheet.cellData[row]) {
        sheet.worksheet.cellData[row] = [];
      }
      sheet.worksheet.cellData[row][col] = data;
    }
  }

  /**
   * 获取指定行高
   * TODO: 加缓存
   * @param sheetIndex
   * @param rowIndex
   * @returns px 为单位的行高
   */
  getRowHeight(sheetIndex: number, rowIndex: number) {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      const row = sheet.worksheet?.rows[rowIndex];
      if (row?.hidden) {
        return 0;
      }
      let rowHeight = row?.ht;
      if (!rowHeight) {
        rowHeight = sheet.worksheet?.sheetFormatPr?.defaultRowHeight || 16;
      }
      return pt2px(rowHeight);
    }
    return 0;
  }

  setRowHeight(sheetIndex: number, row: number, height: number) {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet && sheet.worksheet) {
      if (!sheet.worksheet?.rows[row]) {
        sheet.worksheet.rows[row] = {};
      }
      sheet.worksheet.rows[row].ht = px2pt(height);
    }
  }

  /**
   * 这个行是否隐藏
   */
  isRowHidden(sheetIndex: number, rowIndex: number) {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      const row = sheet.worksheet?.rows[rowIndex];
      if (row?.hidden) {
        return true;
      }
    }
    return false;
  }

  /**
   * 获取隐藏的列
   * @param sheetIndex
   * @returns
   */
  getColHiddenRange(sheetIndex: number): HiddenRange[] {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      const cols = sheet.worksheet?.cols || [];
      const ranges: HiddenRange[] = [];
      for (const col of cols) {
        if (col && col.hidden) {
          ranges.push({min: col.min || 0, max: col.max || 0});
        }
      }
      return ranges;
    }
    return [];
  }

  /**
   * 这个列是否隐藏
   */
  isColHidden(sheetIndex: number, colIndex: number) {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      const cols = sheet.worksheet?.cols || [];
      for (const col of cols) {
        if (col && col.hidden) {
          if (colIndex >= (col.min || 0) && colIndex <= (col.max || 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * 获取指定列宽，这个一开始就能确定
   * @param sheetIndex
   * @param colIndex
   * @returns px 为单位的列宽
   */
  getColWidth(sheetIndex: number, colIndex: number) {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      const cols = sheet.worksheet?.cols || [];
      for (const [index, col] of cols.entries()) {
        if (!col) {
          continue;
        }
        const min = col.min ?? index;
        const max = col.max ?? index;
        if (colIndex >= min && colIndex <= max) {
          if (col.hidden) {
            return 0;
          }

          const colWidth = col.width;
          if (colWidth) {
            if (colWidth === 0) {
              return 0;
            }
            const defaultFontSize = this.getDefaultFontSize();
            return colWidth2px(colWidth, defaultFontSize.width);
          }

          return this.getDefaultWidth(sheet);
        }
      }
      return this.getDefaultWidth(sheet);
    }
    // 默认必须有个值，不然可能导致死循环
    return 71.73828125;
  }

  setColWidth(sheetIndex: number, col: number, width: number) {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet && sheet.worksheet) {
      if (!sheet.worksheet?.cols[col]) {
        sheet.worksheet.cols[col] = {};
      }
      const defaultFontSize = this.getDefaultFontSize();
      sheet.worksheet.cols[col].width = px2colWidth(
        width,
        defaultFontSize.width
      );
    }
  }

  private getDefaultWidth(sheet: ISheet) {
    let defaultColWidth = sheet.worksheet?.sheetFormatPr?.defaultColWidth;

    if (!defaultColWidth) {
      const defaultFontSize = this.getDefaultFontSize();
      // 虽然 xsd 里的默认值是 8，但用 Excel 生成的默认值是 10，所以用 10 作为默认值
      const baseColWidth = sheet.worksheet?.sheetFormatPr?.baseColWidth || 10;
      return baseColWidth2px(baseColWidth, defaultFontSize.width);
    }

    return defaultColWidth * 8;
  }

  getMaxRow(sheetIndex: number) {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      const cellData = sheet.worksheet?.cellData || [];
      return cellData.length;
    }
    return 0;
  }

  sheetTotalHeightCache: Map<number, number> = new Map();

  /**
   * 获取表的中数据高度，这个可能会返回预估值
   * @param sheetIndex 表索引
   */
  getTotalHeight(sheetIndex: number) {
    if (this.sheetTotalHeightCache.has(sheetIndex)) {
      return this.sheetTotalHeightCache.get(sheetIndex)!;
    }
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      const maxRow = this.getMaxRow(sheetIndex);
      let totalHeight = 0;
      for (let i = 0; i < maxRow; i++) {
        totalHeight += this.getRowHeight(sheetIndex, i);
      }
      this.sheetTotalHeightCache.set(sheetIndex, totalHeight);
      return totalHeight;
    }
    return 0;
  }

  /**
   * 获取最大列数
   */
  getMaxCol(sheetIndex: number) {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      const cellData = sheet.worksheet?.cellData || [];
      let maxCol = 0;
      let index = 0;
      for (const rowData of cellData) {
        maxCol = Math.max(rowData?.length || 0, maxCol);
        index++;
        // 就测试 100 行
        if (index > 100) {
          break;
        }
      }
      return maxCol;
    }
    return 0;
  }

  sheetTotalWidthCache: Map<number, number> = new Map();

  /**
   * 获取表的中数据宽度，这个可能会返回预估值
   * @param sheetIndex 表索引
   */
  getTotalWidth(sheetIndex: number) {
    if (this.sheetTotalWidthCache.has(sheetIndex)) {
      return this.sheetTotalWidthCache.get(sheetIndex)!;
    }
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      const maxCol = this.getMaxCol(sheetIndex);
      let totalWidth = 0;
      for (let i = 0; i < maxCol; i++) {
        totalWidth += this.getColWidth(sheetIndex, i);
      }
      this.sheetTotalWidthCache.set(sheetIndex, totalWidth);
      return totalWidth;
    }
    return 0;
  }

  /**
   * 根据索引获取表
   * @param sheetIndex
   * @returns 对应的表
   */
  getSheetByIndex(sheetIndex: number) {
    return this.workbook.sheets[sheetIndex];
  }

  /**
   *
   * @param sheetName
   * @returns
   */
  getSheetByName(sheetName: string) {
    return this.workbook.sheets.find(sheet => sheet.name === sheetName);
  }

  /**
   * 获取默认字体
   */
  getDefaultFont(): CT_Font {
    return this.workbook.styleSheet?.fonts?.font?.[0] || defaultFont;
  }

  getColor(color?: CT_Color, defaultColor = 'none') {
    if (!color) {
      return defaultColor;
    }
    if (color.rgb) {
      const rgb = color.rgb;
      if (rgb in PresetColorMap) {
        return PresetColorMap[rgb as keyof typeof PresetColorMap];
      }
      if (rgb.length === 8) {
        return '#' + rgb.slice(2);
      }
      // 兼容带 # 的情况
      if (rgb.length === 7 && rgb[0] === '#') {
        return rgb;
      }
      return '#' + color.rgb;
    }
    if (typeof color.theme !== 'undefined') {
      const themeColor = this.getThemeColor(color.theme);
      if (color.tint) {
        return '#' + rgbTint(themeColor, color.tint);
      }
      return '#' + themeColor;
    }
    if (color.auto) {
      return AUTO_COLOR;
    }
    if (typeof color.indexed !== 'undefined') {
      if (IndexedColors[color.indexed]) {
        return '#' + IndexedColors[color.indexed];
      }
    }

    console.warn('unknown color', color);

    return 'none';
  }

  getFontStyle(font?: CT_Font): FontStyle {
    const defaultFont = this.defaultFont;
    const family = font?.name?.val || defaultFont.name?.val || 'Arial';
    const size = font?.sz?.val || defaultFont.sz?.val || DEFAULT_FONT_SIZE;
    const defaultColor = this.getColor(defaultFont.color, '#000000');
    const color = this.getColor(font?.color, defaultColor);
    const b = !!(font?.b || defaultFont.b) || false;
    const i = !!(font?.i || defaultFont.i) || false;
    const u = font?.u?.val || defaultFont.u?.val || 'none';
    const strike = font?.strike?.val || defaultFont.strike?.val || false;
    const outline = font?.outline?.val || defaultFont.outline?.val || false;
    const shadow = font?.shadow?.val || defaultFont.shadow?.val || false;
    const condense = font?.condense?.val || defaultFont.condense?.val || false;

    return {
      family,
      size,
      color,
      b,
      i,
      u,
      strike,
      outline,
      shadow,
      condense
    };
  }

  /**
   * 获取单元格信息
   */
  getCellInfo(sheetIndex: number, row: number, col: number): CellInfo {
    // 获取默认样式
    let font = this.defaultFont;
    const sheet = this.getSheetByIndex(sheetIndex);
    let text = '';
    let cellData: CellData = '';
    let fill: CT_Fill | undefined;
    let border: CT_Border | undefined;
    let alignment: CT_CellAlignment | undefined;
    let value = '';
    if (sheet) {
      const cellValue = this.getCellValueByData(
        sheet.worksheet?.cellData || [],
        row,
        col
      );
      const cell = sheet.worksheet?.cellData[row]?.[col];
      if (cell) {
        text = cellValue.text;
        value = cellValue.value + '';
        cellData = cell;
        if (typeof cell === 'object' && 's' in cell) {
          const cellXfxIndex = cell.s || 0;
          const cellXfx =
            this.workbook?.styleSheet?.cellXfs?.xf?.[cellXfxIndex];
          if (cellXfx) {
            const fontId = cellXfx.fontId || 0;
            const customFont = this.workbook?.styleSheet?.fonts?.font?.[fontId];
            if (customFont) {
              font = customFont;
            }
            // numfmt 带来的颜色
            if (cellValue.color) {
              font.color = {
                rgb: cellValue.color
              };
            }
            const fillId = cellXfx.fillId || 0;
            fill = this.workbook?.styleSheet?.fills?.fill?.[fillId];

            const borderId = cellXfx.borderId || 0;
            border = this.workbook?.styleSheet?.borders?.border?.[borderId];

            alignment = cellXfx.alignment;
          } else {
            console.warn(`没有找到 cellXfxIndex 为 ${cellXfxIndex} 的样式`);
          }
        } else if (typeof cell === 'string') {
          text = cell;
          // 这种情况下默认值会变成 center
          alignment = {
            vertical: 'center'
          };
        }
      }
    }
    return {
      row,
      col,
      font,
      value,
      text,
      fill,
      border,
      cellData,
      alignment
    };
  }

  getCellValue(sheetIndex: number, row: number, col: number): CellValue {
    const sheet = this.getSheetByIndex(sheetIndex);
    let text = '';
    let value = '';
    let color = '';

    if (sheet) {
      return this.getCellValueByData(sheet.worksheet?.cellData || [], row, col);
    }
    return {
      row,
      col,
      color,
      text,
      value
    };
  }

  getCellValueByData(
    cellData: CellData[][],
    row: number,
    col: number
  ): CellValue {
    let text = '';
    let value = '';
    let isDate1904 = this.is1904();
    let color = '';
    let isDate;
    const cell = cellData[row]?.[col];
    if (cell) {
      if (typeof cell === 'object' && 's' in cell) {
        const cellXfxIndex = cell.s || 0;
        const cellXfx = this.workbook?.styleSheet?.cellXfs?.xf?.[cellXfxIndex];
        if (cellXfx) {
          const numFmtId = cellXfx.numFmtId || 0;
          if (numFmtId !== 0) {
            const numFmt = this.numfmtInstances[numFmtId];
            if (numFmt?.pattern === 'General') {
              // 不知道为何有时候会出现这种情况，这时不能做解析
              if (typeof cell === 'string') {
                text = cell;
                value = text;
              } else if (typeof cell === 'object' && 'value' in cell) {
                // 公式等其它情况
                text = cell.value;
                value = text;
              }
            } else {
              if (numFmt && 'value' in cell) {
                const cellValue = parseFloat(cell.value);
                if (isNaN(cellValue)) {
                  value = cell.value;
                  text = cell.value;
                } else {
                  if (numFmt.isDate()) {
                    isDate = true;
                    let dateValue = cellValue;
                    if (isDate1904) {
                      dateValue += 1462;
                    }
                    text = numFmt(dateValue);
                  } else {
                    text = numFmt(cellValue);
                  }

                  if (numFmt.info.color) {
                    color = numFmt.color(cellValue);
                  }
                }
              }
            }
          } else if ('value' in cell) {
            text = cell.value || '';
            value = text;
          }
        } else {
          console.warn(`没有找到 cellXfxIndex 为 ${cellXfxIndex} 的样式`);
        }
      } else if (typeof cell === 'string') {
        text = cell;
        value = text;
      } else if (typeof cell === 'object' && 'value' in cell) {
        // 公式等其它情况
        text = cell.value;
        value = text;
      }
    }
    return {
      row,
      col,
      color,
      text,
      value,
      isDate
    };
  }

  /**
   * 获取范围内的数据
   */
  getCellValueByRange(
    sheetIndex: number,
    range: RangeRef,
    includeHidden: boolean
  ): CellValue[] {
    const result: CellValue[] = [];

    let endRow = range.endRow;
    if (endRow === MAX_ROW) {
      endRow = this.getMaxRow(sheetIndex);
    }
    let endCol = range.endCol;
    if (endCol === MAX_ROW) {
      endCol = this.getMaxCol(sheetIndex);
    }
    for (let row = range.startRow; row <= endRow; row++) {
      if (!includeHidden && this.isRowHidden(sheetIndex, row)) {
        continue;
      }
      for (let col = range.startCol; col <= range.endCol; col++) {
        if (!includeHidden && this.isColHidden(sheetIndex, col)) {
          continue;
        }
        const cellValue = this.getCellValue(sheetIndex, row, col);
        if (hasValue(cellValue.text)) {
          result.push(cellValue);
        }
      }
    }
    return result;
  }

  searchText(sheetIndex: number, text: string): CellValue[] {
    const result: CellValue[] = [];
    const sheet = this.getSheetByIndex(sheetIndex);

    if (sheet) {
      const cellData = sheet.worksheet?.cellData || [];
      cellData.forEach((rowData, rowIndex) => {
        (rowData || []).forEach((cell, colIndex) => {
          const cellValue = this.getCellValue(sheetIndex, rowIndex, colIndex);
          if (cellValue.text.includes(text)) {
            result.push(cellValue);
          }
        });
      });
    }
    return result;
  }

  getThemeColor(themeId: number): string {
    return getThemeColor(themeId, this.workbook);
  }

  defaultFontSize?: FontSize;

  /**
   * 获取默认字体高宽
   * @param ctx
   * @returns
   */
  getDefaultFontSize() {
    if (this.defaultFontSize) {
      return this.defaultFontSize;
    }
    const offscreen = new OffscreenCanvas(256, 256);
    const ctx = offscreen.getContext(
      '2d'
    )! as OffscreenCanvasRenderingContext2D;
    const defaultFont = genFontStr(this.defaultFontStyle);
    ctx.font = defaultFont;
    const size = measureTextWithCache(ctx, defaultFont, '1');
    this.defaultFontSize = size;
    return this.defaultFontSize;
  }

  clearDefaultFontSizeCache() {
    this.defaultFontSize = undefined;
  }

  getDefaultFontStyle(): FontStyle {
    return this.defaultFontStyle;
  }

  getMergeCells(sheetIndex: number) {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      return sheet.worksheet?.mergeCells || [];
    }
    return [];
  }

  getDrawing(sheetIndex: number): IDrawing | null {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      return sheet.worksheet?.drawing || null;
    }
    return null;
  }

  getConditionalFormatting(sheetIndex: number) {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      return sheet.worksheet?.conditionalFormatting || [];
    }
    return [];
  }

  getDxf(index: number) {
    return this.workbook.styleSheet?.dxfs?.dxf?.[index] || null;
  }

  is1904() {
    return this.workbook.workbookPr?.date1904 || false;
  }

  /**
   * 设置行排序
   */
  sortColumn(sheetIndex: number, range: RangeRef, sortOrder: 'asc' | 'desc') {
    const sheet = this.getSheetByIndex(sheetIndex);
    if (sheet) {
      const cellData = sheet.worksheet?.cellData || [];
      sortByRange(cellData, range, sortOrder);
    }
  }
}

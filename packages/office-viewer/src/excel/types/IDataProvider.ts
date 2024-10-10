import {
  CT_Color,
  CT_ConditionalFormatting,
  CT_Dxf,
  CT_Font
} from '../../openxml/ExcelTypes';
import {Rect} from '../render/Rect';
import {HiddenRange} from '../sheet/getViewRange';
import {CellInfo} from './CellInfo';
import {CellValue} from './CellValue';
import {FontSize} from './FontSize';
import {FontStyle} from './FontStyle';
import {IDrawing} from './IDrawing';
import {ISheet} from './ISheet';
import {RangeRef} from './RangeRef';
import {CellData} from './worksheet/CellData';

/**
 * 数据获取方法，所有数据获取都通过这个方法调用
 */
export interface IDataProvider {
  /**
   * 获取指定行的数据
   * @param sheetIndex 表索引，从 0 开始
   * @param row，行索引，从 0 开始
   */
  getSheetRowData(sheetIndex: number, row: number): CellData[];

  /**
   * 获取指定单元格的数据
   * @param sheetIndex
   * @param row
   * @param col
   */
  getCellData(
    sheetIndex: number,
    row: number,
    col: number
  ): CellData | undefined;

  /**
   * 更新单元格信息
   * @param sheetIndex
   * @param row
   * @param col
   * @param data
   */
  updateCellData(
    sheetIndex: number,
    row: number,
    col: number,
    data: CellData
  ): void;

  /**
   * 获取指定行的行高，理论上这里应该用异步
   * @param sheetIndex
   * @param row
   */
  getRowHeight(sheetIndex: number, row: number): number;

  /**
   * 获取指定列宽，这个一开始就能确定
   * @param sheetIndex
   * @param col
   */
  getColWidth(sheetIndex: number, col: number): number;

  /**
   * 获取隐藏的列范围
   */
  getColHiddenRange(sheetIndex: number): HiddenRange[];

  /**
   * 获取最大行数
   */
  getMaxRow(sheetIndex: number): number;

  /**
   * 当前行是否隐藏
   */
  isRowHidden(sheetIndex: number, row: number): boolean;

  /**
   * 当前列是否隐藏
   */
  isColHidden(sheetIndex: number, col: number): boolean;

  /**
   * 获取表的中数据高度，这个可能会返回预估值
   * @param sheetIndex 表索引
   */
  getTotalHeight(sheetIndex: number): number;

  /**
   * 获取最大列数
   */
  getMaxCol(sheetIndex: number): number;

  /**
   * 获取表的中数据宽度，这个可能会返回预估值
   * @param sheetIndex 表索引
   */
  getTotalWidth(sheetIndex: number): number;

  /**
   * 获取所有表
   */
  getSheets(): ISheet[];

  /**
   * 根据索引获取表
   * @param sheetIndex
   */
  getSheetByIndex(sheetIndex: number): ISheet | undefined;

  /**
   * 根据名称获取表
   * @param sheetName
   */
  getSheetByName(sheetName: string): ISheet | undefined;

  /**
   * 获取单元格的样式及数据
   */
  getCellInfo(sheetIndex: number, row: number, col: number): CellInfo;

  /**
   * 获取单元格的数据，这里仅返回数据，不包含样式
   */
  getCellValue(sheetIndex: number, row: number, col: number): CellValue;

  /**
   * 获取范围内的数据
   * @param includeHidden 是否包含隐藏的单元格
   */
  getCellValueByRange(
    sheetIndex: number,
    range: RangeRef,
    includeHidden: boolean
  ): CellValue[];

  /**
   * 查找文本
   */
  searchText(sheetIndex: number, text: string): CellValue[];

  /**
   * 获取最终颜色
   */
  getColor(color?: CT_Color, defaultColor?: string): string | 'none';

  /**
   * 获取默认字体大小
   */
  getDefaultFontSize(): FontSize;

  /**
   * 获取默认字体
   */
  getDefaultFontStyle(): FontStyle;

  /**
   * 获取合并单元格的配置
   */
  getMergeCells(sheetIndex: number): RangeRef[];

  /**
   * 获取图片
   */
  getDrawing(sheetIndex: number): IDrawing | null;

  /**
   * 获取条件格式
   */
  getConditionalFormatting(sheetIndex: number): CT_ConditionalFormatting[];

  /**
   * 获取 dxf 样式定义
   */
  getDxf(index: number): CT_Dxf | null;

  /**
   * TODO: 这个接口不应该暴露出来，CSV 不需要这个
   */
  getFontStyle(font?: CT_Font): FontStyle;

  /**
   * 是否是 1904 日期系统
   * https://support.microsoft.com/en-us/office/date-systems-in-excel-e7fe7167-48a9-4b96-bb53-5612a800b487
   */
  is1904(): boolean;

  /**
   * 设置行排序
   */
  sortColumn(
    sheetIndex: number,
    range: RangeRef,
    sortOrder: 'asc' | 'desc'
  ): void;

  /**
   * 修改行高
   */
  setRowHeight(sheetIndex: number, row: number, height: number): void;

  /**
   * 修改列宽
   */
  setColWidth(sheetIndex: number, col: number, width: number): void;

  /**
   * 清理默认字体大小缓存
   */
  clearDefaultFontSizeCache(): void;
}

/**
 * 单元格的值
 */
export type CellValue = {
  row: number;
  col: number;
  /**
   * 单元格最终展现的文本
   */
  text: string;

  value: string;

  color?: string;

  isDate?: boolean;
};

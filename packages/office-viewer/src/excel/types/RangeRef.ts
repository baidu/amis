/**
 * 范围引用
 */

export interface RangeRef {
  /**
   * 开始行，从 0 开始
   */
  startRow: number;

  /**
   * 开始列，从 0 开始
   */
  startCol: number;

  /**
   * 结束的行
   */
  endRow: number;

  /**
   * 结束的列
   */
  endCol: number;
}

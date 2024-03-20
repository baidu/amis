/**
 * 尺寸信息
 */

export type Size = {
  size: number;
  offset: number;
};

/**
 * 区域
 */
export type Region =
  | 'normal'
  | 'left-frozen'
  | 'top-frozen'
  | 'top-left-frozen';

/**
 * 可视范围内的行列
 */

export type ViewRange = {
  /**
   * 所在区域
   */
  region: Region;
  /**
   * 行索引列表
   */
  rows: number[];
  /**
   * 起始行的偏移量
   */
  startRowOffset: number;

  /**
   * 行的位置相关信息
   */
  rowSizes: Size[];

  /**
   * 最大高度
   */
  height: number;

  /**
   * 列索引的列表
   */
  cols: number[];
  /**
   * 起始列偏移量
   */
  startColOffset: number;

  /**
   * 列的位置信息
   */
  colSizes: Size[];

  /**
   * 最大宽度
   */
  width: number;
};

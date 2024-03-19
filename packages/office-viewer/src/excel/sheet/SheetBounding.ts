/**
 * 工作表的高宽，拆分一下避免 Workbook 代码太多
 */

import type {Sheet} from './Sheet';

export class SheetBounding {
  sheet: Sheet;
  constructor(sheet: Sheet) {
    this.sheet = sheet;
  }

  /**
   * 当前数据所需的渲染空间，这个在初始时设置
   */
  contentBoundingRect: {
    width: number;
    height: number;
  };

  /**
   * 获取数据所需的空间
   */
  getContentBoundingRect() {
    return this.contentBoundingRect;
  }
}

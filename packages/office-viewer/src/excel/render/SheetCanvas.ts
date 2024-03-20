/**
 * 内容区 Canvas 封装，方便图形绘制
 */

import type {Workbook} from '../Workbook';
import {IDataProvider} from '../types/IDataProvider';
import {CellInfo} from '../types/CellInfo';
import {Canvas} from './Canvas';
import {drawCell} from './cell/drawCell';
import {LinkPosition} from './cell/LinkPosition';
import {CellInfoWithSize} from './cell/CellInfoWithSize';
import {autoClip} from './cell/autoClip';
import {ExcelRender} from './ExcelRender';

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class SheetCanvas extends Canvas {
  workbook: Workbook;

  dataProvider: IDataProvider;

  // 调试的时候开启，会绘制文字的包围盒
  debugFontBoundingBox = false;

  constructor(workbook: Workbook, dataProvider: IDataProvider) {
    const {width, height} = workbook.getViewpointSize();
    super(
      width,
      height,
      workbook.renderOptions.scale || 1,
      'ov-excel-content-canvas ov-excel-canvas'
    );

    this.workbook = workbook;
    this.dataProvider = dataProvider;
  }

  /**
   * 绘制单元格
   * @param font
   * @param text
   * @param x
   * @param y
   * @param width
   * @param height
   */
  drawCell(
    excelRender: ExcelRender,
    cellInfo: CellInfo,
    x: number,
    y: number,
    width: number,
    height: number,
    indentSize: number,
    padding: number,
    needClear = false,
    linkPositionCache: LinkPosition[] = []
  ) {
    const sheet = this.workbook.getActiveSheet();
    drawCell(
      excelRender,
      sheet,
      this,
      this.dataProvider,
      cellInfo,
      x,
      y,
      width,
      height,
      indentSize,
      padding,
      needClear,
      linkPositionCache
    );
  }

  autoClip(cellInfoMap: Map<string, CellInfoWithSize>) {
    autoClip(this.ctx, this.dataProvider, cellInfoMap);
  }
}

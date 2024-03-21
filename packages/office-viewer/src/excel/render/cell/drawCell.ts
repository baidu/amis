import {Sheet} from '../../sheet/Sheet';
import {CellInfo} from '../../types/CellInfo';
import {IDataProvider} from '../../types/IDataProvider';
import {Canvas} from '../Canvas';
import type {ExcelRender} from '../ExcelRender';
import {LinkPosition} from './LinkPosition';
import {drawCellBackground} from './drawCellBackground';
import {drawCellBorder} from './drawCellBorder';
import {drawCellDataBar} from './drawDataBar';
import {drawIconSet} from './drawIconSet';
import {drawTextInCell} from './drawTextInCell';

/**
 * 绘制单元格的实现逻辑
 * @param ctx
 * @param dataProvider
 * @param cellInfo
 * @param x
 * @param y
 * @param width
 * @param height
 * @param padding
 * @param needClear
 */
export function drawCell(
  excelRender: ExcelRender,
  sheet: Sheet,
  canvas: Canvas,
  dataProvider: IDataProvider,
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
  const ctx = canvas.ctx;
  if (needClear) {
    // 这里减 1 是为了避免清除网格线，不过后续需要更好的实现
    ctx.clearRect(x + 1, y + 1, width - 2, height - 2);
  }

  drawCellBackground(ctx, dataProvider, cellInfo, x, y, width, height);

  let drawText = true;
  if (cellInfo.dataBarDisplay) {
    //数据条的绘制
    drawCellDataBar(canvas, cellInfo.dataBarDisplay, x, y, width, height);
    drawText = cellInfo.dataBarDisplay.showValue;
  }

  if (cellInfo.icon) {
    drawIconSet(canvas, cellInfo.icon, x, y, width, height);
  }

  if (drawText) {
    drawTextInCell(
      excelRender,
      sheet,
      ctx,
      dataProvider,
      cellInfo,
      x,
      y,
      width,
      height,
      indentSize,
      padding,
      linkPositionCache
    );
  }

  // Excel 里似乎是后绘制 border
  drawCellBorder(ctx, dataProvider, cellInfo, x, y, width, height);
}

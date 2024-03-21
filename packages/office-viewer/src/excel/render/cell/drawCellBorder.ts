import {CT_Border, CT_BorderPr} from '../../../openxml/ExcelTypes';
import {CellInfo} from '../../types/CellInfo';
import {IDataProvider} from '../../types/IDataProvider';

import {AUTO_COLOR} from '../Consts';
import {drawDoubleBorder} from './border/drawDoubleBorder';
import {setLineStyle} from './border/setLineStyle';

/**
 * 绘制单个边框
 */
function drawSingleBorder(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  dataProvider: IDataProvider,
  border: CT_Border,
  borderPr: CT_BorderPr | undefined,
  position: 'left' | 'right' | 'top' | 'bottom' | 'diagonalDown' | 'diagonalUp',
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  if (borderPr && borderPr.style && borderPr.style !== 'none') {
    ctx.beginPath();

    ctx.strokeStyle = dataProvider.getColor(borderPr.color, AUTO_COLOR);
    if (borderPr.style === 'double') {
      drawDoubleBorder(ctx, border, position, startX, startY, endX, endY);
    } else {
      setLineStyle(ctx, borderPr.style);
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
    }

    ctx.stroke();
  }
}

/**
 * 绘制单元格边框
 */
export function drawCellBorder(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  dataProvider: IDataProvider,
  cellInfo: CellInfo,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const border = cellInfo.border;
  if (!border) {
    return;
  }
  // 绘制边框
  ctx.save();
  ctx.lineWidth = 1;
  drawSingleBorder(
    ctx,
    dataProvider,
    border,
    border.top,
    'top',
    x,
    y,
    x + width,
    y
  );
  drawSingleBorder(
    ctx,
    dataProvider,
    border,
    border.bottom,
    'bottom',
    x,
    y + height,
    x + width,
    y + height
  );
  drawSingleBorder(
    ctx,
    dataProvider,
    border,
    border.left,
    'left',
    x,
    y,
    x,
    y + height
  );
  drawSingleBorder(
    ctx,
    dataProvider,
    border,
    border.right,
    'right',
    x + width,
    y,
    x + width,
    y + height
  );

  if (border.diagonalDown) {
    drawSingleBorder(
      ctx,
      dataProvider,
      border,
      border.diagonal,
      'diagonalDown',
      x,
      y,
      x + width,
      y + height
    );
  }

  if (border.diagonalUp) {
    drawSingleBorder(
      ctx,
      dataProvider,
      border,
      border.diagonal,
      'diagonalUp',
      x,
      y + height,
      x + width,
      y
    );
  }

  ctx.restore();
}

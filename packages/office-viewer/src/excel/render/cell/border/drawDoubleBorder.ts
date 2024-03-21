import {CT_Border, CT_BorderPr} from '../../../../openxml/ExcelTypes';

function isDoubleBorder(borderPr: CT_BorderPr | undefined) {
  return borderPr && borderPr.style === 'double';
}

export function drawDoubleBorder(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  border: CT_Border,
  position: 'left' | 'right' | 'top' | 'bottom' | 'diagonalDown' | 'diagonalUp',
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  ctx.lineWidth = 1;
  const lineOffset = 1;
  switch (position) {
    case 'top':
      ctx.moveTo(startX - lineOffset, startY - lineOffset);
      ctx.lineTo(endX + lineOffset, startY - lineOffset);

      // 避免双边框重叠
      if (isDoubleBorder(border.left)) {
        startX += 1;
      }

      if (isDoubleBorder(border.right)) {
        endX -= 1;
      }

      ctx.moveTo(startX, startY + lineOffset);
      ctx.lineTo(endX, startY + lineOffset);
      break;
    case 'bottom':
      ctx.moveTo(startX - lineOffset, endY + lineOffset);
      ctx.lineTo(endX + lineOffset, endY + lineOffset);

      // 避免双边框重叠
      if (isDoubleBorder(border.left)) {
        startX += 1;
      }

      if (isDoubleBorder(border.right)) {
        endX -= 1;
      }

      ctx.moveTo(startX, endY - lineOffset);
      ctx.lineTo(endX, endY - lineOffset);

      break;
    case 'left':
      ctx.moveTo(startX - lineOffset, startY - lineOffset);
      ctx.lineTo(startX - lineOffset, endY + lineOffset);

      // 避免双边框重叠
      if (isDoubleBorder(border.top)) {
        startY += 1;
      }

      if (isDoubleBorder(border.bottom)) {
        endY -= 1;
      }

      ctx.moveTo(startX + lineOffset, startY);
      ctx.lineTo(startX + lineOffset, endY);

      break;
    case 'right':
      ctx.moveTo(endX + lineOffset, startY - lineOffset);
      ctx.lineTo(endX + lineOffset, endY + lineOffset);

      // 避免双边框重叠
      if (isDoubleBorder(border.top)) {
        startY += 1;
      }

      if (isDoubleBorder(border.bottom)) {
        endY -= 1;
      }
      ctx.moveTo(endX - lineOffset, startY);
      ctx.lineTo(endX - lineOffset, endY);

      break;

    case 'diagonalDown':
      ctx.moveTo(startX - lineOffset, startY + lineOffset);
      ctx.lineTo(endX - lineOffset, endY + lineOffset);
      ctx.moveTo(startX + lineOffset, startY - lineOffset);
      ctx.lineTo(endX + lineOffset, endY - lineOffset);
      break;

    case 'diagonalUp':
      ctx.moveTo(startX - lineOffset, startY - lineOffset);
      ctx.lineTo(endX - lineOffset, endY - lineOffset);
      ctx.moveTo(startX + lineOffset, startY + lineOffset);
      ctx.lineTo(endX + lineOffset, endY + lineOffset);
      break;
  }
}

import {DataBarDisplay} from '../../types/DataBarDisplay';
import {Canvas} from '../Canvas';
import {drawCellDataBarX14} from './drawDataBarX14';

export function drawCellDataBar(
  canvas: Canvas,
  dataBarDisplay: DataBarDisplay,
  x: number,
  y: number,
  width: number,
  height: number
) {
  if (dataBarDisplay.biDirectional) {
    return drawCellDataBarX14(canvas, dataBarDisplay, x, y, width, height);
  }
  const fillColor = dataBarDisplay.color;
  if (fillColor !== 'none') {
    const displayWidth = width * dataBarDisplay.percent;
    // 从有到左需要换一下方向
    if (dataBarDisplay.direction === 'rightToLeft') {
      x = x + width - displayWidth;
    }

    if (dataBarDisplay.gradient) {
      if (dataBarDisplay.direction === 'rightToLeft') {
        canvas.drawRectLinearGradientWithPadding(
          x,
          y,
          displayWidth,
          height,
          dataBarDisplay.colorGradient,
          fillColor,
          1
        );
      } else {
        canvas.drawRectLinearGradientWithPadding(
          x,
          y,
          displayWidth,
          height,
          fillColor,
          dataBarDisplay.colorGradient,
          1
        );
      }
    } else {
      canvas.drawRectWithPadding(x, y, displayWidth, height, fillColor, 1);
    }

    if (dataBarDisplay.border && dataBarDisplay.borderColor) {
      canvas.drawStrokeRectPadding(
        x,
        y,
        displayWidth,
        height,
        dataBarDisplay.borderColor,
        1
      );
    }
  }
}

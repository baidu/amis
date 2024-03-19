import {DataBarDisplay} from '../../types/DataBarDisplay';
import {Canvas} from '../Canvas';

/**
 * Excel 2010 中的双向数据条，这里已经过滤了数据里没有负数的情况，所以一定是两边显示
 * 不支持 rightToLeft，因为看起来很奇怪，估计不会有人用
 */
export function drawCellDataBarX14(
  canvas: Canvas,
  dataBarDisplay: DataBarDisplay,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const fillColor = dataBarDisplay.color;
  if (fillColor !== 'none') {
    const xCenter = x + width / 2;
    // 绘制中间的坐标轴竖线
    const axisColor = dataBarDisplay.axisColor;
    canvas.setLineDash(
      {
        x1: xCenter,
        y1: y,
        x2: xCenter,
        y2: y + height
      },
      [1, 1],
      axisColor
    );

    const displayWidth = Math.abs((width * dataBarDisplay.percent) / 2);
    if (displayWidth === 0) {
      return;
    }

    if (dataBarDisplay.percent < 0) {
      // 绘制负数部分
      if (dataBarDisplay.gradient) {
        let startColor = dataBarDisplay.negativeFillColorGradient;
        let endColor = dataBarDisplay.negativeFillColor;
        canvas.drawRectLinearGradientWithPadding(
          xCenter - displayWidth,
          y,
          displayWidth,
          height,
          startColor,
          endColor,
          1
        );
      }
      // 绘制边框
      if (dataBarDisplay.border && dataBarDisplay.negativeBorderColor) {
        canvas.drawStrokeRectPadding(
          xCenter - displayWidth,
          y,
          displayWidth,
          height,
          dataBarDisplay.negativeBorderColor,
          1
        );
      }
    } else {
      // 绘制正数部分
      if (dataBarDisplay.gradient) {
        let startColor = dataBarDisplay.color;
        let endColor = dataBarDisplay.colorGradient;
        canvas.drawRectLinearGradientWithPadding(
          xCenter,
          y,
          displayWidth,
          height,
          startColor,
          endColor,
          1
        );
      }

      // 绘制边框
      if (dataBarDisplay.border && dataBarDisplay.borderColor) {
        canvas.drawStrokeRectPadding(
          xCenter,
          y,
          displayWidth,
          height,
          dataBarDisplay.borderColor,
          1
        );
      }
    }
  }
}

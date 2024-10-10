import {CT_Color} from '../../../openxml/ExcelTypes';
import {X14SparklineGroup} from '../../types/X14Sparkline/X14SparklineGroup';
import {Numbers} from './Numbers';
import {applyColor} from './applyColor';

/**
 * 绘制折线图
 */
export function renderLine(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  min: number,
  max: number,
  data: Numbers,
  sparklineOptions: X14SparklineGroup,
  getColor: (color?: CT_Color) => string
) {
  const padding = 2;
  // 为了避免线跑出去，需要在两边加上一些空白
  height -= padding * 2;
  width -= padding * 2;

  const color = getColor(sparklineOptions['x14:colorSeries']!);

  // 只有一个点没法画
  if (data.length < 1) {
    console.warn('sparkline 只有一个数据', data);
    return;
  }

  const step = width / (data.length - 1);

  // 绘制坐标轴
  if (sparklineOptions.displayXAxis) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = sparklineOptions.lineWeight || 1.2;
    ctx.moveTo(0 + padding, height / 2 + padding);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }

  // 画线
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = sparklineOptions.lineWeight || 1.2;
  const points: {x: number; y: number; index: number; value: number}[] = [];
  // 上一个是空值，则需要 moveTo
  let lastIsUndefined = false;
  for (const [index, value] of data.entries()) {
    if (value === undefined) {
      lastIsUndefined = true;
      continue;
    }

    const x = index * step + padding;
    const y = height - ((value - min) / (max - min)) * height + padding;
    if (index === 0 && lastIsUndefined) {
      ctx.moveTo(x, y);
      lastIsUndefined = false;
    } else {
      ctx.lineTo(x, y);
    }
    points.push({x, y, index, value});
  }
  ctx.stroke();

  // 画点
  if (sparklineOptions.markers) {
    for (const point of points) {
      ctx.beginPath();
      applyColor(
        ctx,
        data,
        point.index,
        point.value,
        min,
        max,
        sparklineOptions,
        color,
        getColor
      );
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  } else {
    // 画特定的点
    for (const point of points) {
      const showRender = applyColor(
        ctx,
        data,
        point.index,
        point.value,
        min,
        max,
        sparklineOptions,
        color,
        getColor
      );

      if (!showRender) {
        continue;
      }

      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

import {CT_Color} from '../../../openxml/ExcelTypes';
import {X14SparklineGroup} from '../../types/X14Sparkline/X14SparklineGroup';
import {Numbers} from './Numbers';
import {applyColor} from './applyColor';

/**
 * 绘制柱状图
 */
export function renderColumn(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  min: number,
  max: number,
  data: Numbers,
  sparklineOptions: X14SparklineGroup,
  getColor: (color?: CT_Color) => string
) {
  const color = getColor(sparklineOptions['x14:colorSeries']!);
  // 柱状图之间的间隔
  const gap = 2;

  const diff = max - min;

  // 只有一个点就只绘制中间
  ctx.fillStyle = color;
  if (data.length === 1) {
    const firstData = data[0];
    if (firstData !== undefined) {
      const columnWidth = 6;
      ctx.fillRect(
        width / 2 - 1,
        height - ((firstData - min) / diff) * height,
        columnWidth,
        ((firstData - min) / diff) * height
      );
    }

    return;
  }

  const columnWidth = (width - gap * (data.length - 1)) / data.length;
  const minColumnHeight = 1;

  for (const [index, value] of data.entries()) {
    if (value === undefined) {
      continue;
    }
    applyColor(
      ctx,
      data,
      index,
      value,
      min,
      max,
      sparklineOptions,
      color,
      getColor
    );
    const x = index * (columnWidth + gap);
    const columnHeight = Math.max(
      minColumnHeight,
      ((value - min) / diff) * height
    );
    const y = height - columnHeight;
    ctx.fillRect(x, y, columnWidth, columnHeight);
  }
}

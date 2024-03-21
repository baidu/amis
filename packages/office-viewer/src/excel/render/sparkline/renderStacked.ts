import {CT_Color} from '../../../openxml/ExcelTypes';
import {X14SparklineGroup} from '../../types/X14Sparkline/X14SparklineGroup';
import {Numbers} from './Numbers';
import {applyColor} from './applyColor';
import {gt} from '../../../util/number';

/**
 * render win/loss sparkline
 */
export function renderStacked(
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
  const colorNegative = getColor(sparklineOptions['x14:colorNegative']!);
  // 柱状图之间的间隔
  const gap = 2;

  const columnHeight = height / 2;

  // 只有一个点就只绘制中间

  if (data.length === 1) {
    const firstData = data[0];
    if (firstData !== undefined) {
      const columnWidth = 6;

      if (gt(firstData, 0)) {
        ctx.fillStyle = color;
        ctx.fillRect(width / 2, 0, columnWidth, columnHeight);
      } else {
        ctx.fillStyle = colorNegative;
        ctx.fillRect(
          width / 2,
          height - columnHeight,
          columnWidth,
          columnHeight
        );
      }
    }

    return;
  }

  const columnWidth = (width - gap * (data.length - 1)) / data.length;
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
    let y;
    if (gt(value, 0)) {
      ctx.fillStyle = color;
      y = 0;
    } else {
      ctx.fillStyle = colorNegative;
      y = height - columnHeight;
    }
    ctx.fillRect(x, y, columnWidth, columnHeight);
  }
}

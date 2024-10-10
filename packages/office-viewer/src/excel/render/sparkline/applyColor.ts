import {CT_Color} from '../../../openxml/ExcelTypes';
import {stripNumber} from '../../../util/stripNumber';
import {X14SparklineGroup} from '../../types/X14Sparkline/X14SparklineGroup';
import {Numbers} from './Numbers';

/**
 * 应用样式
 */
export function applyColor(
  ctx: OffscreenCanvasRenderingContext2D,
  data: Numbers,
  index: number,
  value: number,
  min: number,
  max: number,
  sparklineOptions: X14SparklineGroup,
  defaultColor: string,
  getColor: (color?: CT_Color) => string
): boolean {
  value = stripNumber(value);
  min = stripNumber(min);
  max = stripNumber(max);
  if (sparklineOptions.first && index === 0) {
    ctx.fillStyle = getColor(sparklineOptions['x14:colorFirst']!);
    return true;
  } else if (sparklineOptions.last && index === data.length - 1) {
    ctx.fillStyle = getColor(sparklineOptions['x14:colorLast']!);
    return true;
  } else if (sparklineOptions.high && value === max) {
    ctx.fillStyle = getColor(sparklineOptions['x14:colorHigh']!);
    return true;
  } else if (sparklineOptions.low && value === min) {
    ctx.fillStyle = getColor(sparklineOptions['x14:colorLow']!);
    return true;
  } else if (sparklineOptions.negative && value < 0) {
    ctx.fillStyle = getColor(sparklineOptions['x14:colorNegative']!);
    return true;
  } else {
    ctx.fillStyle = defaultColor;
  }
  return false;
}

/**
 * 绘制 sparkline，这里的坐标都是从 0 开始
 */

import {CT_Color} from '../../../openxml/ExcelTypes';
import {X14SparklineGroup} from '../../types/X14Sparkline/X14SparklineGroup';
import {Numbers} from './Numbers';
import {renderLine} from './renderLine';
import {renderColumn} from './renderColumn';
import {renderStacked} from './renderStacked';
import {gt, lt} from '../../../util/number';

/**
 * 绘制 Sparkline
 */
export function renderSparkline(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  data: string[],
  sparklineOptions: X14SparklineGroup,
  getColor: (color?: CT_Color) => string
) {
  const type = sparklineOptions.type || 'line';
  let minVal: number | undefined;
  let maxVal: number | undefined;

  const numbers: Numbers = data.map(d => {
    if (d === '') {
      return undefined;
    }

    const num = parseFloat(d);
    if (minVal === undefined) {
      minVal = num;
    }
    if (maxVal === undefined) {
      maxVal = num;
    }
    if (lt(num, minVal)) {
      minVal = num;
    }
    if (gt(num, maxVal)) {
      maxVal = num;
    }

    return num;
  });

  if (numbers.length === 0 || minVal === undefined || maxVal === undefined) {
    console.warn('sparkline 数据不完整', numbers);
    return;
  }

  if (sparklineOptions.manualMin !== undefined) {
    minVal = sparklineOptions.manualMin;
  }

  if (sparklineOptions.manualMax !== undefined) {
    maxVal = sparklineOptions.manualMax;
  }

  if (type === 'line') {
    renderLine(
      ctx,
      width,
      height,
      minVal,
      maxVal,
      numbers,
      sparklineOptions,
      getColor
    );
  } else if (type === 'column') {
    renderColumn(
      ctx,
      width,
      height,
      minVal,
      maxVal,
      numbers,
      sparklineOptions,
      getColor
    );
  } else if (type === 'stacked') {
    renderStacked(
      ctx,
      width,
      height,
      minVal,
      maxVal,
      numbers,
      sparklineOptions,
      getColor
    );
  } else {
    console.warn('不支持的 sparkline 类型', type);
  }
}

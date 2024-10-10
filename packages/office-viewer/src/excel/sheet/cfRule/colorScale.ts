import {CT_CfRule} from '../../../openxml/ExcelTypes';
import {CellInfo} from '../../types/CellInfo';
import {RangeRef} from '../../types/RangeRef';
import {Sheet} from '../Sheet';
import {Color, interpolateColor} from '../../../util/color';
import {getMinMax} from './getMinMax';

/**
 * 缓存里的内容
 */
type ScaleCacheValue = {
  min: number;

  max: number;

  /**
   * 颜色范围定义
   */
  colors: {
    percent: number;
    color: Color;
  }[];
};

/**
 * 色阶
 */
export function colorScale(
  sheet: Sheet,
  cellInfo: CellInfo,
  ranges: RangeRef[],
  cfRule: CT_CfRule
): boolean {
  const rangeCache = sheet.getRangeCache();
  const ruleKey = JSON.stringify(cfRule);
  let rangeColorScale = rangeCache.get(ranges, ruleKey) as
    | ScaleCacheValue
    | undefined;
  const colorScale = cfRule.colorScale;

  if (!colorScale) {
    return false;
  }

  if (!rangeColorScale) {
    const dataProvider = sheet.workbook.getDataProvider();
    const cfvo = colorScale.cfvo;
    const color = colorScale.color;

    if (!cfvo || !color) {
      console.warn('色阶规则不完整');
      return false;
    }

    if (cfvo.length !== color.length) {
      console.warn('色阶规则不匹配');
      return false;
    }

    const rangeValues = sheet.getCellValueByRanges(ranges);

    const {min, max} = getMinMax(rangeValues);

    if (min === undefined || max === undefined) {
      return false;
    }

    const colors: ScaleCacheValue['colors'] = [];

    for (const [i, cfvoItem] of cfvo.entries()) {
      const type = cfvoItem.type;
      switch (type) {
        case 'min': {
          const colorValue = dataProvider.getColor(color[i]);
          if (colorValue !== 'none') {
            colors.push({
              percent: 0,
              color: new Color(colorValue)
            });
          }
          break;
        }

        case 'max': {
          const colorValue = dataProvider.getColor(color[i]);
          if (colorValue !== 'none') {
            colors.push({
              percent: 1,
              color: new Color(colorValue)
            });
          }
          break;
        }

        case 'percentile': {
          const val = parseInt(cfvoItem.val || '50', 10);
          const percent = val / 100;
          const colorValue = dataProvider.getColor(color[i]);
          if (colorValue !== 'none') {
            colors.push({
              percent,
              color: new Color(colorValue)
            });
          }
          break;
        }

        default:
          console.warn('未知的 cfvo type', type);
          break;
      }
    }

    if (colors.length < 2) {
      console.warn('色彩数量不足');
    }

    // 排序一下避免 xml 里乱序
    colors.sort((a, b) => a.percent - b.percent);

    rangeColorScale = {
      min: min,
      max: max,
      colors
    };

    rangeCache.set(ranges, ruleKey, rangeColorScale);
  }

  const value = parseFloat(cellInfo.value);

  // 当前值所在的百分比
  const percent =
    (value - rangeColorScale.min) / (rangeColorScale.max - rangeColorScale.min);
  // 查找所属色阶
  let endColor;
  let endPercent = 1;
  let startPercent = 0;
  let startColor = rangeColorScale.colors[0].color;

  for (const color of rangeColorScale.colors) {
    if (percent >= startPercent && percent < color.percent) {
      endColor = color.color;
      endPercent = color.percent;
      break;
    }
    startColor = color.color;
    startPercent = color.percent;
  }

  if (endColor === undefined) {
    endColor = rangeColorScale.colors[rangeColorScale.colors.length - 1].color;
  }

  let percentRange = endPercent - startPercent;
  // 避免除 0
  if (percentRange === 0) {
    percentRange = 1;
  }

  const backgroundColor = interpolateColor(
    startColor,
    endColor,
    (percent - startPercent) / percentRange
  );

  cellInfo.fill = {
    patternFill: {
      bgColor: {rgb: 'FF' + backgroundColor}
    }
  };

  return true;
}

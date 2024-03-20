import {CT_CfRule} from '../../../openxml/ExcelTypes';
import {presetIconSet} from '../../io/excel/preset/presetIconSet';
import {CellInfo} from '../../types/CellInfo';
import {RangeRef} from '../../types/RangeRef';
import {Sheet} from '../Sheet';
import {getMinMax} from './getMinMax';
import {IconNames} from '../../io/excel/preset/presetIcons';
import {getPercent} from '../../../util/number';

/**
 * 缓存里的内容
 */
type RangeIconSetCache = {
  min: number;

  max: number;

  /**
   * 颜色范围定义
   */
  icons: {
    percent: number;
    icon: IconNames;
  }[];
};

/**
 * 应用图标样式
 */

export function iconSet(
  sheet: Sheet,
  cellInfo: CellInfo,
  ranges: RangeRef[],
  cfRule: CT_CfRule
): boolean {
  const rangeCache = sheet.getRangeCache();
  const ruleKey = JSON.stringify(cfRule);
  let rangeIconSet = rangeCache.get(ranges, 'ruleKey');
  if (!rangeIconSet) {
    const iconSet = cfRule.iconSet;
    if (!iconSet) {
      return false;
    }
    const iconSetName = iconSet.iconSet || '3TrafficLights1';

    const cfvo = iconSet.cfvo;

    if (!cfvo) {
      console.warn('图标集规则不完整');
      return false;
    }

    const rangeValues = sheet.getCellValueByRanges(ranges);

    const icons: RangeIconSetCache['icons'] = [];

    let presetIcon = presetIconSet[iconSetName];

    if (!presetIcon) {
      console.warn('未知的图标集', iconSetName);
      return false;
    }

    if (iconSet.reverse === true) {
      presetIcon = presetIcon.slice().reverse();
    }

    for (const [i, cfvoItem] of cfvo.entries()) {
      const type = cfvoItem.type;
      switch (type) {
        // 目前还不知道这两个啥区别
        case 'percentile':
        case 'percent': {
          const val = parseInt(cfvoItem.val || '50', 10);
          const percent = val / 100;
          const icon = presetIcon[i];
          if (typeof icon === 'undefined') {
            console.warn('未知的图标', iconSetName);
            return false;
          }
          icons.push({
            percent,
            icon
          });
          break;
        }

        default:
          console.warn('未知的 cfvo type', type);
          break;
      }
      const {min, max} = getMinMax(rangeValues);

      if (min === undefined || max === undefined) {
        return false;
      }

      if (icons.length === 0) {
        console.warn('图标集为空');
        return false;
      }

      rangeIconSet = {
        min,
        max,
        icons
      };
    }
  }

  const value = parseFloat(cellInfo.value);

  // 当前值所在的百分比
  const percent = getPercent(value, rangeIconSet.min, rangeIconSet.max);

  // 查找所属 icon
  let startIcon = rangeIconSet.icons[0].icon;
  for (const icon of rangeIconSet.icons) {
    if (percent <= icon.percent) {
      break;
    }
    startIcon = icon.icon;
  }

  // 应用图标
  cellInfo.icon = startIcon;

  return true;
}

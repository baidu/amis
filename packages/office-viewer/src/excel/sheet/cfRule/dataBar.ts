import {CT_CfRule, CT_DataBar} from '../../../openxml/ExcelTypes';
import {CellInfo} from '../../types/CellInfo';
import {RangeRef} from '../../types/RangeRef';
import {Sheet} from '../Sheet';
import {getMinMax} from './getMinMax';
import {Color} from '../../../util/color';
import {CT_ExtensionList} from '../../types/CT_ExtensionList';
import {DataBarDisplay} from '../../types/DataBarDisplay';
import {gt, lt} from '../../../util/number';

/**
 * 查找对应的扩展
 */
function findExt(extLst: CT_ExtensionList[], sheetExtLst?: CT_ExtensionList) {
  if (!sheetExtLst) {
    return null;
  }
  for (const exts of extLst || []) {
    for (const ext of exts.ext || []) {
      const x14Id = ext['x14:id'];
      if (x14Id) {
        for (const sheetExt of sheetExtLst.ext || []) {
          const x14CFs =
            sheetExt['x14:conditionalFormattings']?.[
              'x14:conditionalFormatting'
            ];
          for (const x14CFItem of x14CFs || []) {
            const x14CfRules = x14CFItem['x14:cfRule'];
            for (const x14CfRule of x14CfRules || []) {
              if (x14CfRule.id === x14Id) {
                return x14CfRule['x14:dataBar'];
              }
            }
          }
        }
      }
    }
  }
  return null;
}

function getGradientColor(c: string) {
  const color = new Color(c);
  // 根据 Excel 里的展现判断的
  color.changeHsl(0.93, 'l', 'set');
  return color.toHex();
}

/**
 * 构建展现配置
 */
function buildDataBarDisplay(
  min: number,
  max: number,
  worksheet: Sheet,
  cfRule: CT_CfRule
) {
  const dataBarDisplay: DataBarDisplay = {
    showValue: true,
    gradient: true,
    border: false,
    percent: 0,
    color: '',
    colorGradient: '',
    borderColor: '',
    negativeFillColor: '',
    negativeFillColorGradient: '',
    negativeBorderColor: '',
    axisColor: '',
    direction: 'leftToRight',
    biDirectional: false
  };

  const dataBar = cfRule.dataBar as CT_DataBar;
  const dataProvider = worksheet.workbook.getDataProvider();

  if (dataBar.color) {
    dataBarDisplay.color = dataProvider.getColor(dataBar.color);
    if (dataBarDisplay.color !== 'none') {
      dataBarDisplay.colorGradient = getGradientColor(dataBarDisplay.color);
    }
  }

  if (dataBar.showValue === false) {
    dataBarDisplay.showValue = false;
  }

  // Excel 2010 之后的版本才有的扩展
  if (cfRule.extLst) {
    const x14DataBar = findExt(cfRule.extLst, worksheet.getExtLst());
    if (!x14DataBar) {
      console.warn('cx14DataBar not found', cfRule.extLst);
      return dataBarDisplay;
    }

    if (x14DataBar.gradient === false) {
      dataBarDisplay.gradient = false;
    }

    if (lt(min, 0) && gt(max, 0)) {
      dataBarDisplay.biDirectional = true;
    }

    if (x14DataBar.direction) {
      dataBarDisplay.direction = x14DataBar.direction;
    }

    if (x14DataBar.border === true) {
      dataBarDisplay.border = true;
    }

    if (x14DataBar['x14:borderColor']) {
      dataBarDisplay.borderColor = dataProvider.getColor(
        x14DataBar['x14:borderColor']
      );
    }

    if (x14DataBar['x14:negativeFillColor']) {
      dataBarDisplay.negativeFillColor = dataProvider.getColor(
        x14DataBar['x14:negativeFillColor']
      );

      if (dataBarDisplay.negativeFillColor !== 'none') {
        dataBarDisplay.negativeFillColorGradient = getGradientColor(
          dataBarDisplay.negativeFillColor
        );
      }
    }

    if (x14DataBar.negativeBarColorSameAsPositive === true) {
      dataBarDisplay.negativeFillColor = dataBarDisplay.color;
      dataBarDisplay.negativeFillColorGradient = dataBarDisplay.colorGradient;
    }

    if (x14DataBar.negativeBarBorderColorSameAsPositive === false) {
      if (x14DataBar['x14:negativeBorderColor']) {
        dataBarDisplay.negativeBorderColor = dataProvider.getColor(
          x14DataBar['x14:negativeBorderColor']
        );
      }
    } else {
      dataBarDisplay.negativeBorderColor = dataBarDisplay.borderColor;
    }

    if (x14DataBar['x14:axisColor']) {
      dataBarDisplay.axisColor = dataProvider.getColor(
        x14DataBar['x14:axisColor']
      );
    }
  }

  return dataBarDisplay;
}

/**
 * 缓存里的内容
 */
type ScaleCacheValue = {
  min: number;

  max: number;

  /**
   * dataBar 展现配置
   */
  dataBarDisplay: DataBarDisplay;
};

/**
 * dataBar
 */
export function dataBar(
  sheet: Sheet,
  cellInfo: CellInfo,
  ranges: RangeRef[],
  cfRule: CT_CfRule
): boolean {
  if (!cfRule.dataBar) {
    return false;
  }

  if (cfRule.dataBar.cfvo?.length !== 2) {
    console.warn('dataBar cfvo length !== 2', cfRule.dataBar.cfvo);
    return false;
  }

  const rangeCache = sheet.getRangeCache();
  const ruleKey = JSON.stringify(cfRule);
  let dataBarCache = rangeCache.get(ranges, ruleKey) as ScaleCacheValue;
  if (!dataBarCache) {
    const rangeValues = sheet.getCellValueByRanges(ranges);
    let {min, max} = getMinMax(rangeValues);
    let cfvo1 = cfRule.dataBar.cfvo?.[0];
    let cfvo2 = cfRule.dataBar.cfvo?.[1];
    if (cfvo1.type === 'num') {
      min = parseFloat(cfvo1.val || '0');
    }
    if (cfvo2.type === 'num') {
      max = parseFloat(cfvo2.val || '1');
    }
    // todo，还得支持 percent percentile formula
    if (min === undefined || max === undefined) {
      return false;
    }
    // 避免除数为 0
    if (min === max) {
      return false;
    }
    const dataBarDisplay = buildDataBarDisplay(min, max, sheet, cfRule);

    dataBarCache = {
      min,
      max,
      dataBarDisplay
    };
    rangeCache.set(ranges, ruleKey, dataBarCache);
  }

  const value = parseFloat(cellInfo.value);
  const dataBarDisplay = dataBarCache.dataBarDisplay;
  if (dataBarDisplay.biDirectional) {
    if (lt(value, 0)) {
      const percent = value / dataBarCache.min;
      dataBarDisplay.percent = -percent;
    } else if (gt(value, 0)) {
      const percent = value / dataBarCache.max;
      dataBarDisplay.percent = percent;
    } else {
      dataBarDisplay.percent = 0;
    }
  } else {
    const percent =
      (value - dataBarCache.min) / (dataBarCache.max - dataBarCache.min);

    dataBarDisplay.percent = percent;
  }

  cellInfo.dataBarDisplay = dataBarDisplay;
  return true;
}

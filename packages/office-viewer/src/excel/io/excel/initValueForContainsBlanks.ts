import {IWorksheet} from '../../types/IWorksheet';
import {parseRange} from './util/Range';
import {makeBlankValue} from './util/makeBlankValue';

/**
 * 后面判断 containsBlanks 时需要单元格有值，不然 getViewPointData 会拿不到数据导致无法判断
 * 这个方法的作用是保证在 containsBlanks 检测范围内的单元格都有值
 */
export function initValueForContainsBlanks(worksheet: IWorksheet) {
  for (const formatting of worksheet.conditionalFormatting) {
    const cfRules = formatting.cfRule || [];
    for (const cfRule of cfRules) {
      if (cfRule.type === 'containsBlanks') {
        const sqref = formatting.sqref;
        if (!sqref) {
          continue;
        }
        const ranges = sqref.split(' ').map(parseRange);
        for (const range of ranges) {
          makeBlankValue(worksheet.cellData, range);
        }
      }
    }
  }
}

import {CellData} from '../../../types/worksheet/CellData';

import {RangeRef} from '../../../types/RangeRef';

/**
 * 制造空值，这个主要是给 containsBlanks 条件格式用，目前的实现下如果没有值就没法渲染
 */
export function makeBlankValue(cellData: CellData[][], range: RangeRef) {
  for (let i = range.startRow; i <= range.endRow; i++) {
    let rowData = cellData[i];
    if (!rowData) {
      rowData = [];
      cellData[i] = rowData;
    }
    for (let j = range.startCol; j <= range.endCol; j++) {
      if (rowData[j] === undefined) {
        rowData[j] = {
          type: 'blank'
        };
      }
    }
  }
}

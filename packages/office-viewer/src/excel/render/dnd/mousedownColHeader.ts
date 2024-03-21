import {Workbook} from '../../Workbook';
import {RangeRef} from '../../types/RangeRef';
import {MAX_ROW} from '../Consts';
import {HitTestResult} from '../selection/hitTest';

/**
 * 点击到列表头
 * @param workbook
 * @param hitTestResult
 * @returns
 */
export function mousedownColHeader(
  workbook: Workbook,
  hitTestResult: HitTestResult
) {
  const activeCell: RangeRef = {
    startRow: 0,
    startCol: hitTestResult.startCol,
    endRow: 0,
    endCol: hitTestResult.endCol
  };

  return {
    user: '',
    region: hitTestResult.region,
    selectType: hitTestResult.type,
    activeCell,
    sheetIndex: workbook.getActiveSheet().getIndex(),
    cellRanges: [
      {
        ...activeCell,
        endRow: MAX_ROW
      }
    ]
  };
}

import {Workbook} from '../../Workbook';
import {RangeRef} from '../../types/RangeRef';
import {MAX_COL} from '../Consts';
import {HitTestResult} from '../selection/hitTest';

/**
 * 点击到行表头
 * @param workbook
 * @param hitTestResult
 * @returns
 */
export function mousedownRowHeader(
  workbook: Workbook,
  hitTestResult: HitTestResult
) {
  const activeCell: RangeRef = {
    startRow: hitTestResult.startRow,
    startCol: 0,
    endRow: hitTestResult.endRow,
    endCol: 0
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
        endCol: MAX_COL
      }
    ]
  };
}

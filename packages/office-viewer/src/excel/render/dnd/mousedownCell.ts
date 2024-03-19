import type {Workbook} from '../../Workbook';
import {RangeRef} from '../../types/RangeRef';
import {SheetSelection} from '../selection/SheetSelection';
import {HitTestResult} from '../selection/hitTest';

/**
 * 根据点击的单元格生成选区
 * @param workbook
 * @param hitTestResult
 * @returns 新的选区
 */
export function mousedownCell(
  workbook: Workbook,
  hitTestResult: HitTestResult
) {
  const activeCell: RangeRef = {
    startRow: hitTestResult.startRow,
    startCol: hitTestResult.startCol,
    endRow: hitTestResult.endRow,
    endCol: hitTestResult.endCol
  };

  const newSelection: SheetSelection = {
    // 当前用户名为空
    user: '',
    region: hitTestResult.region,
    selectType: hitTestResult.type,
    activeCell,
    sheetIndex: workbook.getActiveSheet().getIndex(),
    // 初始 cellRanges 为当前单元格
    cellRanges: [
      {
        ...activeCell
      }
    ]
  };

  return newSelection;
}

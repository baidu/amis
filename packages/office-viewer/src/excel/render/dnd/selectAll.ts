import {MAX_COL, MAX_ROW} from '../Consts';
import {SheetSelection} from '../selection/SheetSelection';

/**
 * 全选范围
 */
export function selectAll(sheetIndex: number): SheetSelection {
  const activeCell = {
    startRow: 0,
    startCol: 0,
    endRow: 0,
    endCol: 0
  };

  return {
    user: '',
    region: 'normal',
    selectType: 'corner',
    activeCell,
    sheetIndex,
    cellRanges: [
      {
        ...activeCell,
        endRow: MAX_ROW,
        endCol: MAX_COL
      }
    ]
  };
}

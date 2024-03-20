import {Workbook} from '../../Workbook';
import {Region} from '../../sheet/ViewRange';

import {RangeRef} from '../../types/RangeRef';
import {MAX_COL, MAX_ROW} from '../Consts';

import {getCellRowPosition, getCellColPosition} from './getCellPosition';

/**
 * 算出选中区域的位置信息
 */
export function getRangePosition(
  workbook: Workbook,
  region: Region,
  cellRange: RangeRef
) {
  const activeSheet = workbook.getActiveSheet();
  // 获取开始位置，如果找不到就当成 0
  let startX = 0;
  const startColPosition = getCellColPosition(
    activeSheet,
    region,
    cellRange.startCol
  );
  if (startColPosition) {
    startX = startColPosition.x;
  }
  let startY = 0;
  const startRowPosition = getCellRowPosition(
    activeSheet,
    region,
    cellRange.startRow
  );
  if (startRowPosition) {
    startY = startRowPosition.y;
  }
  // TODO: 目前还有一种情况没测过，就是当选取大于显示范围的时候
  const {width, height} = workbook.getViewpointSize();
  // 如果找不到就当成最大值
  let endX = 0;
  let endY = 0;
  let endWidth = 0;
  let endHeight = 0;
  const endRowPosition = getCellRowPosition(
    activeSheet,
    region,
    cellRange.endRow
  );
  if (endRowPosition) {
    endY = endRowPosition.y;
    endHeight = endRowPosition.height;
  }

  if (cellRange.endRow === MAX_ROW) {
    endY = height;
    // 随便有个值就行
    endHeight = 1;
  }

  const endColPosition = getCellColPosition(
    activeSheet,
    region,
    cellRange.endCol
  );
  if (endColPosition) {
    endX = endColPosition.x;
    endWidth = endColPosition.width;
  }

  if (cellRange.endCol === MAX_COL) {
    endX = width;
    // 随便有个值就行
    endWidth = 1;
  }

  // 全都找不到意味着在显示范围外了
  if (
    !startColPosition &&
    !startRowPosition &&
    !endRowPosition &&
    !endColPosition
  ) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }

  return {
    x: startX,
    y: startY,
    width: endX + endWidth - startX,
    height: endY + endHeight - startY
  };
}

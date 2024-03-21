import {CT_OneCellAnchor} from '../../../openxml/ExcelTypes';
import {emuToPx} from '../../../util/emuToPx';
import {Sheet} from '../../sheet/Sheet';

export function getOneCellAnchorPosition(
  oneCellAnchor: CT_OneCellAnchor,
  sheet: Sheet
) {
  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;

  const from = oneCellAnchor.from?.[0];
  if (from) {
    const cellRow = from.row?.[0] || 0;
    const cellRowOffset = emuToPx(from.rowOff?.[0]);
    const cellCol = from.col?.[0] || 0;
    const cellColOffset = emuToPx(from.colOff?.[0]);

    const cellPosition = sheet.getCellPosition(cellRow, cellCol);
    return {
      x: cellPosition.x,
      y: cellPosition.y,
      width: cellColOffset,
      height: cellRowOffset
    };
  }

  return {
    x,
    y,
    width,
    height
  };
}

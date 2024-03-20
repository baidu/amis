import {CT_TwoCellAnchor} from '../../../openxml/ExcelTypes';
import {emuToPx} from '../../../util/emuToPx';
import {Sheet} from '../../sheet/Sheet';

export function getTwoCellAnchorPosition(
  twoCellAnchor: CT_TwoCellAnchor,
  sheet: Sheet
) {
  const from = twoCellAnchor.from?.[0];
  const to = twoCellAnchor.to?.[0];

  if (!from || !to) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }

  const fromRow = from.row?.[0] || 0;
  const fromRowOffset = emuToPx(from.rowOff?.[0]);

  const fromCol = from.col?.[0] || 0;
  const fromColOffset = emuToPx(from.colOff?.[0]);

  const fromPosition = sheet.getCellPosition(fromRow, fromCol);

  const toRow = to.row?.[0] || 0;
  const toRowOffset = emuToPx(to.rowOff?.[0]);
  const toCol = to.col?.[0] || 0;
  const toColOffset = emuToPx(to.colOff?.[0]);

  const toPosition = sheet.getCellPosition(toRow, toCol);

  const x = fromPosition.x + fromColOffset;
  const y = fromPosition.y + fromRowOffset;

  const width = toPosition.x + toColOffset - x;
  const height = toPosition.y + toRowOffset - y;

  return {
    x,
    y,
    width,
    height
  };
}

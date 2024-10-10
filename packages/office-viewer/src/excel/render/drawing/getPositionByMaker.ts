import {CT_Marker} from '../../../openxml/ExcelTypes';
import {emuToPx} from '../../../util/emuToPx';
import {Sheet} from '../../sheet/Sheet';

/**
 * 基于 maker 计算位置信息
 */
export function getPositionByMaker(maker: CT_Marker, sheet: Sheet) {
  const row = maker.row?.[0] || 0;
  const rowOff = emuToPx(maker.rowOff?.[0]);

  const col = maker.col?.[0] || 0;
  const colOff = emuToPx(maker.colOff?.[0]);

  const cellPosition = sheet.getCellPosition(row, col);

  return {
    x: cellPosition.x,
    y: cellPosition.y,
    width: colOff,
    height: rowOff
  };
}

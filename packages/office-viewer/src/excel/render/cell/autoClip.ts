/**
 * 自动裁剪，Excel 中似乎会自动避免遮挡，目前还不清楚是怎么实现的
 */

import {CellInfo} from '../../types/CellInfo';
import {IDataProvider} from '../../types/IDataProvider';
import {CellInfoWithSize} from './CellInfoWithSize';
import {measureTextWithCache} from './measureTextWithCache';
import {genFontStr} from './genFontStr';

export function autoClip(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  dataProvider: IDataProvider,
  cellInfoMap: Map<string, CellInfoWithSize>
) {
  for (const [key, cellInfo] of cellInfoMap) {
    const row = parseInt(key.split(',')[0]);
    const col = parseInt(key.split(',')[1]);

    const nextCol = col + 1;
    // 如果当前单元格右边有单元格且当前单元格不是 wrap
    if (cellInfoMap.has(`${row},${nextCol}`)) {
      const nextCellInfo = cellInfoMap.get(`${row},${nextCol}`)!;
      // 当前和后面单元格都有文本，且当前单元格不是 wrap
      if (
        cellInfo.alignment?.wrapText !== true &&
        cellInfo.text &&
        nextCellInfo.text
      ) {
        const fontStyle = dataProvider.getFontStyle(cellInfo.font);
        // 如果当前文本过长，可能会折叠后面的文本，就设置为 needClip
        const font = genFontStr(fontStyle);
        const size = measureTextWithCache(ctx, font, cellInfo.text);
        if (size.width > cellInfo.width) {
          cellInfo.needClip = true;
        }
      }
    }
  }
}

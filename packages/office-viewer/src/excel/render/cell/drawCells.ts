import {ExcelRenderOptions} from '../../sheet/ExcelRenderOptions';
import {DisplayData, Sheet} from '../../sheet/Sheet';
import {SheetCanvas} from '../SheetCanvas';
import {PADDING_SIZE} from '../Consts';
import {LinkPosition} from './LinkPosition';
import {CellInfoWithSize} from './CellInfoWithSize';
import type {ExcelRender} from '../ExcelRender';

/**
 * 绘制所有单元格的主入口
 */
export function drawCells(
  excelRender: ExcelRender,
  currentSheet: Sheet,
  excelRenderOptions: ExcelRenderOptions,
  canvas: SheetCanvas,
  displayData: DisplayData[],
  linkPositionCache: LinkPosition[]
) {
  const cellInfoMap: Map<string, CellInfoWithSize> = new Map();
  for (const data of displayData) {
    const {row, col, width, height} = data;
    if (width <= 0 || height <= 0) {
      continue;
    }
    const cellInfo = currentSheet.getCellInfo(row, col);
    if (cellInfo) {
      cellInfoMap.set(`${row},${col}`, {
        ...JSON.parse(JSON.stringify(cellInfo)),
        width,
        height
      });
    }
  }

  canvas.autoClip(cellInfoMap);

  for (const data of displayData) {
    const {row, col, x, y, width, height, needClear} = data;
    if (width <= 0 || height <= 0) {
      continue;
    }
    const key = `${row},${col}`;
    if (cellInfoMap.has(key)) {
      const cellInfo = cellInfoMap.get(key)!;
      canvas.drawCell(
        excelRender,
        cellInfo,
        x,
        y,
        width,
        height,
        excelRenderOptions.indentSize,
        PADDING_SIZE,
        needClear,
        linkPositionCache
      );
    }
  }
}

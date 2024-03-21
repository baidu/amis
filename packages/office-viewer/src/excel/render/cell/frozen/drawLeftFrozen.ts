import {ExcelRenderOptions} from '../../../sheet/ExcelRenderOptions';
import {Sheet} from '../../../sheet/Sheet';
import {SheetCanvas} from '../../SheetCanvas';
import {drawGridLines} from '../../grid/drawGridLines';
import {drawCells} from '../drawCells';
import {drawRowColHeaders} from '../../header/drawRowColHeaders';
import {IDataProvider} from '../../../types/IDataProvider';
import {LinkPosition} from '../LinkPosition';
import {ExcelRender} from '../../ExcelRender';

/**
 * 绘制只有左边冻结的情况
 */
export function drawLeftFrozen(
  excelRender: ExcelRender,
  xSplit: number,
  currentSheet: Sheet,
  dataProvider: IDataProvider,
  excelRenderOptions: ExcelRenderOptions,
  mainCanvas: SheetCanvas,
  height: number,
  linkPositionCache: LinkPosition[]
) {
  const frozenViewRange = currentSheet.getFrozenLeftViewPointRange(
    xSplit,
    height
  );

  // 获取可视区域内的信息
  const displayData = currentSheet.getViewPointData(frozenViewRange);

  mainCanvas.drawRect(
    0,
    0,
    frozenViewRange.width,
    frozenViewRange.height,
    excelRenderOptions.cellBackgroundColor
  );

  drawCells(
    excelRender,
    currentSheet,
    excelRenderOptions,
    mainCanvas,
    displayData,
    linkPositionCache
  );

  drawGridLines(
    currentSheet,
    frozenViewRange,
    mainCanvas,
    frozenViewRange.height,
    frozenViewRange.width,
    excelRenderOptions
  );

  drawRowColHeaders(
    currentSheet,
    frozenViewRange,
    mainCanvas,
    excelRenderOptions,
    dataProvider.getDefaultFontSize(),
    dataProvider.getDefaultFontStyle()
  );

  // 绘制冻结分割线
  mainCanvas.drawLine(
    {
      x1: frozenViewRange.width,
      y1: 0,
      x2: frozenViewRange.width,
      y2: frozenViewRange.height
    },
    excelRenderOptions.frozenLineColor
  );

  return frozenViewRange;
}

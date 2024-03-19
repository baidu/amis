import {ExcelRenderOptions} from '../../../sheet/ExcelRenderOptions';
import {Sheet} from '../../../sheet/Sheet';
import {SheetCanvas} from '../../SheetCanvas';
import {drawGridLines} from '../../grid/drawGridLines';
import {drawCells} from '../drawCells';
import {drawRowColHeaders} from '../../header/drawRowColHeaders';
import {IDataProvider} from '../../../types/IDataProvider';
import {drawTopFrozen} from './drawTopFrozen';
import {drawLeftFrozen} from './drawLeftFrozen';
import {LinkPosition} from '../LinkPosition';
import {ExcelRender} from '../../ExcelRender';

/**
 * 绘制同时有左边和上边冻结的情况，需要绘制 3 个独立区域
 */
export function drawTopLeftFrozen(
  excelRender: ExcelRender,
  xSplit: number,
  ySplit: number,
  currentSheet: Sheet,
  dataProvider: IDataProvider,
  excelRenderOptions: ExcelRenderOptions,
  mainCanvas: SheetCanvas,
  height: number,
  width: number,
  linkPositionCache: LinkPosition[]
) {
  // 先单独绘制左边和上边的区域
  const topViewRange = drawTopFrozen(
    excelRender,
    ySplit,
    currentSheet,
    dataProvider,
    excelRenderOptions,
    mainCanvas,
    width,
    linkPositionCache
  );
  const leftViewRange = drawLeftFrozen(
    excelRender,
    xSplit,
    currentSheet,
    dataProvider,
    excelRenderOptions,
    mainCanvas,
    height,
    linkPositionCache
  );
  // 绘制中间的区域
  const topLeftViewRange = currentSheet.getFrozenTopLeftViewPointRange(
    xSplit,
    ySplit
  );

  // 获取可视区域内的信息
  const displayData = currentSheet.getViewPointData(topLeftViewRange);

  // 清空区域
  mainCanvas.drawRect(
    0,
    0,
    topLeftViewRange.width,
    topLeftViewRange.height,
    excelRenderOptions.cellBackgroundColor
  );

  // 绘制单元格
  drawCells(
    excelRender,
    currentSheet,
    excelRenderOptions,
    mainCanvas,
    displayData,
    linkPositionCache
  );

  // 绘制网格线
  drawGridLines(
    currentSheet,
    topLeftViewRange,
    mainCanvas,
    topLeftViewRange.height,
    topLeftViewRange.width,
    excelRenderOptions
  );

  // 绘制表头
  drawRowColHeaders(
    currentSheet,
    topLeftViewRange,
    mainCanvas,
    excelRenderOptions,
    dataProvider.getDefaultFontSize(),
    dataProvider.getDefaultFontStyle()
  );

  // 绘制上边和左边分割线
  mainCanvas.drawLine(
    {
      x1: 0,
      y1: topViewRange.height,
      x2: topLeftViewRange.width,
      y2: topViewRange.height
    },
    excelRenderOptions.frozenLineColor
  );
  mainCanvas.drawLine(
    {
      x1: leftViewRange.width,
      y1: 0,
      x2: leftViewRange.width,
      y2: topLeftViewRange.height
    },
    excelRenderOptions.frozenLineColor
  );

  return {
    topViewRange,
    leftViewRange,
    topLeftViewRange
  };
}

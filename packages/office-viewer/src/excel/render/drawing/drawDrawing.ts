import {emuToPx} from '../../../util/emuToPx';
import {Sheet} from '../../sheet/Sheet';
import {SheetCanvas} from '../SheetCanvas';
import {rectIntersect} from '../Rect';
import {drawPic} from './drawPic';
import {drawShape} from './drawShape';
import {drawChart} from './drawChart';
import {
  getRectFromOneAnchorPoint,
  getRectFromTwoAnchorPoint
} from './getRectFromAnchorPoint';
import {getAbsoluteAnchorPosition} from './getAbsoluteAnchorPosition';
import {ExcelRender} from '../ExcelRender';
import {ViewRange} from '../../sheet/ViewRange';

/**
 * 绘制 sheet 里的图片及文本框
 */
export function drawDrawing(
  excelRender: ExcelRender,
  currentSheet: Sheet,
  viewRange: ViewRange,
  canvas: SheetCanvas
) {
  const drawing = currentSheet.getDrawing();
  if (!drawing) {
    return;
  }

  const displayRect = currentSheet.getDisplayRect();

  const {rowHeaderWidth, colHeaderHeight} = currentSheet.getRowColSize();

  for (const twoCellAnchor of drawing.twoCellAnchors) {
    if (!twoCellAnchor.from || !twoCellAnchor.to) {
      console.warn('from or to do not exist');
      continue;
    }
    const drawingRect = getRectFromTwoAnchorPoint(
      currentSheet,
      twoCellAnchor.from?.[0],
      twoCellAnchor.to?.[0],
      viewRange
    );

    if (twoCellAnchor.pic) {
      drawPic(
        currentSheet,
        canvas,
        displayRect,
        drawingRect,
        rowHeaderWidth,
        colHeaderHeight,
        twoCellAnchor.pic
      );
    }
    if (twoCellAnchor.shape) {
      drawShape(
        excelRender,
        currentSheet,
        canvas,
        displayRect,
        drawingRect,
        rowHeaderWidth,
        colHeaderHeight,
        twoCellAnchor.shape
      );
    }
    if (twoCellAnchor.chartSpace) {
      drawChart(
        currentSheet,
        displayRect,
        rowHeaderWidth,
        colHeaderHeight,
        drawingRect,
        twoCellAnchor.chartSpace
      );
    }
  }

  for (const absoluteAnchor of drawing.absoluteAnchors) {
    const size = getAbsoluteAnchorPosition(absoluteAnchor);

    const x = size.x + rowHeaderWidth - displayRect.x;
    const y = size.y + colHeaderHeight - displayRect.y;

    const drawingRect = {
      x,
      y,
      width: size.width,
      height: size.height
    };

    // 目前没测试过在 absoluteAnchor 里的效果，都不知道怎么在 excel 里操作
    if (absoluteAnchor.pic) {
      drawPic(
        currentSheet,
        canvas,
        displayRect,
        drawingRect,
        rowHeaderWidth,
        colHeaderHeight,
        absoluteAnchor.pic
      );
    }

    if (absoluteAnchor.shape) {
      drawShape(
        excelRender,
        currentSheet,
        canvas,
        displayRect,
        drawingRect,
        rowHeaderWidth,
        colHeaderHeight,
        absoluteAnchor.shape
      );
    }

    if (absoluteAnchor.chartSpace) {
      drawChart(
        currentSheet,
        displayRect,
        rowHeaderWidth,
        colHeaderHeight,
        drawingRect,
        absoluteAnchor.chartSpace
      );
    }
  }

  for (const oneCellAnchor of drawing.oneCellAnchors) {
    if (!oneCellAnchor.from) {
      console.warn('from do not exist');
      continue;
    }
    const drawingRect = getRectFromOneAnchorPoint(
      currentSheet,
      oneCellAnchor.from?.[0],
      viewRange
    );

    if (oneCellAnchor.pic) {
      drawPic(
        currentSheet,
        canvas,
        displayRect,
        drawingRect,
        rowHeaderWidth,
        colHeaderHeight,
        oneCellAnchor.pic
      );
    }

    if (oneCellAnchor.shape) {
      drawShape(
        excelRender,
        currentSheet,
        canvas,
        displayRect,
        drawingRect,
        rowHeaderWidth,
        colHeaderHeight,
        oneCellAnchor.shape
      );
    }

    if (oneCellAnchor.chartSpace) {
      drawChart(
        currentSheet,
        displayRect,
        rowHeaderWidth,
        colHeaderHeight,
        drawingRect,
        oneCellAnchor.chartSpace
      );
    }
  }
}

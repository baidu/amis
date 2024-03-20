import {numberToLetters} from '../../io/excel/util/numberToLetters';
import {ExcelRenderOptions} from '../../sheet/ExcelRenderOptions';
import {Sheet} from '../../sheet/Sheet';
import {ViewRange} from '../../sheet/ViewRange';
import {FontSize} from '../../types/FontSize';
import {FontStyle} from '../../types/FontStyle';
import {SheetCanvas} from '../SheetCanvas';
import {genFontStr} from '../cell/genFontStr';

/**
 * 绘制行列的表头
 */
export function drawRowColHeaders(
  currentSheet: Sheet,
  viewRange: ViewRange,
  sheetCanvas: SheetCanvas,
  renderOptions: ExcelRenderOptions,
  defaultFontSize: FontSize,
  defaultFontStyle: FontStyle
) {
  if (currentSheet.showRowColHeaders() === false) {
    return;
  }
  const {rows, startRowOffset, height, width, cols, startColOffset} = viewRange;

  const {rowHeaderWidth, colHeaderHeight} = currentSheet.getRowColSize();

  const {
    gridLineColor,
    rowColHeadersBackgroundColor: rowColHeadersBgColor,
    hiddenRowColHeadersLineColor
  } = renderOptions;

  let currentRowOffset = startRowOffset;

  // 竖向的背景
  sheetCanvas.drawRect(0, 0, rowHeaderWidth, height, rowColHeadersBgColor);

  const font = genFontStr(defaultFontStyle);
  const color = renderOptions.rowColHeadersColor;

  let hasHiddenRow = false;
  // 绘制竖向的线表头
  for (let i of rows) {
    // 绘制竖向的文字
    const rowHeight = currentSheet.getRowHeight(i);

    // 为零就代表隐藏，标记一下
    if (rowHeight === 0) {
      hasHiddenRow = true;
      continue;
    }

    // 横向的线
    const lineY = currentRowOffset + colHeaderHeight;
    sheetCanvas.drawLine(
      {
        x1: 0,
        y1: lineY,
        x2: rowHeaderWidth,
        y2: lineY
      },
      gridLineColor
    );

    // 如果有隐藏内容的情况
    if (hasHiddenRow) {
      // 重置一下
      hasHiddenRow = false;
      sheetCanvas.drawLine(
        {
          x1: 0,
          y1: lineY,
          x2: rowHeaderWidth,
          y2: lineY
        },
        hiddenRowColHeadersLineColor,
        3
      );
    } else {
      sheetCanvas.drawLine(
        {
          x1: 0,
          y1: lineY,
          x2: rowHeaderWidth,
          y2: lineY
        },
        gridLineColor
      );
    }

    const textSize = String(i + 1).length;
    const textWidth = textSize * defaultFontSize.width;

    sheetCanvas.drawText(
      font,
      color,
      String(i + 1),
      (rowHeaderWidth - textWidth) / 2,
      currentRowOffset +
        (rowHeight - defaultFontSize.height) / 2 +
        colHeaderHeight,
      'top'
    );

    currentRowOffset += rowHeight;
  }

  // 绘制最左侧的线，目前 office 365 是不绘制的
  // sheetCanvas.drawLine(
  //   {
  //     x1: 0,
  //     y1: 0,
  //     x2: 0,
  //     y2: currentRowOffset + colHeaderHeight
  //   },
  //   gridLineColor
  // );

  // 横向的背景
  sheetCanvas.drawRect(0, 0, width, colHeaderHeight, rowColHeadersBgColor);

  let currentColOffset = startColOffset;

  // 横向字体的 Y 坐标，这个是固定的
  const colTextY = (colHeaderHeight - defaultFontSize.height) / 2;

  // 绘制横向的线表头
  // 上一个列的索引
  let lastColIndex = 0;

  for (let i of cols) {
    const colWidth = currentSheet.getColWidth(i);

    // 竖向的线
    const lineX = currentColOffset + rowHeaderWidth;

    // 如果当前索引比上一个索引大 1 以上，就代表有隐藏的列
    const hasHiddenCol = i - lastColIndex > 1;

    if (hasHiddenCol) {
      sheetCanvas.drawLine(
        {
          x1: lineX,
          y1: 0,
          x2: lineX,
          y2: colHeaderHeight
        },
        hiddenRowColHeadersLineColor,
        3
      );
    } else {
      sheetCanvas.drawLine(
        {
          x1: lineX,
          y1: 0,
          x2: lineX,
          y2: colHeaderHeight
        },
        gridLineColor
      );
    }

    // 绘制横向的文字
    const text = numberToLetters(i);
    const textSize = text.length;
    const textWidth = textSize * defaultFontSize.width;

    sheetCanvas.drawText(
      font,
      color,
      text,
      currentColOffset + (colWidth - textWidth) / 2 + rowHeaderWidth,
      colTextY,
      'top'
    );

    currentColOffset += colWidth;
    lastColIndex = i;
  }

  // 绘制最上方的线，目前 office 365 是不绘制的
  // sheetCanvas.drawLine(
  //   {
  //     x1: 0,
  //     y1: 0,
  //     x2: currentColOffset + rowHeaderWidth,
  //     y2: 0
  //   },
  //   gridLineColor
  // );

  // 绘制左上角的背景，TODO: 这里还有别的设计，比如一个倒三角
  sheetCanvas.drawRect(
    0,
    0,
    rowHeaderWidth,
    colHeaderHeight,
    rowColHeadersBgColor
  );
}

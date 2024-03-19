import {Workbook} from '../../Workbook';
import {RangeRef} from '../../types/RangeRef';
import {Canvas} from '../Canvas';
import {SheetSelection} from './SheetSelection';
import {drawSelectionHeaderHighlight} from './drawSelectionHeaderHighlight';
import {getCellPosition, getCellPositionWithMerge} from './getCellPosition';
import {getRangePosition} from './getRangePosition';

/**
 * 绘制选中内容区域的高亮
 * @param workbook
 * @param canvas
 * @param selection
 * @param range
 * @returns
 */
export function drawCellSelection(
  workbook: Workbook,
  canvas: Canvas,
  selection: SheetSelection,
  range: RangeRef
) {
  let {x, y, width, height} = getRangePosition(
    workbook,
    selection.region,
    range
  );

  // 这种一般是超出显示区域
  if (width === 0 || height === 0) {
    return;
  }
  const renderOptions = workbook.renderOptions;

  // 绘制选中的单元格
  canvas.drawStrokeRect(
    x,
    y,
    width,
    height,
    renderOptions.selectionBorderColor,
    2
  );

  const rightBottomStrokeSize = renderOptions.selectionSquareSize;
  // 绘制选中单元格右下角的小方块
  canvas.drawStrokeRect(
    x + width - rightBottomStrokeSize,
    y + height - rightBottomStrokeSize,
    rightBottomStrokeSize * 2,
    rightBottomStrokeSize * 2,
    '#FFFFFF',
    1
  );
  const rightBottomRectSize = rightBottomStrokeSize - 1;

  const padding = 1;
  // 绘制内容部分的颜背景色
  canvas.drawAlphaRectPadding(
    x,
    y,
    width,
    height,
    padding,
    renderOptions.selectionBackgroundColor,
    renderOptions.selectionBackgroundOpacity
  );

  // 清除一下选中区域的背景色，这里的加一减一主要是为了避免覆盖边框
  // 这里要判断 activeCell 所在位置来决定是加 padding 还是减 padding
  const activeCell = selection.activeCell;
  let paddingX = 0;
  let paddingY = 0;
  // 如果在左上角，x 和 y 都要加 padding
  if (
    activeCell.startCol === range.startCol &&
    activeCell.startRow === range.startRow
  ) {
    paddingX = padding;
    paddingY = padding;
  } else if (
    activeCell.endCol === range.endCol &&
    activeCell.endRow === range.endRow
  ) {
    // 如果在右下角，x 和 y 都要加 padding
    paddingX = padding;
    paddingY = padding;
    // 如果只有一列
    if (range.startCol === range.endCol) {
      paddingX = padding;
    }
    // 如果只有一行
    if (range.startRow === range.endRow) {
      paddingY = padding;
    }
  } else if (
    activeCell.startCol === range.startCol &&
    activeCell.endRow === range.endRow
  ) {
    // 如果在左下角，x 加 padding，y 减 padding
    paddingX = padding;
    paddingY = -padding;
  } else if (
    // 如果在右上角，x 加 padding，y 加 padding
    activeCell.endCol === range.endCol &&
    activeCell.startRow === range.startRow
  ) {
    paddingX = padding;
    paddingY = padding;
  }

  const activeCellPosition = getCellPositionWithMerge(
    workbook.getActiveSheet(),
    selection.region,
    activeCell.startCol,
    activeCell.startRow
  );
  if (activeCellPosition) {
    canvas.clearRect(
      activeCellPosition.x + paddingX,
      activeCellPosition.y + paddingY,
      activeCellPosition.width - 2 * padding,
      activeCellPosition.height - 2 * padding
    );
  }

  // 绘制选中单元格右下角的小方块
  canvas.drawRect(
    x + width - rightBottomRectSize,
    y + height - rightBottomRectSize,
    rightBottomRectSize * 2,
    rightBottomRectSize * 2,
    renderOptions.selectionBorderColor
  );

  // 绘制选中区表头的高亮
  drawSelectionHeaderHighlight(workbook, canvas, x, y, width, height);
}

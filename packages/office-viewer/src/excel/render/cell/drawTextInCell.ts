import {
  ST_HorizontalAlignment,
  ST_VerticalAlignment
} from '../../../openxml/ExcelTypes';
import {isValidURL} from '../../../util/isValidURL';
import {Sheet} from '../../sheet/Sheet';
import {CellInfo} from '../../types/CellInfo';
import {IDataProvider} from '../../types/IDataProvider';
import {IRElt} from '../../types/IRElt';
import {ExcelRender} from '../ExcelRender';
import {LinkPosition} from './LinkPosition';
import {WrapLine, autoWrapText} from './autoWrapText';
import {measureTextWithCache} from './measureTextWithCache';
import {drawMultiLineText} from './drawMultiLineText';
import {drawSingleLineRichText} from './drawSingleLineRichText';
import {drawSingleLineText} from './drawSingleLineText';
import {genFontStr} from './genFontStr';

const NUMBER_RE = /^-?[\d\.]+$/;

/**
 * 绘制单元格里的文字
 * @param cellInfo
 * @param x
 * @param y
 * @param width 单元格宽度
 * @param height 单元格高度
 * @param padding 内边距
 */
export function drawTextInCell(
  excelRender: ExcelRender,
  sheet: Sheet,
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  dataProvider: IDataProvider,
  cellInfo: CellInfo,
  x: number,
  y: number,
  width: number,
  height: number,
  indentSize: number,
  padding: number,
  linkPositionCache: LinkPosition[] = []
) {
  if (
    cellInfo.cellData &&
    typeof cellInfo.cellData === 'object' &&
    cellInfo.cellData.type === 'blank'
  ) {
    return;
  }

  let wrapText = false;
  let horizontal: ST_HorizontalAlignment = 'left';

  // 数字默认右对齐
  if (typeof cellInfo.cellData === 'string') {
    if (NUMBER_RE.test(cellInfo.cellData)) {
      horizontal = 'right';
    }
  }

  // 默认值其实是 bottom
  let vertical: ST_VerticalAlignment = 'bottom';

  const alignment = cellInfo.alignment;

  // 缩进
  let indent = 0;

  let displayWidth = width - padding * 2;

  const fontStyle = dataProvider.getFontStyle(cellInfo.font);

  if (alignment) {
    if (alignment.wrapText) {
      wrapText = true;
    }
    if (alignment.horizontal) {
      horizontal = alignment.horizontal;
    }
    if (alignment.vertical) {
      vertical = alignment.vertical;
    }
    if (alignment.indent) {
      indent = alignment.indent;
    }
    if (alignment.textRotation) {
      // 按文档里说最大值只有 180，目前是基于 wrapText 和限制 width 实现的
      if (alignment.textRotation === 255) {
        wrapText = true;
        const defaultFont = genFontStr(fontStyle);
        const defaultFontSize = measureTextWithCache(ctx, defaultFont, '1');
        // 这个保证会拆分
        displayWidth = defaultFontSize.width;
      }
    }
  }

  // 限制一下，后面得可配
  if (indent > 5) {
    indent = 5;
  }

  // fill 或 wrap 都可能需要截断
  const needClip = cellInfo.needClip || horizontal === 'fill' || wrapText;

  if (needClip) {
    ctx.save();
    ctx.rect(x, y, width, height);
    ctx.clip();
  }

  // 有多行文本的时候 Excel 会自动设置 wrapText 为 true
  if (wrapText) {
    let lines: WrapLine[] = [];
    if (cellInfo.text) {
      lines = autoWrapText(ctx, cellInfo.text, displayWidth, fontStyle);
    } else if (
      typeof cellInfo.cellData === 'object' &&
      'richText' in cellInfo.cellData
    ) {
      lines = autoWrapText(
        ctx,
        cellInfo.cellData.richText as IRElt[],
        displayWidth,
        fontStyle
      );
    } else {
      console.warn('unknown cell data', cellInfo);
    }

    drawMultiLineText(
      excelRender,
      sheet,
      ctx,
      dataProvider,
      fontStyle,
      lines,
      x + padding,
      y + padding,
      displayWidth,
      height - padding * 2,
      padding,
      horizontal,
      vertical,
      cellInfo.text,
      cellInfo.row,
      linkPositionCache
    );
  } else {
    // 为了提升性能这个单独实现，因为是最常见的情况
    if (cellInfo.text) {
      drawSingleLineText(
        ctx,
        fontStyle,
        cellInfo.text,
        fontStyle.color,
        x + padding,
        y + padding,
        displayWidth,
        height - padding * 2,
        indent * indentSize,
        horizontal,
        vertical,
        linkPositionCache
      );
    } else if (
      typeof cellInfo.cellData === 'object' &&
      'richText' in cellInfo.cellData
    ) {
      drawSingleLineRichText(
        excelRender,
        sheet,
        ctx,
        dataProvider,
        fontStyle,
        cellInfo.cellData.richText as IRElt[],
        x + padding,
        y + padding,
        displayWidth,
        height - padding * 2,
        horizontal,
        vertical,
        cellInfo.row
      );
    }
  }

  if (needClip) {
    ctx.restore();
  }
}

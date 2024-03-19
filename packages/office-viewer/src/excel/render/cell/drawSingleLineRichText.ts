import {
  ST_HorizontalAlignment,
  ST_VerticalAlignment
} from '../../../openxml/ExcelTypes';
import {IDataProvider} from '../../types/IDataProvider';
import {IRElt} from '../../types/IRElt';
import {WrapLine} from './autoWrapText';
import {measureTextWithCache} from './measureTextWithCache';
import {genFontStr, genFontStrFromRPr} from './genFontStr';
import {drawMultiLineText} from './drawMultiLineText';
import {FontStyle} from '../../types/FontStyle';
import {Sheet} from '../../sheet/Sheet';
import {ExcelRender} from '../ExcelRender';

/**
 * 绘制单行富文本，这里复用了多行富文本的逻辑，所以这里只进行 token 拆分
 */
export function drawSingleLineRichText(
  excelRender: ExcelRender,
  sheet: Sheet,
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  dataProvider: IDataProvider,
  fontStyle: FontStyle,
  richTexts: IRElt[],
  x: number,
  y: number,
  width: number,
  height: number,
  horizontal: ST_HorizontalAlignment,
  vertical: ST_VerticalAlignment,
  row: number
) {
  const defaultFont = genFontStr(fontStyle);

  const line: WrapLine = {
    tokens: [],
    maxHeight: 0
  };
  const lines: WrapLine[] = [line];

  const defaultFontHeight = dataProvider.getDefaultFontSize().height;
  let maxHeight = defaultFontHeight;
  let text = '';
  for (const richText of richTexts) {
    let font = defaultFont;
    if (richText.rPr && Object.keys(richText.rPr).length > 0) {
      font = genFontStrFromRPr(richText.rPr, fontStyle);
    }
    const textSize = measureTextWithCache(ctx, font, richText.t);
    const textWidth = textSize.width;
    // 字体高度
    const textFontHeight = textSize.height;
    if (textFontHeight > maxHeight) {
      maxHeight = textFontHeight;
    }
    text += richText.t;
    line.tokens.push({
      type: 'w',
      t: richText.t,
      rPr: richText.rPr,
      w: textWidth
    });
  }
  line.maxHeight = maxHeight;
  const padding = 0;
  drawMultiLineText(
    excelRender,
    sheet,
    ctx,
    dataProvider,
    fontStyle,
    lines,
    x,
    y,
    width,
    height,
    padding,
    horizontal,
    vertical,
    text,
    row
  );
}

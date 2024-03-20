import {FontStyle} from '../../types/FontStyle';
import {IRPrElt} from '../../types/IRPrElt';
import {checkFont} from './checkFont';

/**
 * 生成字体字符串
 * @param fontStyle
 */
export function genFontStr(fontStyle: FontStyle): string {
  let font = '';
  let family = fontStyle.family;

  checkFont(family);

  if (fontStyle.b) {
    font += 'bold ';
  }
  if (fontStyle.i) {
    font += 'italic ';
  }

  // TODO: underline 等需要自己绘制

  // 字体字体大小需要放在后面？
  if (fontStyle.size) {
    font += `${fontStyle.size * 1.333}px `;
  }

  font += family;
  return font;
}

/**
 * rPr 转换为字体样式
 */
export function rPrToFontStyle(rPr: IRPrElt) {
  let fontStyle: Partial<FontStyle> = {};
  if (rPr.b) {
    fontStyle.b = true;
  }
  if (rPr.i) {
    fontStyle.i = true;
  }
  if (rPr.sz) {
    fontStyle.size = rPr.sz;
  }
  if (rPr.rFont) {
    fontStyle.family = rPr.rFont;
  }
  return fontStyle;
}

/**
 * 合并 rPr 和默认字体
 */
export function mergeRPrWithDefaultFont(rPr: IRPrElt, defaultFont: FontStyle) {
  const fontStyle = rPrToFontStyle(rPr);
  return {
    ...defaultFont,
    ...fontStyle
  };
}

/**
 * 基于 rPr 生成字体字符串
 * @param defaultFont 默认字体样式
 */
export function genFontStrFromRPr(rPr: IRPrElt, defaultFont: FontStyle) {
  // 其实不知道是不是要合并默认字体
  return genFontStr(mergeRPrWithDefaultFont(rPr, defaultFont));
}

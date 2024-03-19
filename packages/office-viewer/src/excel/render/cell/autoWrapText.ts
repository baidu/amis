/**
 * 自动换行
 */

import {stringToArray} from '../../../util/stringToArray';
import {FontStyle} from '../../types/FontStyle';

import {IRElt} from '../../types/IRElt';
import {genFontStr, genFontStrFromRPr} from './genFontStr';
import {measureTextWithCache} from './measureTextWithCache';
import {Token, tokenizer} from './tokenizer';

/**
 * 拆分出来每一行的数据
 */
export interface WrapLine {
  tokens: Token[];
  /**
   * 最大高度，减少后续计算，这个结果可能为 0，这时需要加上默认字体高度
   */
  maxHeight: number;
}

/**
 * 自动折行
 * @param ctx canvas context
 * @param text 文字
 * @param fontStyle 字体样式
 * @returns 拆分的行，有可能空行
 */
export function autoWrapText(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  text: string | IRElt[],
  width: number,
  fontStyle: FontStyle
) {
  ctx.save();

  let tokens: Token[] = [];
  const lines: WrapLine[] = [];

  if (typeof text === 'string') {
    tokens = tokenizer(text);
  } else {
    for (const t of text) {
      const newTokens = tokenizer(t.t);
      newTokens.forEach(token => {
        token.rPr = t.rPr;
      });
      tokens = tokens.concat(newTokens);
    }
  }
  // 限制一千 token 避免性能问题
  if (tokens.length > 1000) {
    tokens = tokens.slice(0, 1000);
  }
  const defaultFont = genFontStr(fontStyle);
  let currentWidth = 0;
  // 计算默认字体高度
  const defaultSize = measureTextWithCache(ctx, defaultFont, '1');
  const defaultFontHeight = defaultSize.fontHeight;
  let currentMaxHeight = defaultFontHeight;
  let currentToken: Token[] = [];

  function pushToken(newToken?: Token) {
    lines.push({
      tokens: currentToken,
      maxHeight: currentMaxHeight
    });
    if (newToken) {
      currentToken = [newToken];
    } else {
      currentToken = [];
    }

    currentWidth = 0;
    currentMaxHeight = defaultFontHeight;
  }
  for (const token of tokens) {
    let font = defaultFont;
    if (token.type === 'br') {
      pushToken();
      continue;
    }
    if (token.rPr && Object.keys(token.rPr).length > 0) {
      font = genFontStrFromRPr(token.rPr, fontStyle);
    }
    const size = measureTextWithCache(ctx, font, token.t);

    const tokenWidth = size.width;
    // 字体高度
    const tokenFontHeight = size.fontHeight;
    token.w = tokenWidth;
    if (tokenFontHeight > currentMaxHeight) {
      currentMaxHeight = tokenFontHeight;
    }

    // 如果这一行宽度就比要求高度宽了，那还得拆分，这时就只能一个个字母算了
    if (tokenWidth > width) {
      let currentText = '';
      // 当前拆分出来的文字宽度
      let currentSplitWidth = 0;
      for (const char of stringToArray(token.t)) {
        // 避免太多 token，这里会对 token 进行合并
        const charSize = measureTextWithCache(ctx, font, char);
        const charWidth = charSize.width;
        if (currentWidth + charWidth > width) {
          const splitToken = {
            ...token,
            w: currentSplitWidth,
            t: currentText
          };
          currentToken.push(splitToken);
          // 后面会处理新行
          pushToken();
          currentText = char;
          currentWidth = charWidth;
          currentSplitWidth = charWidth;
          currentMaxHeight = currentMaxHeight;
        } else {
          currentWidth += charWidth;
          currentSplitWidth += charWidth;
          currentText += char;
        }
      }
      if (currentText) {
        const splitToken = {
          ...token,
          w: currentSplitWidth,
          t: currentText
        };
        currentToken.push(splitToken);
      }
    } else if (currentWidth + tokenWidth > width) {
      pushToken(token);
    } else {
      currentWidth += size.width;
      currentToken.push(token);
    }
  }
  if (currentToken.length) {
    lines.push({
      tokens: currentToken,
      maxHeight: currentMaxHeight
    });
  }

  ctx.restore();
  return lines;
}

/**
 * 包括 rPr 及 pPr 的解析，参考了 docxjs 里的实现
 */

import {LengthUsage} from './parseSize';
import {CSSStyle} from '../openxml/Style';
import {addClassName, createElement, setStyle} from '../util/dom';
import Word from '../Word';
import {
  WAttr,
  WTag,
  XMLData,
  XMLKeys,
  loopChildren,
  getVal,
  getValBoolean
} from '../OpenXML';
import {parseBorder, parseBorders} from './parseBorder';
import {parseColor, parseColorAttr} from './parseColor';
import {parseInd} from './parseInd';
import {parseSize} from './parseSize';
import {parseSpacing} from './parseSpacing';
import {parseFont} from './parseFont';

/** 将 jc 转成 text-align
 *
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/ST_Jc.html
 */
function jcToTextAlign(jc: string) {
  switch (jc) {
    case 'start':
    case 'left':
      return 'left';
    case 'center':
      return 'center';
    case 'end':
    case 'right':
      return 'right';
    case 'both':
      return 'justify';
    default:
      'left';
  }
  return jc;
}

/**
 * 解析 underline 并附上样式
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/u.html
 */
function parseUnderline(word: Word, data: XMLData, style: CSSStyle) {
  const val = data[WAttr.val];

  if (val == null) return;

  switch (val) {
    case 'dash':
    case 'dashDotDotHeavy':
    case 'dashDotHeavy':
    case 'dashedHeavy':
    case 'dashLong':
    case 'dashLongHeavy':
    case 'dotDash':
    case 'dotDotDash':
      style['text-decoration-style'] = 'dashed';
      break;

    case 'dotted':
    case 'dottedHeavy':
      style['text-decoration-style'] = 'dotted';
      break;

    case 'double':
      style['text-decoration-style'] = 'double';
      break;

    case 'single':
    case 'thick':
      style['text-decoration'] = 'underline';
      break;

    case 'wave':
    case 'wavyDouble':
    case 'wavyHeavy':
      style['text-decoration-style'] = 'wavy';
      break;

    case 'words':
      style['text-decoration'] = 'underline';
      break;

    case 'none':
      style['text-decoration'] = 'none';
      break;
  }

  const color = parseColorAttr(word, data);

  if (color) {
    style['text-decoration-color'] = color;
  }
}

function parseMargin(data: XMLData, style: CSSStyle) {
  loopChildren(data, (key, value) => {
    if (typeof value !== 'object') {
      return;
    }
    switch (key) {
      case 'left':
        style['padding-left'] = parseSize(value, WAttr.w);
        break;

      case 'right':
        style['padding-right'] = parseSize(value, WAttr.w);
        break;

      case 'top':
        style['padding-top'] = parseSize(value, WAttr.w);
        break;

      case 'bottom':
        style['padding-bottom'] = parseSize(value, WAttr.w);
        break;
    }
  });
}

/**
 * 目前只有部分支持
 * http://officeopenxml.com/WPparagraph-textFrames.php
 */
function parseFrame(data: XMLData, style: CSSStyle) {
  for (const key in data) {
    const value = data[key as XMLKeys];
    switch (key) {
      case WAttr.dropCap:
        if (value === 'drop') {
          style['float'] = 'left';
        }
        break;

      case WAttr.h:
        if (typeof value === 'object' && !Array.isArray(value)) {
          style['height'] = parseSize(value, WAttr.h);
        }

      case WAttr.w:
        if (typeof value === 'object' && !Array.isArray(value)) {
          style['width'] = parseSize(value, WAttr.w);
        }

      default:
        console.warn('parseFrame: unknown attribute ' + key);
    }
  }
}

const HighLightColor = 'transparent';

/**
 * 解析各种 Pr，返回样式
 * @param type 所属类型
 * @returns 样式
 */
export function parsePr(word: Word, data: XMLData, type: 'r' | 'p' = 'p') {
  let style: CSSStyle = {};
  loopChildren(data, (key, value) => {
    switch (key) {
      case WTag.sz:
      case WTag.szCs:
        style['font-size'] = parseSize(
          value as XMLData,
          WAttr.val,
          LengthUsage.FontSize
        );
        break;

      case WTag.jc:
        style['text-align'] = jcToTextAlign(
          (value as XMLData)[WAttr.val] as string
        );
        break;

      case WTag.framePr:
        parseFrame(value as XMLData, style);
        break;

      case WTag.pBdr:
      case WTag.tblBorders:
      case WTag.pBdr:
      case WTag.tcBorders:
        parseBorders(word, value as XMLData, style);
        break;

      case WTag.ind:
      case WTag.tblInd:
        parseInd(value as XMLData, style);
        break;

      case WTag.color:
        style['color'] = parseColor(word, value as XMLData);
        break;

      case WTag.shd:
        // 如果已经有设置说明是 highlight
        if (!('background-color' in style)) {
          // http://officeopenxml.com/WPshading.php
          style['background-color'] = parseColorAttr(
            word,
            value as XMLData,
            WAttr.fill,
            'inherit'
          );
          break;
        }

      case WTag.spacing:
        parseSpacing(value as XMLData, style);
        break;

      case WTag.highlight:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/highlight.html
        // 这个按文档是重要性高于 shd
        style['background-color'] = parseColorAttr(
          word,
          value as XMLData,
          WAttr.fill,
          HighLightColor
        );
        break;

      case WTag.vertAlign:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/vertAlign.html
        // 这个和 position 有冲突，所以先换成后面的 sub sup 标签实现了
        break;

      case WTag.position:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/position.html
        style['vertical-align'] = parseSize(
          value as XMLData,
          WAttr.val,
          LengthUsage.FontSize
        );
        break;

      case WTag.trHeight:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/trHeight.html
        const trHeight = value as XMLData;
        const height = parseSize(trHeight, WAttr.val);
        const hRule = trHeight[WAttr.hRule];
        if (hRule === 'exact') {
          style['height'] = height;
        } else if (hRule === 'atLeast') {
          // tr 设置 min-height 似乎是没效果的
          style['height'] = height;
          style['min-height'] = height;
        }
        break;
      case WTag.strike:
      case WTag.dstrike:
        // 其实不支持 dstrike，都统一为 strike
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/dstrike.html
        style['text-decoration'] = getValBoolean(value)
          ? 'line-through'
          : 'none';

      case WTag.b:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/b.html
        style['font-weight'] = getValBoolean(value) ? 'bold' : 'normal';
        break;

      case WTag.bCs:
      case WTag.iCs:
        // 忽略，因为 CSS 没法按这个判断
        break;

      case WTag.i:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/i.html
        style['font-style'] = getValBoolean(value) ? 'italic' : 'normal';
        break;

      case WTag.caps:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/caps.html
        style['text-transform'] = getValBoolean(value) ? 'uppercase' : 'normal';
        break;

      case WTag.smallCaps:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/smallCaps.html
        style['text-transform'] = getValBoolean(value) ? 'lowercase' : 'normal';
        break;

      case WTag.u:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/u.html
        parseUnderline(word, value as XMLData, style);
        break;

      case WTag.rFonts:
        parseFont(value as XMLData, style);
        break;

      case WTag.tblCellSpacing:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblCellSpacing_1.html
        style['border-spacing'] = parseSize(value as XMLData, WAttr.w);
        style['border-collapse'] = 'separate';
        break;

      case WTag.bdr:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/bdr.html
        style['border'] = parseBorder(word, value as XMLData);
        break;

      case WTag.vanish:
        if (getValBoolean(value)) {
          // 这里其实没试过 word 里到底是不是 none
          style['display'] = 'none';
        }
        break;

      case WTag.kern:
        style['letter-spacing'] = parseSize(
          value as XMLData,
          WAttr.val,
          LengthUsage.FontSize
        );
        break;

      case WTag.tblCellMar:
      case WTag.tcMar:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblCellMar_1.html
        parseMargin(value as XMLData, style);
        break;

      case WTag.tblLayout:
        break;

      case WTag.pStyle:
        // 这个需要特殊处理
        break;

      case WTag.lang:
      case WTag.noProof:
        // 用于拼写检查
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/lang.html
        break;

      case WTag.keepLines:
      case WTag.keepNext:
      case WTag.widowControl:
      case WTag.pageBreakBefore:
        // 用于分页的场景，目前还不支持 TODO:
        break;

      case WTag.outlineLvl:
        // 似乎是用于目录的，目前还不支持
        break;

      case WTag.contextualSpacing:
        // 还没空看
        break;

      default:
        console.warn('parsePr Unknown key', key);
    }
  });

  return style;
}

/**
 * 这个应该是通用 class
 * http://officeopenxml.com/WPstyleParStyles.php
 * @returns 如果找不到就返回空字符串
 */
export function getPStyle(data: XMLData) {
  if (WTag.pStyle in data) {
    const pStyle = data[WTag.pStyle];
    if (typeof pStyle === 'object' && WAttr.val in pStyle) {
      return pStyle[WAttr.val] as string;
    }
  }
  return '';
}

/**
 * 将样式应用到元素上，调用这个函数必须将返回结果赋值回 element
 * @param element
 * @param data
 * @return 封装后的元素
 */
export function applyStyle(
  word: Word,
  element: HTMLElement,
  pr: XMLData
): HTMLElement {
  const style = parsePr(word, pr);
  setStyle(element, style);

  addClassName(element, word.getStyleIdDisplayName(getPStyle(pr)));

  if (WTag.vertAlign in pr) {
    const vertAlign = pr[WTag.vertAlign];
    if (typeof vertAlign === 'object' && WAttr.val in vertAlign) {
      const val = vertAlign[WAttr.val];
      if (val === 'superscript') {
        const sup = createElement('sup');
        element.appendChild(sup);
        return sup;
      } else if (val === 'subscript') {
        const sub = createElement('sub');
        element.appendChild(sub);
        return sub;
      }
    }
  }

  return element;
}

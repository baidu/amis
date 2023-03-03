/**
 * 包括 rPr 及 pPr 的解析，参考了 docxjs 里的实现
 */

import {LengthUsage} from './parseSize';
import {CSSStyle} from '../parts/Style';
import {createElement, setStyle} from '../util/dom';
import {loopChildren} from '../util/xml';
import Word from '../Word';
import {WAttr, WTag} from './Names';
import {parseBorder, parseBorders} from './parseBorder';
import {parseColor, parseColorAttr} from './parseColor';
import {parseInd} from './parseInd';
import {parseSize} from './parseSize';
import {parseSpacing} from './parseSpacing';
import {parseFont} from './parseFont';
import {normalizeBoolean} from './normalizeBoolean';

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
function parseUnderline(data: any, style: CSSStyle) {
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

  const color = parseColorAttr(data);

  if (color) {
    style['text-decoration-color'] = color;
  }
}

function parseMargin(data: any, style: CSSStyle) {
  loopChildren(data, (key, value) => {
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

const HighLightColor = 'transparent';

/**
 * 解析各种 Pr，返回样式
 * @param type 所属类型
 * @returns 样式
 */
export function parsePr(data: any, type: 'r' | 'p' = 'p') {
  let style: CSSStyle = {};
  loopChildren(data, (key, value) => {
    switch (key) {
      case WTag.sz:
      case WTag.szCs:
        style['font-size'] = parseSize(value, WAttr.val, LengthUsage.FontSize);
        break;

      case WTag.jc:
        style['text-align'] = jcToTextAlign(value[WAttr.val]);
        break;

      case WTag.pBdr:
      case WTag.tblBorders:
      case WTag.pBdr:
      case WTag.tcBorders:
        parseBorders(value, style);
        break;

      case WTag.ind:
      case WTag.tblInd:
        parseInd(value, style);
        break;

      case WTag.color:
        style['color'] = parseColor(value);
        break;

      case WTag.shd:
        // 如果已经有设置说明是 highlight
        if (!('background-color' in style)) {
          // http://officeopenxml.com/WPshading.php
          style['background-color'] = parseColorAttr(
            value,
            WAttr.fill,
            'inherit'
          );
          break;
        }

      case WTag.spacing:
        parseSpacing(value, style);
        break;

      case WTag.highlight:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/highlight.html
        // 这个按文档是重要性高于 shd
        style['background-color'] = parseColorAttr(
          value,
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
          value,
          WAttr.val,
          LengthUsage.FontSize
        );
        break;

      case WTag.trHeight:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/trHeight.html
        const trHeight = parseSize(value, WAttr.val);
        const hRule = value[WAttr.hRule];
        if (hRule === 'exact') {
          style['height'] = trHeight;
        } else if (hRule === 'atLeast') {
          // tr 设置 min-height 似乎是没效果的
          style['height'] = trHeight;
          style['min-height'] = trHeight;
        }
        break;
      case WTag.strike:
      case WTag.dstrike:
        // 其实不支持 dstrike，都统一为 strike
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/dstrike.html
        style['text-decoration'] = normalizeBoolean(value[WAttr.val], true)
          ? 'line-through'
          : 'none';

      case WTag.b:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/b.html
        style['font-weight'] = normalizeBoolean(value[WAttr.val], true)
          ? 'bold'
          : 'normal';
        break;

      case WTag.bCs:
      case WTag.iCs:
        // 忽略，因为 CSS 没法按这个判断
        break;

      case WTag.i:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/i.html
        style['font-style'] = normalizeBoolean(value[WAttr.val], true)
          ? 'italic'
          : 'normal';
        break;

      case WTag.caps:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/caps.html
        style['text-transform'] = normalizeBoolean(value[WAttr.val], true)
          ? 'uppercase'
          : 'normal';
        break;

      case WTag.smallCaps:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/smallCaps.html
        style['text-transform'] = normalizeBoolean(value[WAttr.val], true)
          ? 'lowercase'
          : 'normal';
        break;

      case WTag.u:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/u.html
        parseUnderline(value, style);
        break;

      case WTag.rFonts:
        style['font-family'] = parseFont(value);
        break;

      case WTag.tblCellSpacing:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblCellSpacing_1.html
        style['border-spacing'] = parseSize(value, WAttr.w);
        style['border-collapse'] = 'separate';
        break;

      case WTag.bdr:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/bdr.html
        style['border'] = parseBorder(value);
        break;

      case WTag.vanish:
        if (normalizeBoolean(value[WAttr.val], true)) {
          // 这里其实没试过 word 里到底是不是 none
          style['display'] = 'none';
        }
        break;

      case WTag.kern:
        style['letter-spacing'] = parseSize(
          value,
          WAttr.val,
          LengthUsage.FontSize
        );
        break;

      case WTag.tblCellMar:
      case WTag.tcMar:
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblCellMar_1.html
        parseMargin(value, style);
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
export function getPStyle(data: any) {
  if (WTag.pStyle in data) {
    return data[WTag.pStyle][WAttr.val];
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
  pr: any
): HTMLElement {
  const style = parsePr(pr);
  setStyle(element, style);

  const className = word.getClassName(getPStyle(pr));
  if (className) {
    element.className = className;
  }

  if (WTag.vertAlign in pr) {
    const val = pr[WTag.vertAlign][WAttr.val];
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

  return element;
}

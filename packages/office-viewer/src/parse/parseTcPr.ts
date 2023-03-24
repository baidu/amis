import {CSSStyle} from '../openxml/Style';
import {TcPr} from '../openxml/word/table/Tc';
import Word from '../Word';
import {parseCellMargin} from './parseCellMargin';
import {parseShdColor} from './parseColor';
import {getVal, getValBoolean, getValNumber} from '../OpenXML';
import {ST_Merge, ST_TblWidth, ST_VerticalJc} from '../openxml/Types';
import {parseSize, LengthUsage} from './parseSize';
import {parseBorders} from './parseBorder';
import {parseTextDirection} from './parseTextDirection';
import {parseTblWidth} from './parseTblWidth';
import {parseInsideBorders} from './parseInsideBorders';

function parseVAlign(element: Element, style: CSSStyle) {
  const vAlign = getVal(element) as ST_VerticalJc;

  switch (vAlign) {
    case 'bottom':
      style['vertical-align'] = 'bottom';
      break;

    case 'center':
      style['vertical-align'] = 'middle';
      break;

    case 'top':
      style['vertical-align'] = 'top';
      break;
  }
}

export function parseTblCellSpacing(element: Element, style: CSSStyle) {
  const width = parseTblWidth(element);
  if (width) {
    style['cell-spacing'] = width;
  }
}

function parseTcW(element: Element, style: CSSStyle) {
  const width = parseTblWidth(element);
  if (width) {
    style.width = width;
  }
}

export function parseTcPr(word: Word, element: Element) {
  const properties: TcPr = {};
  const style: CSSStyle = {};
  properties.cssStyle = style;

  for (const child of element.children) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'w:tcMar':
        parseCellMargin(child, style);
        break;

      case 'w:shd':
        style['background-color'] = parseShdColor(word, child);
        break;

      case 'w:tcW':
        parseTcW(child, style);
        break;

      case 'w:noWrap':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/noWrap.html
        const noWrap = getValBoolean(child);
        if (noWrap) {
          style['white-space'] = 'nowrap';
        }
        break;

      case 'w:vAlign':
        parseVAlign(child, style);
        break;

      case 'w:tcBorders':
        parseBorders(word, child, style);
        properties.insideBorder = parseInsideBorders(word, child);
        break;

      case 'w:gridSpan':
        properties.gridSpan = getValNumber(child);
        break;

      case 'w:vMerge':
        properties.vMerge = (getVal(child) as ST_Merge) || 'continue';
        break;

      case 'w:textDirection':
        parseTextDirection(child, style);
        break;

      case 'w:cnfStyle':
        // 目前是自动计算的，所以不需要这个了
        break;

      case 'w:hideMark':
        properties.hideMark = getValBoolean(child, true);
        break;

      default:
        console.warn('parseTcPr: ignore', tagName, child);
    }
  }

  return properties;
}

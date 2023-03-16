import {getValBoolean, getValNumber, getVal} from '../../../OpenXML';
import Word from '../../../Word';
import {CSSStyle} from '../../Style';
import {Paragraph} from '../Paragraph';
import {Table} from '../Table';
import {LengthUsage, parseSize} from '../../../parse/parseSize';
import {parseColorAttr, parseShdColor} from '../../../parse/parseColor';
import {parseBorder, parseBorders} from '../../../parse/parseBorder';
import {ST_Merge, ST_TblWidth, ST_VerticalJc} from '../../Types';

export interface TcPr {
  cssStyle?: CSSStyle;

  // 如果为 true 的话就不自动加空格
  hideMark?: false;

  vMerge?: ST_Merge;

  gridSpan?: number;

  rowSpan?: number;

  /**
   * 内部 border，需要作用于非第一列的单元格
   */
  insideBorder?: {
    H?: string;
    V?: string;
  };
}

type TcChild = Paragraph | Table;

// http://officeopenxml.com/WPtableCellProperties-Margins.php
export function parseCellMargin(element: Element, style: CSSStyle) {
  for (const child of element.children) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'w:left':
      case 'w:start':
        style['padding-left'] = parseSize(child, 'w:w');
        break;

      case 'w:right':
      case 'w:end':
        style['padding-right'] = parseSize(child, 'w:w');
        break;

      case 'w:top':
        style['padding-top'] = parseSize(child, 'w:w');
        break;

      case 'w:bottom':
        style['padding-bottom'] = parseSize(child, 'w:w');
        break;
    }
  }
}

function parseVAlign(element: Element, style: CSSStyle) {
  const vAlign = getVal(element) as ST_VerticalJc;

  switch (vAlign) {
    case ST_VerticalJc.bottom:
      style['vertical-align'] = 'bottom';
      break;

    case ST_VerticalJc.center:
      style['vertical-align'] = 'middle';
      break;

    case ST_VerticalJc.top:
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

/**
 * parseBorders 不支持 insideH 和 insideV，所以单独支持一下
 * 实际显示时需要过滤掉第一列
 */
export function parseInsideBorders(word: Word, element: Element) {
  let H;
  const insideH = element.querySelector('insideH');
  if (insideH) {
    H = parseBorder(word, insideH);
  }

  let V;
  const insideV = element.querySelector('insideV');
  if (insideV) {
    V = parseBorder(word, insideV);
  }

  return {
    H,
    V
  };
}

/**
 * http://officeopenxml.com/WPtableWidth.php
 */
export function parseTblWidth(element: Element) {
  const type = element.getAttribute('w:type') as ST_TblWidth;
  if (!type || type === ST_TblWidth.dxa) {
    return parseSize(element, 'w:w');
  } else if (type === ST_TblWidth.pct) {
    return parseSize(element, 'w:w', LengthUsage.Percent);
  } else if (type === ST_TblWidth.auto) {
    return 'auto';
  } else {
    console.warn('parseTblWidth: ignore type', type, element);
  }
  return '';
}

function parseTcW(element: Element, style: CSSStyle) {
  const width = parseTblWidth(element);
  if (width) {
    style.width = width;
  }
}

export class Tc {
  properties: TcPr = {};
  children: TcChild[] = [];

  add(child: TcChild) {
    if (child) {
      this.children.push(child);
    }
  }

  static parseTcPr(word: Word, element: Element) {
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
          properties.vMerge = (getVal(child) as ST_Merge) || ST_Merge.continue;
          break;

        default:
          console.warn('parseTcPr: ignore', tagName, child);
      }
    }

    return properties;
  }

  static fromXML(
    word: Word,
    element: Element,
    colIndex: number,
    rowSpanMap: {[key: string]: Tc}
  ): Tc | null {
    const tc = new Tc();

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:tcPr':
          tc.properties = Tc.parseTcPr(word, child);
          break;

        case 'w:p':
          tc.add(Paragraph.fromXML(word, child));
          break;

        case 'w:tbl':
          tc.add(Table.fromXML(word, child));
          break;
      }
    }

    // 如果是 continue 意味着这个被合并了
    if (tc.properties.vMerge === ST_Merge.continue) {
      const lastCol = rowSpanMap[colIndex];
      if (lastCol && lastCol.properties && lastCol.properties.rowSpan) {
        lastCol.properties.rowSpan = lastCol.properties.rowSpan + 1;
      } else {
        console.warn(
          'Tc.fromXML: continue but not found lastCol',
          colIndex,
          tc,
          rowSpanMap
        );
      }
      return null;
    } else if (tc.properties.vMerge === ST_Merge.restart) {
      tc.properties.rowSpan = 1;
      rowSpanMap[colIndex] = tc;
    }

    return tc;
  }
}

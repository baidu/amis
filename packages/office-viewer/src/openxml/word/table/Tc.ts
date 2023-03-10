import {
  loopChildren,
  XMLData,
  WTag,
  WAttr,
  getValBoolean,
  getValNumber,
  getVal
} from '../../../OpenXML';
import Word from '../../../Word';
import {CSSStyle} from '../../Style';
import {Paragraph} from '../Paragraph';
import {Table} from '../Table';
import {LengthUsage, parseSize} from '../../../parse/parseSize';
import {parseColorAttr} from '../../../parse/parseColor';
import {parseBorders} from '../../../parse/parseBorder';
import {ST_Merge, ST_TblWidth, ST_VerticalJc} from '../../Types';

export interface TcProperties {
  cssStyle?: CSSStyle;

  // 如果为 true 的话就不自动加空格
  hideMark?: false;

  vMerge?: ST_Merge;

  gridSpan?: number;

  rowSpan?: number;
}

type TcChild = Paragraph | Table;

export function parseCellMargin(data: XMLData, style: CSSStyle) {
  loopChildren(data, (key, value) => {
    if (typeof value !== 'object') {
      return;
    }
    switch (key) {
      case 'left':
      case 'start':
        style['padding-left'] = parseSize(value, WAttr.w);
        break;

      case 'right':
      case 'end':
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

function parseVAlign(data: XMLData, style: CSSStyle) {
  const vAlign = data[WAttr.val] as ST_VerticalJc;

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

/**
 * http://officeopenxml.com/WPtableWidth.php
 */
export function parseTblWidth(data: XMLData) {
  const type = data[WAttr.type] as ST_TblWidth;
  if (!type || type === ST_TblWidth.dxa) {
    return parseSize(data, WAttr.w);
  } else if (type === ST_TblWidth.pct) {
    return parseSize(data, WAttr.w, LengthUsage.Percent);
  } else {
    console.warn('parseTblWidth: ignore type', type);
  }
  return '';
}

function parseTcW(data: XMLData, style: CSSStyle) {
  const width = parseTblWidth(data);
  if (width) {
    style.width = width;
  }
}

export class Tc {
  properties: TcProperties = {};
  children: TcChild[] = [];

  add(child: TcChild) {
    if (child) {
      this.children.push(child);
    }
  }

  static parseTcProperties(word: Word, xml: XMLData) {
    const properties: TcProperties = {};
    const style: CSSStyle = {};
    properties.cssStyle = style;

    loopChildren(xml, (key, value) => {
      switch (key) {
        case WTag.tcMar:
          parseCellMargin(value as XMLData, style);
          break;

        case WTag.shd:
          style['background-color'] = parseColorAttr(
            word,
            value as XMLData,
            WAttr.fill,
            'inherit'
          );
          break;

        case WTag.tcW:
          parseTcW(value as XMLData, style);
          break;

        case WTag.noWrap:
          // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/noWrap.html
          const noWrap = getValBoolean(value);
          if (noWrap) {
            style['white-space'] = 'nowrap';
          }
          break;

        case WTag.vAlign:
          parseVAlign(value as XMLData, style);
          break;

        case WTag.tcBorders:
          parseBorders(word, value as XMLData, style);
          break;

        case WTag.gridSpan:
          properties.gridSpan = getValNumber(value);
          break;

        case WTag.vMerge:
          properties.vMerge = (getVal(value) as ST_Merge) || ST_Merge.continue;
          break;

        default:
          console.warn('parseTcProperties: ignore', key);
      }
    });
    return properties;
  }

  static fromXML(
    word: Word,
    xml: XMLData,
    colIndex: number,
    rowSpanMap: {[key: string]: Tc}
  ): Tc | null {
    const tc = new Tc();

    loopChildren(xml, (key, value) => {
      switch (key) {
        case WTag.tcPr:
          tc.properties = Tc.parseTcProperties(word, value as XMLData);
          break;

        case WTag.p:
          tc.add(Paragraph.fromXML(word, value as XMLData));
          break;

        case WTag.tbl:
          tc.add(Table.fromXML(word, value as XMLData));
          break;
      }
    });

    // 如果是 continue 意味着这个被合并了
    if (tc.properties.vMerge === ST_Merge.continue) {
      const lastCol = rowSpanMap[colIndex];
      if (lastCol && lastCol.properties && lastCol.properties.rowSpan) {
        lastCol.properties.rowSpan = lastCol.properties.rowSpan + 1;
      } else {
        console.warn('Tc.fromXML: continue but not found lastCol', colIndex);
      }
      return null;
    } else if (tc.properties.vMerge === ST_Merge.restart) {
      tc.properties.rowSpan = 1;
      rowSpanMap[colIndex] = tc;
    }

    return tc;
  }
}

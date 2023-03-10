/**
 * http://officeopenxml.com/WPtable.php
 */

import {getVal, loopChildren, WTag, WAttr, XMLData} from '../../OpenXML';
import {parseBorder, parseBorders} from '../../parse/parseBorder';
import {parseColorAttr} from '../../parse/parseColor';
import {LengthUsage, parseSize} from '../../parse/parseSize';
import Word from '../../Word';
import {CSSStyle} from '../Style';
import {ST_TblLayoutType, ST_TblWidth} from '../Types';
import {parseCellMargin, parseTblWidth, Tc} from './table/Tc';
import {Tr} from './table/Tr';

export interface TableProperties {
  tblCaption?: string;

  tblStyle?: string;
  /**
   * 表格最外层样式
   */
  tblCSSStyle?: CSSStyle;

  /**
   * 单元格样式
   */
  tcCSSStyle?: CSSStyle;

  /**
   * 内部 border，需要作用于非第一列的单元格
   */
  insideBorder?: {
    H?: string;
    V?: string;
  };
}

/**
 * 表格的 jc 需要使用 float 来实现
 * http://officeopenxml.com/WPtableAlignment.php
 */
function parseTblJc(value: XMLData, cssStyle: CSSStyle) {
  const val = getVal(value);
  switch (val) {
    case 'left':
    case 'start':
      cssStyle['float'] = 'left';
      break;
    case 'right':
    case 'end':
      cssStyle['float'] = 'right';
  }
}

/**
 * parseBorders 不支持 insideH 和 insideV，所以单独支持一下
 * 实际显示时需要过滤掉第一列
 */
function parseInsideBorders(word: Word, data: XMLData) {
  let H;
  if (WTag.insideH) {
    H = parseBorder(word, data[WTag.insideV] as XMLData);
  }

  let V;
  if (WTag.insideV) {
    V = parseBorder(word, data[WTag.insideH] as XMLData);
  }

  return {
    H,
    V
  };
}

/**
 * 这个其实分左右，但目前只支持左，右可能是阿拉伯语？
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblInd_2.html
 */
function parseTblInd(data: XMLData, style: CSSStyle) {
  const width = parseTblWidth(data);
  if (width) {
    style['margin-left'] = width;
  }
}

function parseTblW(data: XMLData, style: CSSStyle) {
  const width = parseTblWidth(data);
  if (width) {
    style['width'] = width;
  }
}

function parseTblCellSpacing(data: XMLData, style: CSSStyle) {
  const width = parseTblWidth(data);
  if (width) {
    style['cell-spacing'] = width;
  }
}

/**
 * http://officeopenxml.com/WPtableLayout.php
 */
function parseTblLayout(data: XMLData, style: CSSStyle) {
  const type = data[WAttr.type] as ST_TblLayoutType;

  if (type === ST_TblLayoutType.fixed) {
    style['table-layout'] = 'fixed';
  }
}

interface GridCol {
  w: string;
}

function parseTblGrid(data: XMLData) {
  const gridCol: GridCol[] = [];
  loopChildren(data, (key, value) => {
    if (key === WTag.gridCol && typeof value === 'object') {
      const w = parseSize(value, WAttr.w);
      gridCol.push({w});
    }
  });
  return gridCol;
}

export class Table {
  properties: TableProperties = {};
  tblGrid: GridCol[] = [];
  trs: Tr[] = [];

  static parseTableProperties(word: Word, data: XMLData): TableProperties {
    const properties: TableProperties = {};

    const tableStyle: CSSStyle = {};
    const tcStyle: CSSStyle = {};

    properties.tblCSSStyle = tableStyle;
    properties.tcCSSStyle = tcStyle;

    loopChildren(data, (key, value, attr) => {
      switch (key) {
        case WTag.tblBorders:
          parseBorders(word, attr, tableStyle);
          properties.insideBorder = parseInsideBorders(word, attr);
          break;

        case WTag.tcBorders:
          parseBorders(word, attr, tableStyle);
          break;

        case WTag.tblInd:
          parseTblInd(attr, tableStyle);
          break;

        case WTag.jc:
          parseTblJc(attr, tableStyle);
          break;

        case WTag.tblCellMar:
        case WTag.tcMar:
          // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblCellMar_1.html
          parseCellMargin(attr, tcStyle);
          break;

        case WTag.tblStyle:
          properties.tblStyle = getVal(value);
          break;

        case WTag.tblW:
          parseTblW(attr, tableStyle);
          break;

        case WTag.shd:
          // http://officeopenxml.com/WPtableShading.php
          tableStyle['background-color'] = parseColorAttr(
            word,
            attr,
            WAttr.fill,
            'inherit'
          );
          break;

        case WTag.tblCaption:
          properties.tblCaption = getVal(value);
          break;

        case WTag.tblCellSpacing:
          parseTblCellSpacing(attr, tableStyle);
          break;

        case WTag.tblLayout:
          parseTblLayout(attr, tableStyle);
          break;

        default:
          console.warn('parseTableProperties unknown tag', key);
      }
    });

    return properties;
  }

  static fromXML(word: Word, data: XMLData): Table {
    const table = new Table();

    // 用于计算列的跨行，这里记下前面的跨行情况
    const rowSpanMap: {[key: string]: Tc} = {};

    loopChildren(data, (key, value) => {
      switch (key) {
        case WTag.tblPr:
          table.properties = Table.parseTableProperties(word, value as XMLData);
          break;

        case WTag.tr:
          table.trs.push(Tr.fromXML(word, value as XMLData, rowSpanMap));
          break;

        case WTag.tblGrid:
          table.tblGrid = parseTblGrid(value as XMLData);
          break;

        default:
          console.warn('Table.fromXML unknown tag', key);
      }
    });

    return table;
  }
}

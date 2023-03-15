/**
 * http://officeopenxml.com/WPtable.php
 */

import {getAttrBoolean, getVal, getValBoolean, getValHex} from '../../OpenXML';
import {parseBorder, parseBorders} from '../../parse/parseBorder';
import {parseColorAttr} from '../../parse/parseColor';
import {LengthUsage, parseSize} from '../../parse/parseSize';
import Word from '../../Word';
import {CSSStyle} from '../Style';
import {
  CT_TblLook,
  ST_TblLayoutType,
  ST_TblStyleOverrideType,
  ST_TblWidth
} from '../Types';
import {parseCellMargin, parseTblWidth, Tc} from './table/Tc';
import {Properties} from './properties/Properties';
import {Tr} from './table/Tr';

export type CT_TblLookKey = keyof CT_TblLook;

export interface TableProperties extends Properties {
  /**
   * 表格标题
   */
  tblCaption?: string;

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

  /**
   * 条件格式
   */
  tblLook?: Record<CT_TblLookKey, boolean>;
}

/**
 * 表格的 jc 需要使用 float 来实现
 * http://officeopenxml.com/WPtableAlignment.php
 */
function parseTblJc(element: Element, cssStyle: CSSStyle) {
  const val = getVal(element);
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
function parseInsideBorders(word: Word, element: Element) {
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
 * 这个其实分左右，但目前只支持左，右可能是阿拉伯语？
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblInd_2.html
 */
function parseTblInd(element: Element, style: CSSStyle) {
  const width = parseTblWidth(element);
  if (width) {
    style['margin-left'] = width;
  }
}

function parseTblW(element: Element, style: CSSStyle) {
  const width = parseTblWidth(element);
  if (width) {
    style['width'] = width;
  }
}

function parseTblCellSpacing(element: Element, style: CSSStyle) {
  const width = parseTblWidth(element);
  if (width) {
    style['cell-spacing'] = width;
  }
}

/**
 * http://officeopenxml.com/WPtableLayout.php
 */
function parseTblLayout(element: Element, style: CSSStyle) {
  const type = element.getAttribute('w:type') as ST_TblLayoutType;

  if (type === ST_TblLayoutType.fixed) {
    style['table-layout'] = 'fixed';
  }
}

interface GridCol {
  w: string;
}

function parseTblGrid(element: Element) {
  const gridCol: GridCol[] = [];
  const gridColElements = element.getElementsByTagName('w:gridCol');
  for (const gridColElement of gridColElements) {
    const w = parseSize(gridColElement, 'w:w');
    gridCol.push({w});
  }
  return gridCol;
}

// http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/ST_TblStyleOverrideType.html
// val 是旧的格式
function parseTblLook(child: Element) {
  const tblLook: Record<CT_TblLookKey, boolean> = {} as Record<
    CT_TblLookKey,
    boolean
  >;
  const tblLookVal = getValHex(child);
  if (getAttrBoolean(child, 'firstRow', false) || tblLookVal & 0x0020) {
    tblLook['firstRow'] = true;
  }
  if (getAttrBoolean(child, 'lastRow', false) || tblLookVal & 0x0040) {
    tblLook['lastRow'] = true;
  }
  if (getAttrBoolean(child, 'firstColumn', false) || tblLookVal & 0x0080) {
    tblLook['firstColumn'] = true;
  }
  if (getAttrBoolean(child, 'lastColumn', false) || tblLookVal & 0x0100) {
    tblLook['lastColumn'] = true;
  }
  if (getAttrBoolean(child, 'noHBand', false) || tblLookVal & 0x0200) {
    tblLook['noHBand'] = true;
  } else {
    tblLook['noHBand'] = false;
  }
  if (getAttrBoolean(child, 'noVBand', false) || tblLookVal & 0x0400) {
    tblLook['noVBand'] = true;
  } else {
    tblLook['noHBand'] = false;
  }

  return tblLook;
}

export class Table {
  properties: TableProperties = {};
  tblGrid: GridCol[] = [];
  trs: Tr[] = [];

  static parseTableProperties(word: Word, element: Element): TableProperties {
    const properties: TableProperties = {};

    const tableStyle: CSSStyle = {};
    const tcStyle: CSSStyle = {};

    properties.tblLook = {} as Record<CT_TblLookKey, boolean>;

    properties.cssStyle = tableStyle;
    properties.tcCSSStyle = tcStyle;

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:tblBorders':
          parseBorders(word, child, tableStyle);
          properties.insideBorder = parseInsideBorders(word, child);
          break;

        case 'w:tcBorders':
          parseBorders(word, child, tableStyle);
          break;

        case 'w:tblInd':
          parseTblInd(child, tableStyle);
          break;

        case 'w:jc':
          parseTblJc(child, tableStyle);
          break;

        case 'w:tblCellMar':
        case 'w:tcMar':
          // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblCellMar_1.html
          parseCellMargin(child, tcStyle);
          break;

        case 'w:tblStyle':
          properties.pStyle = getVal(child);
          break;

        case 'w:tblW':
          parseTblW(child, tableStyle);
          break;

        case 'w:shd':
          // http://officeopenxml.com/WPtableShading.php
          tableStyle['background-color'] = parseColorAttr(
            word,
            child,
            'w:fill',
            'inherit'
          );
          break;

        case 'w:tblCaption':
          properties.tblCaption = getVal(child);
          break;

        case 'w:tblCellSpacing':
          parseTblCellSpacing(child, tableStyle);
          break;

        case 'w:tblLayout':
          parseTblLayout(child, tableStyle);
          break;

        case 'w:tblLook':
          properties.tblLook = parseTblLook(child);
          break;

        default:
          console.warn('parseTableProperties unknown tag', tagName);
      }
    }

    return properties;
  }

  static fromXML(word: Word, element: Element): Table {
    const table = new Table();

    // 用于计算列的跨行，这里记下前面的跨行情况
    const rowSpanMap: {[key: string]: Tc} = {};

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:tblPr':
          table.properties = Table.parseTableProperties(word, child);
          break;

        case 'w:tr':
          table.trs.push(Tr.fromXML(word, child, rowSpanMap));
          break;

        case 'w:tblGrid':
          table.tblGrid = parseTblGrid(child);
          break;

        default:
          console.warn('Table.fromXML unknown tag', tagName);
      }
    }

    return table;
  }
}

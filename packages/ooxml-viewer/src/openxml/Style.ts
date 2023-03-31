/**
 * 解析共享样式 Style
 */

import {parseTcPr} from '../parse/parseTcPr';
import {getVal} from '../OpenXML';
import Word from '../Word';
import {ST_StyleType, ST_TblStyleOverrideType} from './Types';
import {Paragraph, ParagraphPr} from './word/Paragraph';
import {Run, RunPr} from './word/Run';
import {TablePr} from './word/Table';
import {TcPr} from './word/table/Tc';
import {Tr, TrPr} from './word/table/Tr';
import {parseTablePr} from '../parse/parseTablePr';
import {parseTrPr} from '../parse/parseTrPr';

export interface CSSStyle {
  [key: string]: string | number;
}

// http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblStylePr.html
export interface TblStylePrStyle {
  // 文本
  rPr?: RunPr;

  // 段落
  pPr?: ParagraphPr;

  // 表格
  tblPr?: TablePr;

  // 行样式
  trPr?: TrPr;

  // 单元格样式
  tcPr?: TcPr;
}

/**
 * 单个样式定义
 */
export interface Style extends TblStylePrStyle {
  id?: string;
  type?: ST_StyleType;
  name?: string;
  basedOn?: string;

  tblStylePr?: Record<ST_TblStyleOverrideType, TblStylePrStyle>;
}

/**
 * 所有样式定义及默认样式
 */
export interface Styles {
  // 方便根据 id 获取 样式
  styleMap: Record<string, Style>;

  defaultStyle?: Style;
}

/**
 * 解析默认样式 docDefaults
 */
function parseDefaultStyle(word: Word, element: Element | null) {
  const defaultStyle: Style = {};
  if (!element) {
    return defaultStyle;
  }
  const rPrDefault = element.getElementsByTagName('w:rPrDefault').item(0);
  if (rPrDefault) {
    const rPr = rPrDefault.getElementsByTagName('w:rPr').item(0);
    if (rPr) {
      defaultStyle.rPr = Run.parseRunPr(word, rPr);
    }
  }
  const pPrDefault = element.getElementsByTagName('w:pPrDefault').item(0);
  if (pPrDefault) {
    const pPr = pPrDefault.getElementsByTagName('w:pPr').item(0);
    if (pPr) {
      defaultStyle.pPr = Paragraph.parseParagraphPr(word, pPr);
    }
  }
  return defaultStyle;
}

function parseTblStylePr(word: Word, element: Element) {
  const style: TblStylePrStyle = {};
  for (const child of element.children) {
    const tag = child.tagName;
    switch (tag) {
      case 'w:rPr':
        style.rPr = Run.parseRunPr(word, child);
        break;

      case 'w:pPr':
        style.pPr = Paragraph.parseParagraphPr(word, child);
        break;

      case 'w:tblPr':
        style.tblPr = parseTablePr(word, child);
        break;

      case 'w:tcPr':
        style.tcPr = parseTcPr(word, child);
        break;

      case 'w:trPr':
        style.trPr = parseTrPr(word, child);
        break;
    }
  }

  return style;
}

/**
 * 解析单个样式标签
 */
function parseStyle(word: Word, element: Element) {
  const style: Style = {};

  style.id = element.getAttribute('w:styleId') || '';
  style.type = element.getAttribute('w:type') as ST_StyleType;

  style.tblStylePr = {} as Record<ST_TblStyleOverrideType, TblStylePrStyle>;

  Object.assign(style, parseTblStylePr(word, element));

  for (const child of element.children) {
    const tag = child.tagName;
    switch (tag) {
      case 'w:name':
        style.name = getVal(child);
        break;

      case 'w:basedOn':
        style.basedOn = getVal(child);
        break;

      case 'w:rPr':
      case 'w:pPr':
      case 'w:tblPr':
      case 'w:tcPr':
      case 'w:trPr':
        // 这些在 parseTblStylePr 里实现了
        break;

      case 'w:tblStylePr':
        const type = child.getAttribute('w:type') as ST_TblStyleOverrideType;
        style.tblStylePr[type] = parseTblStylePr(word, child);
        break;

      case 'w:next':
      case 'w:link':
      case 'w:unhideWhenUsed':
      case 'w:qFormat':
      case 'w:rsid':
      case 'w:uiPriority':
      case 'w:semiHidden':
      case 'w:autoRedefine':
        // 看起来和展现不相关的配置
        break;

      default:
        console.warn('parseStyle Unknown tag', tag, child);
    }
  }

  return style;
}

/**
 * 解析 styles.xml
 */
export function parseStyles(word: Word, doc: Document): Styles {
  const styles: Styles = {
    styleMap: {}
  };

  const stylesElement = Array.from(doc.getElementsByTagName('w:style'));

  for (let styleElement of stylesElement) {
    const style = parseStyle(word, styleElement);
    if (style.id) {
      styles.styleMap[style.id] = style;
    }
  }

  styles.defaultStyle = parseDefaultStyle(
    word,
    doc.getElementsByTagName('w:docDefaults').item(0)
  );

  return styles;
}

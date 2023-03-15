/**
 * 解析共享样式 Style
 */

import {getVal} from '../OpenXML';
import Word from '../Word';
import {ST_StyleType, ST_TblStyleOverrideType} from './Types';
import {Paragraph, ParagraphProperties} from './word/Paragraph';
import {Run, RunProperties} from './word/Run';
import {Table, TableProperties} from './word/Table';
import {Tc, TcProperties} from './word/table/Tc';
import {Tr, TrProperties} from './word/table/Tr';

export interface CSSStyle {
  [key: string]: string;
}

// http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblStylePr.html
export interface TblStylePrStyle {
  // 文本
  rPr?: RunProperties;

  // 段落
  pPr?: ParagraphProperties;

  // 表格
  tblPr?: TableProperties;

  // 行样式
  trPr?: TrProperties;

  // 单元格样式
  tcPr?: TcProperties;
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
  const rPrDefault = element.querySelector('rPrDefault');
  if (rPrDefault) {
    const rPr = rPrDefault.querySelector('rPr');
    if (rPr) {
      defaultStyle.rPr = Run.parseRunProperties(word, rPr);
    }
  }
  const pPrDefault = element.querySelector('pPrDefault');
  if (pPrDefault) {
    const pPr = pPrDefault.querySelector('pPr');
    if (pPr) {
      defaultStyle.pPr = Paragraph.parseParagraphProperties(word, pPr);
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
        style.rPr = Run.parseRunProperties(word, child);
        break;

      case 'w:pPr':
        style.pPr = Paragraph.parseParagraphProperties(word, child);
        break;

      case 'w:tblPr':
        style.tblPr = Table.parseTableProperties(word, child);
        break;

      case 'w:tcPr':
        style.tcPr = Tc.parseTcProperties(word, child);
        break;

      case 'w:trPr':
        style.trPr = Tr.parseTrProperties(word, child);
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
        console.warn('parseStyle Unknown tag', tag);
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
    doc.querySelector('docDefaults')
  );

  return styles;
}

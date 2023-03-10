/**
 * 解析共享样式 Style
 */

import {WAttr, WTag, loopChildren, XMLData, getVal} from '../OpenXML';
import Word from '../Word';
import {ST_StyleType} from './Types';
import {Paragraph, ParagraphProperties} from './word/Paragraph';
import {Run, RunProperties} from './word/Run';
import {Table, TableProperties} from './word/Table';

export interface CSSStyle {
  [key: string]: string;
}

export interface Style {
  id?: string;
  type?: ST_StyleType;
  name?: string;
  basedOn?: string;

  // 文本
  rPr?: RunProperties;
  // 段落
  pPr?: ParagraphProperties;
  // 表格
  tblPr?: TableProperties;
}

export interface Styles {
  // 方便根据 id 获取 样式
  styleMap: Record<string, Style>;

  defaultStyle?: Style;
}

function parseDefaultStyle(word: Word, data: XMLData) {
  const defaultStyle: Style = {};
  if (WTag.rPrDefault in data) {
    const rPrDefaultData = data[WTag.rPrDefault];
    if (typeof rPrDefaultData === 'object' && WTag.rPr in rPrDefaultData) {
      defaultStyle.rPr = Run.parseRunProperties(
        word,
        rPrDefaultData[WTag.rPr] as XMLData
      );
    }
  }
  if (WTag.pPrDefault in data) {
    const pPrDefault = data[WTag.pPrDefault];
    if (typeof pPrDefault === 'object' && WTag.pPr in pPrDefault) {
      defaultStyle.pPr = Paragraph.parseParagraphProperties(
        word,
        pPrDefault[WTag.pPr] as XMLData
      );
    }
  }
  return defaultStyle;
}

function parseStyle(word: Word, data: XMLData) {
  const style: Style = {};
  if (WTag.rPr in data) {
    style.rPr = Run.parseRunProperties(word, data[WTag.rPr] as XMLData);
  }
  if (WTag.pPr in data && Object.keys(data[WTag.pPr]).length > 0) {
    style.pPr = Paragraph.parseParagraphProperties(
      word,
      data[WTag.pPr] as XMLData
    );
  }
  if (WTag.tblPr in data && Object.keys(data[WTag.tblPr]).length > 0) {
    style.tblPr = Table.parseTableProperties(word, data[WTag.tblPr] as XMLData);
  }
  if (WTag.name in data) {
    const name = data[WTag.name] as XMLData;
    if (typeof name === 'object' && WAttr.val in name) {
      style.name = name[WAttr.val] as string;
    }
  }

  if (WAttr.type in data) {
    style.type = data[WAttr.type] as ST_StyleType;
  }

  if (WTag.basedOn in data) {
    const basedOn = data[WTag.basedOn] as XMLData;
    style.basedOn = getVal(basedOn);
  }

  if (WAttr.styleId in data) {
    style.id = data[WAttr.styleId] as string;
  }
  return style;
}

/**
 * 解析 styles.xml
 * @param data
 */
export function parseStyles(word: Word, data: XMLData): Styles {
  const stylesData = data[WTag.styles] as XMLData;
  const styles: Styles = {
    styleMap: {}
  };

  loopChildren(stylesData, function (key, value) {
    if (typeof value !== 'object') {
      return;
    }

    if (key === WTag.style) {
      const style = parseStyle(word, value);
      if (style.id) {
        styles.styleMap[style.id] = style;
      }
    } else if (key == WTag.docDefaults) {
      styles.defaultStyle = parseDefaultStyle(word, value);
    }
    // 还有个 w:latentStyles 并不知道是啥
  });

  return styles;
}

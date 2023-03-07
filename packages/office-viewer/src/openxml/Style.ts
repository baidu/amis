/**
 * 解析共享样式 Style
 */

import {WAttr, WTag, loopChildren, XMLData} from '../OpenXML';
import {parsePr} from '../parse/parsePr';

export interface CSSStyle {
  [key: string]: string;
}

export interface Style {
  id?: string;
  type?: 'paragraph' | 'character' | 'table' | 'numbering';
  name?: string;
  baseOn?: string;

  // 文本
  rPr?: CSSStyle;
  // 段落
  pPr?: CSSStyle;

  tblPr?: CSSStyle;
}

export interface Styles {
  // 方便根据 id 获取 样式
  style: Record<string, Style>;

  defaultStyle?: Style;
}

function parseDefaultStyle(data: XMLData) {
  const defaultStyle: Style = {};
  if (WTag.rPrDefault in data) {
    const rPrDefaultData = data[WTag.rPrDefault];
    if (typeof rPrDefaultData === 'object' && WTag.rPr in rPrDefaultData) {
      defaultStyle.rPr = parsePr(rPrDefaultData[WTag.rPr] as XMLData);
    }
  }
  if (WTag.pPrDefault in data) {
    const pPrDefault = data[WTag.pPrDefault];
    if (typeof pPrDefault === 'object' && WTag.pPr in pPrDefault) {
      defaultStyle.pPr = parsePr(pPrDefault[WTag.pPr] as XMLData);
    }
  }
  return defaultStyle;
}

function parseStyle(data: XMLData) {
  const style: Style = {};
  if (WTag.rPr in data) {
    style.rPr = parsePr(data[WTag.rPr] as XMLData);
  }
  if (WTag.pPr in data && Object.keys(data[WTag.pPr]).length > 0) {
    style.pPr = parsePr(data[WTag.pPr] as XMLData);
  }
  if (WTag.tblPr in data && Object.keys(data[WTag.tblPr]).length > 0) {
    style.tblPr = parsePr(data[WTag.tblPr] as XMLData);
  }
  if (WTag.name in data) {
    const name = data[WTag.name];
    if (typeof name === 'object' && WAttr.val in name) {
      style.name = name[WAttr.val] as string;
    }
  }
  if (WTag.baseOn in data) {
    const baseOn = data[WTag.baseOn];
    if (typeof baseOn === 'object' && WAttr.val in baseOn) {
      style.baseOn = baseOn[WAttr.val] as string;
    }
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
export function parseStyles(data: XMLData): Styles {
  const stylesData = data[WTag.styles] as XMLData;
  const styles: Styles = {
    style: {}
  };

  loopChildren(stylesData, function (key, value) {
    if (key === WTag.style) {
      const style = parseStyle(value);
      if (style.id) {
        styles.style[style.id] = style;
      }
    } else if (key == WTag.docDefaults) {
      styles.defaultStyle = parseDefaultStyle(value);
    }
    // 还有个 w:latentStyles 并不知道是啥
  });

  return styles;
}

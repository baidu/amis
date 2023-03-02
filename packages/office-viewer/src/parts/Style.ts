/**
 * 解析共享样式 Style
 */

import {WAttr, WTag} from '../parse/Names';
import {parsePr} from '../parse/parsePr';
import {loopChildren} from '../util/xml';

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

function parseDefaultStyle(data: any) {
  const defaultStyle: Style = {};
  if (WTag.rPrDefault in data) {
    const rPrDefaultData = data[WTag.rPrDefault];
    if (rPrDefaultData && WTag.rPr in rPrDefaultData) {
      defaultStyle.rPr = parsePr(rPrDefaultData[WTag.rPr]);
    }
  }
  if (WTag.pPrDefault in data) {
    const pPrDefault = data[WTag.pPrDefault];
    if (pPrDefault && WTag.pPr in pPrDefault) {
      defaultStyle.pPr = parsePr(pPrDefault[WTag.pPr]);
    }
  }
  return defaultStyle;
}

function parseStyle(data: any) {
  const style: Style = {};
  if (WTag.rPr in data) {
    style.rPr = parsePr(data[WTag.rPr]);
  }
  if (WTag.pPr in data && Object.keys(data[WTag.pPr]).length > 0) {
    style.pPr = parsePr(data[WTag.pPr]);
  }
  if (WTag.tblPr in data && Object.keys(data[WTag.tblPr]).length > 0) {
    style.tblPr = parsePr(data[WTag.tblPr]);
  }
  if (WTag.name in data) {
    style.name = data[WTag.name][WAttr.val];
  }
  if (WTag.baseOn in data) {
    style.baseOn = data[WTag.baseOn][WAttr.val];
  }

  if (WAttr.styleId in data) {
    style.id = data[WAttr.styleId];
  }
  return style;
}

/**
 * 解析 styles.xml
 * @param data
 */
export function parseStyles(data: any): Styles {
  const stylesData = data[WTag.styles];
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

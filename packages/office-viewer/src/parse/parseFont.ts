/**
 * 解析字体
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/rFonts.html
 */

import {WAttr, XMLData} from '../OpenXML';

function themeFont(font: string) {
  return `var(--docx-theme-font-${font})`;
}

export function parseFont(data: XMLData) {
  const fonts = [];
  if (WAttr.ascii in data) {
    fonts.push(data[WAttr.ascii]);
  }

  if (WAttr.cs in data) {
    fonts.push(data[WAttr.cs]);
  }

  if (WAttr.eastAsia in data) {
    fonts.push(data[WAttr.eastAsia]);
  }

  if (WAttr.asciiTheme in data) {
    fonts.push(themeFont(data[WAttr.asciiTheme] as string));
  }

  if (WAttr.csTheme in data) {
    fonts.push(themeFont(data[WAttr.csTheme] as string));
  }

  if (WAttr.eastAsiaTheme in data) {
    fonts.push(themeFont(data[WAttr.eastAsiaTheme] as string));
  }

  // hint 之类的不支持，因为也很难控制到这个粒度了

  if (fonts.length) {
    return Array.from(new Set(fonts)).join(', ');
  }
  return '';
}

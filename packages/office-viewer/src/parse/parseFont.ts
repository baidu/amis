/**
 * 解析字体
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/rFonts.html
 */

import {WAttr} from './Names';

function themeFont(font: string) {
  return `var(--docx-theme-font-${font})`;
}

export function parseFont(data: any) {
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
    fonts.push(themeFont(data[WAttr.asciiTheme]));
  }

  if (WAttr.csTheme in data) {
    fonts.push(themeFont(data[WAttr.csTheme]));
  }

  if (WAttr.eastAsiaTheme in data) {
    fonts.push(themeFont(data[WAttr.eastAsiaTheme]));
  }

  // hint 之类的不支持，因为也很难控制到这个粒度了

  if (fonts.length) {
    return Array.from(new Set(fonts)).join(', ');
  }
  return '';
}

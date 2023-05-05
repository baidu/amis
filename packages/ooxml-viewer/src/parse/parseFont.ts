/**
 * 解析字体
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/rFonts.html
 */

import {CSSStyle} from '../openxml/Style';
import Word from '../Word';

function themeFont(font: string) {
  return `var(--docx-theme-font-${font})`;
}

export function parseFont(word: Word, element: Element, style: CSSStyle) {
  const fonts = [];

  const fontMapping = word.renderOptions.fontMapping;

  for (const attribute of element.attributes) {
    const name = attribute.name;
    let value = attribute.value;
    switch (name) {
      case 'w:ascii':
      case 'w:cs':
      case 'w:eastAsia':
        if (fontMapping && value in fontMapping) {
          value = fontMapping[value];
        }
        if (value.indexOf(' ') === -1) {
          fonts.push(value);
        } else {
          fonts.push('"' + value + '"');
        }
        break;

      case 'w:asciiTheme':
      case 'w:csTheme':
      case 'w:eastAsiaTheme':
        fonts.push(themeFont(value));
        break;
    }
  }

  // hint 之类的不支持，因为也很难控制到这个粒度了
  if (fonts.length) {
    style['font-family'] = Array.from(new Set(fonts)).join(', ');
  }
}

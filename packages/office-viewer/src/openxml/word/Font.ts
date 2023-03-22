/**
 * 内嵌字体
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Font%20Embedding.html
 */

import {getVal} from '../../OpenXML';
import Word from '../../Word';

export class Font {
  name: string;
  family: string;
  altName?: string;
  fontData: string;

  static fromXML(word: Word, element: Element): Font {
    const font = new Font();
    font.name = element.getAttribute('w:name') || '';

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:family':
          font.family = getVal(child);
          break;

        case 'w:altName':
          font.altName = getVal(child);
          break;

        case 'embedRegular':
        case 'embedBold':
        case 'embedItalic':
        case 'embedBoldItalic':
        case 'embedSystemFonts':
        case 'embedTrueTypeFonts':
      }
    }
    return font;
  }
}

/**
 * 内嵌字体
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Font%20Embedding.html
 */

import {getVal} from '../../OpenXML';
import Word from '../../Word';

/**
 * 这是来自 docxjs 里的代码，参考了规范 17.8.1 里的算法
 */
export function deobfuscate(data: Uint8Array, guidKey: string): Uint8Array {
  const len = 16;
  const trimmed = guidKey.replace(/{|}|-/g, '');
  const numbers = new Array(len);

  for (let i = 0; i < len; i++)
    numbers[len - i - 1] = parseInt(trimmed.substr(i * 2, 2), 16);

  for (let i = 0; i < 32; i++) data[i] = data[i] ^ numbers[i % len];

  return data;
}

export class Font {
  name: string;
  family: string;
  altName?: string;
  // 字体文件地址
  url?: string;

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

        case 'w:panose1':
          // 不知道是啥
          // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/panose1.html
          break;

        case 'w:charset':
        case 'w:sig':
        case 'w:pitch':
          // 用不上
          break;

        case 'w:embedRegular':
        case 'w:embedBold':
        case 'w:embedItalic':
        case 'w:embedBoldItalic':
        case 'w:embedSystemFonts':
        case 'w:embedTrueTypeFonts':
          const id = child.getAttribute('r:id') || '';
          const fontKey = child.getAttribute('w:fontKey') || '';
          const fontURL = word.loadFont(id, fontKey);
          if (fontURL) {
            font.url = fontURL;
          }
          break;

        default:
          console.warn('parse Font: Unknown key', tagName, child);
      }
    }
    return font;
  }
}

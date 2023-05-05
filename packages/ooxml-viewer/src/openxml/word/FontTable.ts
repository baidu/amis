/**
 * 解析和渲染字体
 */

import Word from '../../Word';
import {Font} from './Font';

export class FontTable {
  fonts: Font[] = [];

  static fromXML(word: Word, doc: Document): FontTable {
    const fonts = Array.from(doc.getElementsByTagName('w:font'));
    const fontTable = new FontTable();
    for (const child of fonts) {
      const font = Font.fromXML(word, child);
      fontTable.fonts.push(font);
    }
    return fontTable;
  }
}

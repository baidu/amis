/**
 * 解析和渲染字体
 */

import Word from '../../Word';
import {Font} from './Font';

export class FontTable {
  fonts: Font[] = [];

  static fromXML(word: Word, element: Element): FontTable {
    const fontTable = new FontTable();
    for (const child of element.children) {
      const font = Font.fromXML(word, child);
      fontTable.fonts.push(font);
    }
    return fontTable;
  }
}

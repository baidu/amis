/**
 * 设置项，目前只支持部分
 */

import Word from '../../Word';

export class Settings {
  // 颜色映射
  clrSchemeMapping: Record<string, string> = {};

  static fromXML(word: Word, doc: Document): Settings {
    const settings = new Settings();

    const clrSchemeMappingElement = doc
      .getElementsByTagName('w:clrSchemeMapping')
      .item(0);
    if (clrSchemeMappingElement) {
    }

    for (const child of doc.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:clrSchemeMapping':
          break;
      }
    }

    return settings;
  }
}

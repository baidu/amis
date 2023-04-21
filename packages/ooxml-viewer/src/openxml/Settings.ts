/**
 * 解析 settings.xml，只支持一小部分
 *
 */

import {getValBoolean} from '../OpenXML';
import Word from '../Word';

/**
 * 解析颜色映射
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/clrSchemeMapping.html
 */
function parseClrSchemeMapping(element: Element) {
  const clrSchemeMapping: Record<string, string> = {};
  for (const attribute of element.attributes) {
    const name = attribute.name.replace('w:', '');
    let value = attribute.value;
    // 文档里也说了这个等于 lt1
    if (value === 'light1') {
      value = 'lt1';
    } else if (value === 'light2') {
      value = 'lt2';
    } else if (value === 'dark1') {
      value = 'dk1';
    } else if (value === 'dark2') {
      value = 'dk2';
    }
    clrSchemeMapping[name] = value;
  }

  if (!clrSchemeMapping.bg1) {
    clrSchemeMapping.bg1 = 'lt1';
  }
  if (!clrSchemeMapping.bg2) {
    clrSchemeMapping.bg2 = 'lt2';
  }

  if (!clrSchemeMapping.tx1) {
    clrSchemeMapping.tx1 = 'dk1';
  }

  return clrSchemeMapping;
}

export class Settings {
  clrSchemeMapping: Record<string, string> = {};
  autoHyphenation: boolean = false;

  static parse(word: Word, doc: Document): Settings {
    const settings = new Settings();

    let rootElement: Element | Document = doc;
    if (
      doc.firstElementChild &&
      doc.firstElementChild.tagName === 'w:settings'
    ) {
      rootElement = doc.getElementsByTagName('w:settings').item(0)!;
    }
    for (const child of Array.from(rootElement.children)) {
      const tag = child.tagName;
      switch (tag) {
        case 'w:clrSchemeMapping':
          settings.clrSchemeMapping = parseClrSchemeMapping(child);
          break;

        case 'w:autoHyphenation':
          settings.autoHyphenation = getValBoolean(child, false);
          break;
      }
    }

    return settings;
  }
}

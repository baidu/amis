import Word from '../Word';
import {Tr} from '../openxml/word/table/Tr';
import {parseTc} from './parseTc';
import {parseTablePr} from './parseTablePr';
import {Tc} from '../openxml/word/table/Tc';
import {parseTrPr} from './parseTrPr';

import {mergeSdt} from './mergeSdt';

export function parseTr(
  word: Word,
  element: Element,
  rowSpanMap: {[key: string]: Tc}
): Tr {
  const tr = new Tr();

  // 做成对象是为了传递引用来修改
  const currentCol = {
    index: 0
  };

  for (const child of mergeSdt(element)) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'w:tc':
        const tc = parseTc(word, child, currentCol, rowSpanMap);
        if (tc) {
          tr.tcs.push(tc);
        }
        break;

      case 'w:trPr':
        tr.properties = parseTrPr(word, child);
        break;

      case 'w:tblPrEx':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblPrEx_1.html
        const tablePr = parseTablePr(word, child);
        Object.assign(tr.properties.cssStyle || {}, tablePr.cssStyle);
        break;

      default:
        console.warn(`Tr: Unknown tag `, tagName, child);
    }
  }

  return tr;
}

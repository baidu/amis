/**
 * 拆分出来主要是为了避免循环引用
 */

import {Tc} from '../../openxml/word/table/Tc';
import Word from '../../Word';
import {parseTcPr} from './parseTcPr';

import {Paragraph} from '../../openxml/word/Paragraph';
import {parseTable} from './parseTable';

export function parseTc(
  word: Word,
  element: Element,
  currentCol: {index: number},
  rowSpanMap: {[key: string]: Tc}
) {
  const tc = new Tc();

  for (const child of element.children) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'w:tcPr':
        tc.properties = parseTcPr(word, child);
        break;

      case 'w:p':
        tc.add(Paragraph.fromXML(word, child));
        break;

      case 'w:tbl':
        tc.add(parseTable(word, child));
        break;
    }
  }
  const lastCol = rowSpanMap[currentCol.index];
  // 如果是 continue 意味着这个被合并了
  if (tc.properties.vMerge) {
    if (tc.properties.vMerge === 'restart') {
      tc.properties.rowSpan = 1;
      rowSpanMap[currentCol.index] = tc;
    } else if (lastCol) {
      if (lastCol.properties && lastCol.properties.rowSpan) {
        lastCol.properties.rowSpan = lastCol.properties.rowSpan + 1;
        const colSpan = tc.properties.gridSpan || 1;
        currentCol.index += colSpan;
        return null;
      } else {
        console.warn(
          'Tc.fromXML: continue but not found lastCol',
          currentCol.index,
          tc,
          rowSpanMap
        );
      }
    }
  } else {
    delete rowSpanMap[currentCol.index];
  }

  const colSpan = tc.properties.gridSpan || 1;
  currentCol.index += colSpan;

  return tc;
}

import {Tc} from '../openxml/word/table/Tc';
import {GridCol, Table} from '../openxml/word/Table';
import {parseTr} from './parseTr';
import {parseTablePr} from './parseTablePr';
import Word from '../Word';
import {parseSize} from './parseSize';

import {mergeSdt} from './mergeSdt';

function parseTblGrid(element: Element) {
  const gridCol: GridCol[] = [];
  const gridColElements = element.getElementsByTagName('w:gridCol');
  for (const gridColElement of gridColElements) {
    const w = parseSize(gridColElement, 'w:w');
    gridCol.push({w});
  }
  return gridCol;
}

export function parseTable(word: Word, element: Element) {
  const table = new Table();

  // 用于计算列的跨行，这里记下前面的跨行情况
  const rowSpanMap: {[key: string]: Tc} = {};

  for (const child of mergeSdt(element)) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'w:tblPr':
        table.properties = parseTablePr(word, child);
        break;

      case 'w:tr':
        table.trs.push(parseTr(word, child, rowSpanMap));
        break;

      case 'w:tblGrid':
        table.tblGrid = parseTblGrid(child);
        break;

      default:
        console.warn('Table.fromXML unknown tag', tagName, child);
    }
  }

  return table;
}

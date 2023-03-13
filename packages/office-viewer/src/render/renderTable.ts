import {Paragraph} from '../openxml/word/Paragraph';
import {Table} from '../openxml/word/Table';
import {appendChild} from '../util/dom';
import Word from '../Word';
import renderParagraph from './renderParagraph';
import {setElementStyle} from './setElementStyle';

export default function renderTable(word: Word, table: Table) {
  const tableEl = document.createElement('table');
  const properties = table.properties;

  if (properties.tblCaption) {
    const caption = document.createElement('caption');
    caption.textContent = properties.tblCaption;
    tableEl.appendChild(caption);
  }

  setElementStyle(word, tableEl, properties);

  // 这里或许应该生成 classname 来支持 tcCSSStyle

  const tbody = document.createElement('tbody');
  tableEl.appendChild(tbody);

  for (const tr of table.trs) {
    const trEl = document.createElement('tr');
    tbody.appendChild(trEl);

    for (const tc of tr.tcs) {
      const tdEl = document.createElement('td') as HTMLTableCellElement;
      trEl.appendChild(tdEl);
      const tcProperties = tc.properties;
      setElementStyle(word, tdEl, tcProperties);
      if (tcProperties.gridSpan) {
        tdEl.colSpan = tcProperties.gridSpan;
      } else if (tcProperties.rowSpan) {
        tdEl.rowSpan = tcProperties.rowSpan;
      }

      for (const tcChild of tc.children) {
        if (tcChild instanceof Paragraph) {
          const p = renderParagraph(word, tcChild);
          appendChild(tdEl, p);
        } else if (tcChild instanceof Table) {
          appendChild(tdEl, renderTable(word, tcChild));
        } else {
          console.warn('unknown child type: ' + tcChild);
        }
      }
    }
  }

  return tableEl;
}

import {Table} from '../openxml/word/Table';
import Word from '../Word';

export default function renderTable(word: Word, table: Table) {
  const tableEl = document.createElement('table');
  const properties = table.properties;

  if (properties.tblCaption) {
    const caption = document.createElement('caption');
    caption.textContent = properties.tblCaption;
    tableEl.appendChild(caption);
  }

  return tableEl;
}

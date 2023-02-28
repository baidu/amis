import Word from '../Word';
import {loopData} from './loopData';
import renderParagraph from './renderParagraph';
import renderTable from './renderTable';

export default async function renderBody(word: Word, data: any) {
  const body = document.createElement('div');
  await loopData(data, async (key, value) => {
    if (key === 'w:p') {
      const p = await renderParagraph(word, value);
      body.appendChild(p);
    } else if (key === 'w:tbl') {
      const table = await renderTable(word, value);
      body.appendChild(table);
    } else {
      console.warn('renderBody Unknown key', key);
    }
  });
  return body;
}

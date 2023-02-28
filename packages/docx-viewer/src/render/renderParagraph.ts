import Word from '../Word';
import {loopData} from './loopData';
import renderRun from './renderRun';

export function parseStyle() {}

export default async function renderParagraph(word: Word, data: any) {
  const p = document.createElement('p');
  await loopData(data, async (key, value) => {
    if (key === 'w:r') {
      const r = await renderRun(word, value);
      p.appendChild(r);
    } else if (key === 'w:pPr') {
    } else {
      console.warn('renderParagraph Unknown key', key);
    }
  });

  return p;
}

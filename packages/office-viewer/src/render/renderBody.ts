import {createElement, appendChild} from '../util/dom';
import Word from '../Word';
import {loopChildren} from '../util/xml';
import renderParagraph from './renderParagraph';
import renderTable from './renderTable';
import {WTag} from '../parse/Names';

export default function renderBody(word: Word, data: any) {
  const body = createElement('div');
  loopChildren(data, (key, value) => {
    if (key === WTag.p) {
      const p = renderParagraph(word, value);
      body.appendChild(p);
    } else if (key === WTag.tbl) {
      const table = renderTable(word, value);
      appendChild(body, table);
    } else {
      console.warn('renderBody Unknown key', key);
    }
  });
  return body;
}

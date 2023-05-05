/**
 * 渲染 header 内容
 */

import Word from '../Word';
import {Header} from '../openxml/word/Header';
import {Paragraph} from '../openxml/word/Paragraph';
import renderParagraph from './renderParagraph';
import {appendChild, createElement} from '../util/dom';
import renderTable from './renderTable';
import {Table} from '../openxml/word/Table';

export function renderHeader(word: Word, header: Header) {
  const headerEl = createElement('div');

  for (const child of header.children) {
    if (child instanceof Paragraph) {
      const p = renderParagraph(word, child, true, true);
      appendChild(headerEl, p);
    } else if (child instanceof Table) {
      const table = renderTable(word, child);
      appendChild(headerEl, table);
    } else {
      console.warn('unknown child', child);
    }
  }

  return headerEl;
}

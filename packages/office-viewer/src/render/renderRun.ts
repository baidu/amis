/**
 * run 相关的 http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Run_1.html
 */

import {WTag} from '../parse/Names';
import {parseBr} from '../parse/parseBr';
import {parsePr} from '../parse/parsePr';
import {appendChild, createElement, setStyle} from '../util/dom';
import Word from '../Word';

export default function renderRun(word: Word, data: any) {
  const span = createElement('span');

  for (const key in data) {
    const value = data[key];
    if (key === WTag.t) {
      if (typeof value === 'string') {
        span.textContent = value;
      } else if (typeof value === 'object') {
        const xmlSpace = value['@_xml:space'];
        if (xmlSpace === 'preserve') {
          span.style.whiteSpace = 'pre';
        }
        span.textContent = value['#text'] ?? '';
      }
    } else if (key === WTag.rPr) {
      setStyle(span, parsePr(value));
    } else if (key === WTag.br) {
      appendChild(span, parseBr(value));
    } else {
      console.warn(`renderRun: ${key} is not supported.`);
    }
  }
  return span;
}

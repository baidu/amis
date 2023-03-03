/**
 * run 相关的 http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Run_1.html
 */

import {WTag} from '../parse/Names';
import {renderBr} from './renderBr';
import {applyStyle, parsePr} from '../parse/parsePr';
import {appendChild, createElement, setStyle} from '../util/dom';
import Word from '../Word';
import {loopChildren} from '../util/xml';
import {renderElement} from './renderElement';

export default function renderRun(word: Word, data: any) {
  let span = createElement('span');

  loopChildren(data, (key, value) => {
    const element = renderElement(word, key, value);
    if (element) {
      appendChild(span, element);
      return;
    }

    switch (key) {
      case WTag.t:
        if (typeof value === 'string') {
          span.textContent = value;
        } else if (typeof value === 'number') {
          span.textContent = String(value);
        } else if (typeof value === 'object') {
          const xmlSpace = value['@_xml:space'];
          if (xmlSpace === 'preserve') {
            span.style.whiteSpace = 'pre';
          }
          span.textContent = value['#text'] ?? '';
        }
        break;

      case WTag.rPr:
        span = applyStyle(word, span, value);
        break;

      case WTag.br:
        appendChild(span, renderBr(value));

      default:
        console.warn(`renderRun: ${key} is not supported.`);
    }
  });

  return span;
}

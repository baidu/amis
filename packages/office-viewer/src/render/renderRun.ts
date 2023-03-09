/**
 * run 相关的 http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Run_1.html
 */

import {renderBr} from './renderBr';
import {appendChild, createElement, setStyle} from '../util/dom';
import Word from '../Word';
import {Run, Text} from '../openxml/word/Run';
import {Break} from '../openxml/word/Break';
import {Drawing} from '../openxml/word/drawing/Drawing';
import {renderDrawing} from './renderDrawing';
import {setElementStyle} from './setElementStyle';

export default function renderRun(word: Word, run: Run) {
  const span = createElement('span');
  span.classList.add('r');

  setElementStyle(word, span, run.properties);

  if (run.children.length === 1 && run.children[0] instanceof Text) {
    const text = run.children[0] as Text;

    span.textContent = text.text;
  } else {
    for (const child of run.children) {
      if (child instanceof Text) {
        let newSpan = createElement('span');
        newSpan.textContent = child.text;
        appendChild(span, newSpan);
      } else if (child instanceof Break) {
        const br = renderBr(child);
        appendChild(span, br);
      } else if (child instanceof Drawing) {
        appendChild(span, renderDrawing(word, child));
      }
    }
  }

  return span;
}

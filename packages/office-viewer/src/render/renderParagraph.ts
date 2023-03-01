import {WTag} from './../parse/Names';
/**
 * 解析段落。类型装换部分参考了 docxjs 的代码
 */
import {createElement, appendChild, setStyle} from '../util/dom';
import Word from '../Word';
import {loopChildren} from '../util/xml';
import renderRun from './renderRun';

import {getPStyle, parsePr} from '../parse/parsePr';

export default function renderParagraph(word: Word, data: any) {
  const p = createElement('p');
  loopChildren(data, (key, value) => {
    if (key === WTag.r) {
      const r = renderRun(word, value);
      appendChild(p, r);
    } else if (key === WTag.pPr) {
      setStyle(p, parsePr(value));
      const className = getPStyle(value);
      if (className) {
        p.className = className;
      }
    } else {
      console.warn('renderParagraph Unknown key', key);
    }
  });

  return p;
}

import {WTag} from './../parse/Names';
/**
 * 解析段落。类型装换部分参考了 docxjs 的代码
 */
import {createElement, appendChild, setStyle} from '../util/dom';
import Word from '../Word';
import {loopChildren} from '../util/xml';
import renderRun from './renderRun';

import {applyStyle, getPStyle, parsePr} from '../parse/parsePr';

export default function renderParagraph(word: Word, data: any) {
  let p = createElement('p');
  loopChildren(data, (key, value) => {
    switch (key) {
      case WTag.r:
        const r = renderRun(word, value);
        appendChild(p, r);
        break;

      case WTag.pPr:
        p = applyStyle(word, p, value);

      case WTag.proofErr:
      case WTag.noProof:
        // 语法检查
        break;

      default:
        console.warn('renderParagraph Unknown key', key);
    }
  });

  return p;
}

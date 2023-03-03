import {WTag} from './../parse/Names';
/**
 * 解析段落。类型装换部分参考了 docxjs 的代码
 */
import {createElement, appendChild, setStyle} from '../util/dom';
import Word from '../Word';
import {loopChildren} from '../util/xml';
import renderRun from './renderRun';

import {applyStyle, getPStyle, parsePr} from '../parse/parsePr';
import {renderElement} from './renderElement';

export default function renderParagraph(word: Word, data: any) {
  let p = createElement('p');
  loopChildren(data, (key, value) => {
    const element = renderElement(word, key, value);
    if (element) {
      appendChild(p, element);
      return;
    }
    switch (key) {
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

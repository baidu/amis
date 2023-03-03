/**
 * 渲染链接
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/hyperlink_2.html
 * http://officeopenxml.com/WPhyperlink.php
 */

import {RAttr, WAttr} from '../parse/Names';
import {appendChild, createElement} from '../util/dom';
import {loopChildren} from '../util/xml';
import Word from '../Word';
import {renderElement} from './renderElement';

export function renderHyperLink(word: Word, data: any): HTMLElement {
  const a = createElement('a') as HTMLAnchorElement;

  const rId = data[RAttr.id];
  if (rId) {
    const rel = word.getRelationship(rId);
    if (rel && rel.targetMode === 'External') {
      a.href = rel.target;
      a.target = '_blank';
    }
  }

  if (WAttr.anchor in data) {
    a.href = '#' + data[WAttr.anchor];
  }

  loopChildren(data, (key, value) => {
    const element = renderElement(word, key, value);
    if (element) {
      appendChild(a, element);
      return;
    } else {
      console.warn('renderHyperLink Unknown key', key);
    }
  });

  return a;
}

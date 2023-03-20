import {Hyperlink} from './../openxml/word/Hyperlink';
import {appendChild, createElement} from '../util/dom';
import Word from '../Word';
import {Run} from '../openxml/word/Run';
import renderRun from './renderRun';

/**
 * 渲染链接
 */
export function renderHyperLink(word: Word, hyperlink: Hyperlink): HTMLElement {
  const a = createElement('a') as HTMLAnchorElement;

  if (hyperlink.relation) {
    const rel = hyperlink.relation;
    if (rel && rel.targetMode === 'External') {
      a.href = rel.target;
      a.target = '_blank';
    }
  }

  if (hyperlink.anchor) {
    a.href = '#' + hyperlink.anchor;
  }

  for (const child of hyperlink.children) {
    if (child instanceof Run) {
      const span = renderRun(word, child);
      appendChild(a, span);
    }
  }

  return a;
}

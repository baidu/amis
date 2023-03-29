import {Hyperlink} from './../openxml/word/Hyperlink';
import {appendChild, createElement} from '../util/dom';
import Word from '../Word';
import {Run} from '../openxml/word/Run';
import renderRun from './renderRun';
import type {Paragraph} from '../openxml/word/Paragraph';

/**
 * 渲染链接
 */
export function renderHyperLink(
  word: Word,
  hyperlink: Hyperlink,
  paragraph?: Paragraph
): HTMLElement {
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

  if (hyperlink.tooltip) {
    a.title = hyperlink.tooltip;
  }

  for (const child of hyperlink.children) {
    if (child instanceof Run) {
      const span = renderRun(word, child, paragraph);
      appendChild(a, span);
    }
  }

  return a;
}

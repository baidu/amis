/**
 * 解析缩进 http://officeopenxml.com/WPindentation.php
 */

import {CSSStyle} from '../openxml/Style';

import {parseSize} from './parseSize';

export function parseInd(element: Element, style: CSSStyle) {
  const firstLine = parseSize(element, 'w:firstLine');
  const hanging = parseSize(element, 'w:hanging');
  const left = parseSize(element, 'w:left');
  const start = parseSize(element, 'w:start');
  const right = parseSize(element, 'w:right');
  const end = parseSize(element, 'w:end');

  if (firstLine) {
    style['text-indent'] = firstLine;
  }
  if (hanging) {
    style['text-indent'] = `-${hanging}`;
  }
  if (left || start) {
    style['margin-left'] = left || start;
  }
  if (right || end) {
    style['margin-right'] = right || end;
  }
}

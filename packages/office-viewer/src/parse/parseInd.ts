/**
 * 解析缩进 http://officeopenxml.com/WPindentation.php
 */

import {WAttr} from './Names';
import {parseSize} from './parseSize';

export function parseInd(data: any, style: Record<string, string>) {
  const firstLine = parseSize(data, WAttr.firstLine);
  const hanging = parseSize(data, WAttr.hanging);
  const left = parseSize(data, WAttr.left);
  const start = parseSize(data, WAttr.start);
  const right = parseSize(data, WAttr.right);
  const end = parseSize(data, WAttr.end);

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

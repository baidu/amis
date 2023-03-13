/**
 * 解析 spacing
 * http://officeopenxml.com/WPspacing.php
 */
import {CSSStyle} from '../openxml/Style';
import {parseSize} from './parseSize';

export function parseSpacing(element: Element, style: CSSStyle) {
  const before = parseSize(element, 'w:before');
  const after = parseSize(element, 'w:after');

  const lineRule = element.getAttribute('w:lineRule');

  if (before) {
    style['margin-top'] = before;
  }
  if (after) {
    style['margin-bottom'] = after;
  }

  const line = parseSize(element, 'w:line');

  if (line) {
    const lineNum = parseInt(line, 10);
    switch (lineRule) {
      case 'auto':
        style['line-height'] = `${(lineNum / 240).toFixed(2)}`;
        break;

      case 'atLeast':
        style['line-height'] = `calc(100% + ${lineNum / 20}pt)`;
        break;

      default:
        style['line-height'] = style['min-height'] = `${lineNum / 20}pt`;
        break;
    }
  }
}

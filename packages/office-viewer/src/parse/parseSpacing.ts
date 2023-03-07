/**
 * 解析 spacing
 * http://officeopenxml.com/WPspacing.php
 */
import {CSSStyle} from '../openxml/Style';
import {WAttr, XMLData} from '../OpenXML';
import {parseSize} from './parseSize';

export function parseSpacing(data: XMLData, style: CSSStyle) {
  const before = parseSize(data, WAttr.before);
  const after = parseSize(data, WAttr.after);

  const lineRule = data[WAttr.lineRule];

  if (before) {
    style['margin-top'] = before;
  }
  if (after) {
    style['margin-bottom'] = after;
  }

  if (WAttr.line in data) {
    const line = parseInt(data[WAttr.line] as string, 10);
    switch (lineRule) {
      case 'auto':
        style['line-height'] = `${(line / 240).toFixed(2)}`;
        break;

      case 'atLeast':
        style['line-height'] = `calc(100% + ${line / 20}pt)`;
        break;

      default:
        style['line-height'] = style['min-height'] = `${line / 20}pt`;
        break;
    }
  }
}

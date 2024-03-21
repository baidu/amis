import {CSSStyle} from '../../openxml/Style';
import {parseSize} from './parseSize';

// http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/trHeight.html
export function parseTrHeight(child: Element, style: CSSStyle) {
  const height = parseSize(child, 'w:val');
  const hRule = child.getAttribute('w:hRule');
  if (hRule === 'exact') {
    style['height'] = height;
  } else if (hRule === 'atLeast') {
    // tr 设置 min-height 似乎是没效果的
    style['height'] = height;
    style['min-height'] = height;
  }
}

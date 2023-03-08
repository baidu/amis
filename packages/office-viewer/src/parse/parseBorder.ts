/**
 * 解析边框转成 css 样式 http://officeopenxml.com/WPborders.php
 */
import {CSSStyle} from '../openxml/Style';
import {WAttr, XMLData, WTag, loopChildren} from '../OpenXML';
import {parseColorAttr} from './parseColor';
import {LengthUsage, parseSize} from './parseSize';
import Word from '../Word';
import {ST_Border} from '../openxml/Types';

const DEFAULT_BORDER_COLOR = 'black';

export function parseBorder(word: Word, data: XMLData) {
  const type = data[WAttr.val];

  if (type === ST_Border.nil || type === ST_Border.none) {
    return 'none';
  }

  let cssType = 'solid';

  // 这里和 css 不完全一致，css 能表现的要少很多，也是导致展现效果难以一致的原因
  switch (type) {
    case ST_Border.dashed:
    case ST_Border.dashDotStroked:
    case ST_Border.dashSmallGap:
      cssType = 'dashed';
      break;
    case ST_Border.dotDash:
    case ST_Border.dotDotDash:
    case ST_Border.dotted:
      cssType = 'dotted';
      break;
    case ST_Border.double:
    case ST_Border.doubleWave:
      cssType = 'double';
      break;
    case ST_Border.inset:
      cssType = 'inset';
      break;
    case ST_Border.outset:
      cssType = 'outset';
      break;
  }

  const color = parseColorAttr(word, data);

  const size = parseSize(data, WAttr.sz, LengthUsage.Border);

  return `${size} solid ${color == 'auto' ? DEFAULT_BORDER_COLOR : color}`;
}

export function parseBorders(word: Word, data: XMLData, style: CSSStyle) {
  loopChildren(data, (key, value) => {
    if (typeof value !== 'object') {
      return;
    }
    switch (key) {
      case WTag.start:
      case WTag.left:
        style['border-left'] = parseBorder(word, value);
        break;
      case WTag.end:
      case WTag.right:
        style['border-right'] = parseBorder(word, value);
        break;

      case WTag.top:
        style['border-top'] = parseBorder(word, value);
        break;

      case WTag.bottom:
        style['border-bottom'] = parseBorder(word, value);
        break;

      // TODO: 还有个 between 不知道是干啥的
      default:
        break;
    }
  });
}

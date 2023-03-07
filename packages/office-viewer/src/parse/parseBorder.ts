/**
 * 解析边框转成 css 样式 http://officeopenxml.com/WPborders.php
 */
import {CSSStyle} from '../openxml/Style';
import {WAttr, XMLData, loopChildren} from '../OpenXML';
import {parseColorAttr} from './parseColor';
import {LengthUsage, parseSize} from './parseSize';

const DEFAULT_BORDER_COLOR = 'black';

export function parseBorder(data: XMLData) {
  const type = data[WAttr.val];

  if (type === 'nil' || type === 'none') {
    return 'none';
  }

  let cssType = 'solid';

  // 这里和 css 不完全一致，css 能表现的要少很多，也是导致展现效果难以一致的原因
  switch (type) {
    case 'dashed':
    case 'dashDotStroked':
    case 'dashSmallGap':
      cssType = 'dashed';
      break;
    case 'dotDash':
    case 'dotDotDash':
    case 'dotted':
      cssType = 'dotted';
      break;
    case 'double':
    case 'doubleWave':
      cssType = 'double';
      break;
    case 'inset':
      cssType = 'inset';
      break;
    case 'outset':
      cssType = 'outset';
      break;
  }

  const color = parseColorAttr(data);

  const size = parseSize(data, WAttr.sz, LengthUsage.Border);

  return `${size} solid ${color == 'auto' ? DEFAULT_BORDER_COLOR : color}`;
}

export function parseBorders(data: XMLData, style: CSSStyle) {
  loopChildren(data, (key, value) => {
    if (typeof value !== 'object') {
      return;
    }
    switch (key) {
      case 'start':
      case 'left':
        style['border-left'] = parseBorder(value);
        break;
      case 'end':
      case 'right':
        style['border-right'] = parseBorder(value);
        break;

      case 'top':
        style['border-top'] = parseBorder(value);
        break;

      case 'bottom':
        style['border-bottom'] = parseBorder(value);
        break;

      // TODO: 还有个 between 不知道是干啥的
      default:
        break;
    }
  });
}

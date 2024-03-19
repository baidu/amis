/**
 * 解析边框转成 css 样式 http://officeopenxml.com/WPborders.php
 */
import {CSSStyle} from '../../openxml/Style';
import {getVal} from '../../OpenXML';
import {parseColorAttr} from './parseColor';
import {LengthUsage, parseSize} from './parseSize';
import Word from '../../Word';
import {ST_Border} from '../../openxml/Types';

// 默认边框颜色
const DEFAULT_BORDER_COLOR = 'black';

/**
 * 解析单个边框样式
 */
export function parseBorder(word: Word, element: Element) {
  const type = getVal(element) as ST_Border;

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

  const color = parseColorAttr(word, element);

  const size = parseSize(element, 'w:sz', LengthUsage.Border);

  return `${size} solid ${color == 'auto' ? DEFAULT_BORDER_COLOR : color}`;
}

/**
 * 解析边框
 */
export function parseBorders(word: Word, element: Element, style: CSSStyle) {
  for (const child of element.children) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'w:start':
      case 'w:left':
        style['border-left'] = parseBorder(word, child);
        break;
      case 'w:end':
      case 'w:right':
        style['border-right'] = parseBorder(word, child);
        break;

      case 'w:top':
        style['border-top'] = parseBorder(word, child);
        break;

      case 'w:bottom':
        style['border-bottom'] = parseBorder(word, child);
        break;

      // TODO: 还有个 between 不知道是干啥的
      default:
        break;
    }
  }
}

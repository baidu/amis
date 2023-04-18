import {CSSStyle} from '../openxml/Style';
import Word from '../Word';
import {parseSize} from './parseSize';

/**
 * 解析 spacing
 * http://officeopenxml.com/WPspacing.php
 */
export function parseSpacing(word: Word, element: Element, style: CSSStyle) {
  const before = parseSize(element, 'w:before');
  const after = parseSize(element, 'w:after');

  const lineRule = element.getAttribute('w:lineRule');

  if (before) {
    style['margin-top'] = before;
  }
  if (after) {
    style['margin-bottom'] = after;
  }

  const line = element.getAttribute('w:line');

  if (line) {
    // 强制行高
    if (word.renderOptions.forceLineHeight) {
      style['line-height'] = word.renderOptions.forceLineHeight;
      return;
    }

    const lineNum = parseInt(line, 10);
    const minLineHeight = word.renderOptions.minLineHeight || 1.0;
    switch (lineRule) {
      case 'auto':
        const lineHeight = Math.max(minLineHeight, lineNum / 240);
        style['line-height'] = `${lineHeight.toFixed(2)}`;
        break;

      case 'atLeast':
        // 不知道这样处理是否正确，先用默认好了
        // style['line-height'] = `calc(100% + ${lineNum / 20}pt)`;
        break;

      default:
        const lineHeightMin = Math.max(minLineHeight, lineNum / 20);
        style['line-height'] = `${lineHeightMin}pt`;
        break;
    }
  }
}

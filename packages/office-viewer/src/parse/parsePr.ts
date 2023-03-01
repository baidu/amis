/**
 * 包括 rPr 及 pPr
 */

import {loopChildren} from '../util/xml';
import {WAttr, WTag} from './Names';
import {parseBorders} from './parseBorder';
import {parseColor, parseColorAttr} from './parseColor';
import {parseInd} from './parseInd';
import {parseSpacing} from './parseSpacing';
/** 将 jc 转成 text-align
 *
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/ST_Jc.html
 */
function jcToTextAlign(jc: string) {
  switch (jc) {
    case 'start':
    case 'left':
      return 'left';
    case 'center':
      return 'center';
    case 'end':
    case 'right':
      return 'right';
    case 'both':
      return 'justify';
    default:
      'left';
  }
  return jc;
}

export function parsePr(data: any) {
  let style: Record<string, string> = {};
  loopChildren(data, (key, value) => {
    switch (key) {
      case WTag.jc:
        style['text-align'] = jcToTextAlign(value);
        break;
      case WTag.pBdr:
        parseBorders(value, style);
        break;
      case WTag.ind:
        parseInd(value, style);
        break;
      case WTag.color:
        style['color'] = parseColor(value);
        break;
      case WTag.shd:
        // http://officeopenxml.com/WPshading.php
        style['background-color'] = parseColorAttr(
          value,
          WAttr.fill,
          'inherit'
        );
        // 这个也能设置前景色
        const color = parseColor(value);
        if (color) {
          style['color'] = color;
        }
        break;
      case WTag.spacing:
        parseSpacing(value, style);
        break;
      case WTag.pStyle:
        // 这个需要特殊处理
        break;
      default:
        console.warn('parseStyle Unknown key', key);
    }
  });

  return style;
}

/**
 * 这个应该是通用 class
 * http://officeopenxml.com/WPstyleParStyles.php
 * @returns 如果找不到就返回空字符串
 */
export function getPStyle(data: any) {
  if (WTag.pStyle in data) {
    return data[WTag.pStyle][WAttr.val];
  }
  return '';
}

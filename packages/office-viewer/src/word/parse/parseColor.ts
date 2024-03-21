/**
 * 解析颜色，转成 css 的颜色
 */

import {Color} from '../../util/color';
import {getAttrPercent, getVal} from '../../OpenXML';
import {ST_Shd} from '../../openxml/Types';
import Word from '../../Word';
import {PresetColorMap} from '../../openxml/colorNameMap';

/**
 * css 里可以识别的颜色
 */
export const cssColors = ['black', 'blue', 'green', 'red', 'white', 'yellow'];

/**
 *
 * 解析属性上的 color，比如  <w:top w:val="single" w:sz="24" w:space="1" w:color="FF0000" />
 * @param attrName color 默认属性
 * @param autoColor 默认值
 * @returns css 颜色
 */
export function parseColorAttr(
  word: Word,
  element: Element,
  attrName: string = 'w:color',
  autoColor: string = 'black'
) {
  const color = element.getAttribute(attrName);

  if (color) {
    if (color == 'auto') {
      return autoColor;
      /**
       * css 里可以识别的颜色
       */
    } else if (cssColors.includes(color)) {
      return color;
    } else if (color in PresetColorMap) {
      return PresetColorMap[color as keyof typeof PresetColorMap];
    }

    return `#${color}`;
  }

  const themeColor = element.getAttribute('w:themeColor');

  return themeColor ? word.getThemeColor(themeColor) : '';
}

/**
 * 专门用来支持 shd 的颜色
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/ST_Shd.html
 */
export function parseShdColor(word: Word, element: Element) {
  let color = element.getAttribute('w:fill') || '';

  const val = getVal(element) as ST_Shd;

  if (color === 'auto') {
    color = 'FFFFFF';
  }

  if (color.length === 6) {
    switch (val) {
      case 'clear':
        return `#${color}`;
      case 'pct10':
        return colorPercent(color, 0.1);
      case 'pct12':
        return colorPercent(color, 0.125);
      case 'pct15':
        return colorPercent(color, 0.15);
      case 'pct20':
        return colorPercent(color, 0.2);
      case 'pct25':
        return colorPercent(color, 0.25);
      case 'pct30':
        return colorPercent(color, 0.3);
      case 'pct35':
        return colorPercent(color, 0.35);
      case 'pct37':
        return colorPercent(color, 0.375);
      case 'pct40':
        return colorPercent(color, 0.4);
      case 'pct45':
        return colorPercent(color, 0.45);
      case 'pct5':
        return colorPercent(color, 0.05);
      case 'pct50':
        return colorPercent(color, 0.5);
      case 'pct55':
        return colorPercent(color, 0.55);
      case 'pct60':
        return colorPercent(color, 0.6);
      case 'pct65':
        return colorPercent(color, 0.65);
      case 'pct70':
        return colorPercent(color, 0.7);
      case 'pct75':
        return colorPercent(color, 0.75);
      case 'pct80':
        return colorPercent(color, 0.8);
      case 'pct85':
        return colorPercent(color, 0.85);
      case 'pct87':
        return colorPercent(color, 0.87);
      case 'pct90':
        return colorPercent(color, 0.9);
      case 'pct95':
        return colorPercent(color, 0.95);

      default:
        console.warn('unsupport shd val', val);
        return `#${color}`;
    }
  }

  return '';
}

/**
 * 用 alpha 来模拟 ptc 功能
 */
function colorPercent(color: string, percent: number): string {
  // 白色取 alpha 没什么意义，转成黑色
  if (color === 'FFFFFF') {
    color = '000000';
  }
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${percent})`;
}

/**
 * 解析 color 标签，比如 <w:color w:themeColor="accent3" />
 * @returns css 颜色
 */
export function parseColor(word: Word, element: Element) {
  return parseColorAttr(word, element, 'w:val');
}

import {WAttr} from './Names';
/**
 * 解析颜色，转成
 */

const knownColors = [
  'black',
  'blue',
  'cyan',
  'darkBlue',
  'darkCyan',
  'darkGray',
  'darkGreen',
  'darkMagenta',
  'darkRed',
  'darkYellow',
  'green',
  'lightGray',
  'magenta',
  'none',
  'red',
  'white',
  'yellow'
];

/**
 *
 * 解析属性上的 color，比如  <w:top w:val="single" w:sz="24" w:space="1" w:color="FF0000" />
 * @param attrName color 默认属性
 * @param autoColor 默认值
 * @returns css 颜色
 */
export function parseColorAttr(
  data: any,
  attrName: string = WAttr.color,
  autoColor: string = 'black'
) {
  const color = data[attrName];

  if (color) {
    if (color == 'auto') {
      return autoColor;
    } else if (knownColors.includes(color)) {
      return color;
    }

    return `#${color}`;
  }

  var themeColor = data[WAttr.themeColor];

  return themeColor ? `var(--docx-${themeColor}-color)` : '';
}

/**
 * 解析 color 标签，比如 <w:color w:themeColor="accent3" />
 * @returns css 颜色
 */
export function parseColor(data: any) {
  return parseColorAttr(data, WAttr.val);
}

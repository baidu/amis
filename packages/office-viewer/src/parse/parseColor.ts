import Word from '../Word';
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
  word: Word,
  element: Element,
  attrName: string = 'w:color',
  autoColor: string = 'black'
) {
  const color = element.getAttribute(attrName);

  if (color) {
    if (color == 'auto') {
      return autoColor;
    } else if (typeof color === 'string' && knownColors.includes(color)) {
      return color;
    }

    return `#${color}`;
  }

  const themeColor = element.getAttribute('w:themeColor');

  return themeColor ? word.getThemeColor(themeColor) : '';
}

/**
 * 解析 color 标签，比如 <w:color w:themeColor="accent3" />
 * @returns css 颜色
 */
export function parseColor(word: Word, element: Element) {
  return parseColorAttr(word, element, 'w:val');
}

/**
 * 渲染自定义字体样式
 */

import {createElement} from '../../util/dom';
import {FontTable} from '../../openxml/word/FontTable';

export function renderFont(fontTable?: FontTable) {
  if (!fontTable) {
    return null;
  }
  const fonts = fontTable.fonts;
  if (!fonts || !fonts.length) {
    return null;
  }
  const style = createElement('style');
  let fontContent = '/** embedded fonts **/';
  for (const font of fontTable.fonts) {
    const fontName = font.name.replace(/['\\]/g, ''); // 简单防止 xss
    const fontPath = font.url;
    if (fontName && fontPath) {
      fontContent += `
      @font-face {
        font-family: '${fontName}';
        src: url('${fontPath}');
      }
      `;
    }
  }
  style.innerHTML = fontContent;
  return style;
}

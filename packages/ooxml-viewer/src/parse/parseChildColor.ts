import {getAttrPercentage, getVal} from '../OpenXML';
import {Color} from '../util/color';
import Word from '../Word';

// 处理 lum 修改
function changeLum(element: Element, colorStr: string) {
  const color = new Color(colorStr);
  if (color.isValid) {
    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'a:lumMod':
          color.lumMod(getAttrPercentage(child, 'val'));
          break;

        case 'a:lumOff':
          color.lumOff(getAttrPercentage(child, 'val'));
          break;
      }
    }
    return color.toHex();
  }

  return colorStr;
}

function changeAlpha(element: Element, colorStr: string) {
  const color = new Color(colorStr);
  if (color.isValid) {
    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w14:alpha':
          const alpha = getVal(child);
          if (alpha) {
            return `rgba(${color.r}, ${color.g}, ${color.b}, ${
              parseInt(alpha, 10) / 100000
            })`;
          }
          break;
      }
    }
    return color.toHex();
  }

  return colorStr;
}

/**
 * 解析子节点颜色，这里其实还有 lumMod 和 lumOff
 */
export function parseChildColor(word: Word, element: Element): string {
  const colorChild = element.firstElementChild;
  if (colorChild) {
    const colorType = colorChild.tagName;
    switch (colorType) {
      case 'a:prstClr':
        const color = getVal(colorChild) || '';
        return changeLum(colorChild, color);

      case 'a:srgbClr':
      case 'w14:srgbClr':
        const rgbColor = getVal(colorChild);
        let srgbClr = changeLum(colorChild, '#' + rgbColor);
        srgbClr = changeAlpha(colorChild, srgbClr);
        return srgbClr;

      case 'a:schemeClr':
        const schemeClr = colorChild.getAttribute('val') || '';
        if (schemeClr) {
          return changeLum(colorChild, word.getThemeColor(schemeClr));
        }

      default:
        console.warn(
          'parseOutline: Unknown color type ',
          colorType,
          colorChild
        );
    }
  }
  return '';
}

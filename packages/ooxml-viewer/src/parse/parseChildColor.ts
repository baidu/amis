import {getAttrPercentage, getVal} from '../OpenXML';
import {Color} from '../util/color';
import Word from '../Word';
import {PresetColorMap} from './colorNameMap';
import {modifyColor} from './modifyColor';

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
        if (color in PresetColorMap) {
          return modifyColor(
            colorChild,
            PresetColorMap[color as keyof typeof PresetColorMap]
          );
        } else {
          console.warn('parseOutline: Unknown color ', color, colorChild);
        }
        break;

      case 'a:srgbClr':
      case 'w14:srgbClr':
        const rgbColor = getVal(colorChild);
        return modifyColor(colorChild, '#' + rgbColor);

      // 其实这两个的 gamma 值不一样，但目前不知道怎么调整
      case 'a:scrgbClr':
      case 'a:scrgbClr':
        const r = getAttrPercentage(colorChild, 'r');
        const g = getAttrPercentage(colorChild, 'g');
        const b = getAttrPercentage(colorChild, 'b');
        const scrgbColor = Color.fromRGB(r, g, b);
        return modifyColor(colorChild, scrgbColor.toHex());
        break;

      case 'a:hslClr':
        const h = getAttrPercentage(colorChild, 'r');
        const s = getAttrPercentage(colorChild, 'g');
        const l = getAttrPercentage(colorChild, 'b');
        const val = getVal(colorChild);
        // 文档例子里有，不确定
        if (val) {
          return modifyColor(colorChild, '#' + val);
        }

        const hslColor = Color.fromHSL(h, s, l);
        return modifyColor(colorChild, hslColor.toHex());

      case 'a:schemeClr':
        const schemeClr = colorChild.getAttribute('val') || '';
        if (schemeClr) {
          return modifyColor(colorChild, word.getThemeColor(schemeClr));
        } else {
          console.warn('parseOutline: Unknown schemeClr ', colorChild);
        }

      case 'a:sysClr':
        // 这里每个系统不一样，所以直接依赖浏览器的能力
        return getVal(colorChild);

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

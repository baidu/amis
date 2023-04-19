import {getAttrPercentage, getVal} from '../OpenXML';
import {Color} from '../util/color';
import {convertAngle} from './parseSize';

// 处理颜色变化
// 20.1.2.3
export function modifyColor(element: Element, colorStr: string) {
  const color = new Color(colorStr);
  if (color.isValid) {
    let alpha = 1;
    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'a:alpha':
        case 'w14:alpha':
          alpha = getAttrPercentage(child, 'val');
          break;

        case 'a:blue':
          color.b = 256 * getAttrPercentage(child, 'val');
          break;

        case 'a:blueMod':
          color.b = color.b * getAttrPercentage(child, 'val');
          break;

        case 'a:blueOff':
          color.b += color.b * getAttrPercentage(child, 'val');
          break;

        case 'a:comp':
          color.comp();
          break;

        case 'a:green':
          color.g = 256 * getAttrPercentage(child, 'val');
          break;

        case 'a:greenMod':
          color.g = color.g * getAttrPercentage(child, 'val');
          break;

        case 'a:blueOff':
          color.g += color.g * getAttrPercentage(child, 'val');
          break;

        case 'a:red':
          color.r = 256 * getAttrPercentage(child, 'val');
          break;

        case 'a:redMod':
          color.r = color.r * getAttrPercentage(child, 'val');
          break;

        case 'a:redOff':
          color.r += color.r * getAttrPercentage(child, 'val');
          break;

        case 'a:lum':
          color.lum(getAttrPercentage(child, 'val'));
          break;

        case 'a:lumMod':
          color.lumMod(getAttrPercentage(child, 'val'));
          break;

        case 'a:lumOff':
          color.lumOff(getAttrPercentage(child, 'val'));
          break;

        case 'a:hue':
          color.hue(convertAngle(child.getAttribute('hue')) / 360);
          break;

        case 'a:hueMod':
          color.hueMod(getAttrPercentage(child, 'val'));
          break;

        case 'a:hueOff':
          color.hueOff(getAttrPercentage(child, 'val'));
          break;

        case 'a:sat':
          color.sat(getAttrPercentage(child, 'val'));
          break;

        case 'a:satMod':
          color.satMod(getAttrPercentage(child, 'val'));
          break;

        case 'a:satOff':
          color.satOff(getAttrPercentage(child, 'val'));
          break;

        case 'a:shade':
          // 根据 17.2.1 里的描述，看起来 lumMod 和 shade 的算法是一样的
          color.lumMod(getAttrPercentage(child, 'val'));
          break;

        default:
          console.log('unknown color modify', child);
          break;
      }
    }
    if (alpha !== 1) {
      return color.toRgba(alpha);
    }
    return color.toHex();
  }

  return colorStr;
}

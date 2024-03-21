import {getAttrPercent, getVal} from '../../OpenXML';
import {Color} from '../../util/color';
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
          alpha = getAttrPercent(child, 'val');
          break;

        case 'a:blue':
          color.b = 256 * getAttrPercent(child, 'val');
          break;

        case 'a:blueMod':
          color.b = color.b * getAttrPercent(child, 'val');
          break;

        case 'a:blueOff':
          color.b += color.b * getAttrPercent(child, 'val');
          break;

        case 'a:comp':
          color.comp();
          break;

        case 'a:green':
          color.g = 256 * getAttrPercent(child, 'val');
          break;

        case 'a:greenMod':
          color.g = color.g * getAttrPercent(child, 'val');
          break;

        case 'a:greenOff':
          color.g += color.g * getAttrPercent(child, 'val');
          break;

        case 'a:red':
          color.r = 256 * getAttrPercent(child, 'val');
          break;

        case 'a:redMod':
          color.r = color.r * getAttrPercent(child, 'val');
          break;

        case 'a:redOff':
          color.r += color.r * getAttrPercent(child, 'val');
          break;

        case 'a:lum':
          color.lum(getAttrPercent(child, 'val'));
          break;

        case 'a:lumMod':
          color.lumMod(getAttrPercent(child, 'val'));
          break;

        case 'a:lumOff':
          color.lumOff(getAttrPercent(child, 'val'));
          break;

        case 'a:hue':
          color.hue(convertAngle(child.getAttribute('hue')) / 360);
          break;

        case 'a:hueMod':
          color.hueMod(getAttrPercent(child, 'val'));
          break;

        case 'a:hueOff':
          color.hueOff(getAttrPercent(child, 'val'));
          break;

        case 'a:sat':
          color.sat(getAttrPercent(child, 'val'));
          break;

        case 'a:satMod':
          color.satMod(getAttrPercent(child, 'val'));
          break;

        case 'a:satOff':
          color.satOff(getAttrPercent(child, 'val'));
          break;

        case 'a:shade':
          color.shade(getAttrPercent(child, 'val'));
          break;

        case 'a:tint':
          color.tint(getAttrPercent(child, 'val'));
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

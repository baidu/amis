/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/spPr_2.html
 */

import {ST_PresetLineDashVal, ST_ShapeType} from '../../Types';
import Word from '../../../Word';
import {Transform} from './Transform';
import {CSSStyle} from './../../Style';
import {parseSize, LengthUsage} from '../../../parse/parseSize';
import {Geom} from './Geom';

function prstDashToCSSBorderType(prstDash: ST_PresetLineDashVal) {
  let borderType = 'solid';
  switch (prstDash) {
    case 'dash':
    case 'dashDot':
    case 'lgDash':
    case 'lgDashDot':
    case 'lgDashDotDot':
    case 'sysDash':
    case 'sysDashDot':
    case 'sysDashDotDot':
      borderType = 'dashed';
      break;

    case 'dot':
    case 'sysDot':
      borderType = 'dotted';
      break;
  }
  return borderType;
}

function parseOutline(word: Word, element: Element, style: CSSStyle) {
  const borderWidth = parseSize(element, 'w', LengthUsage.Emu);
  style['border-width'] = borderWidth;
  style['border-style'] = 'solid';

  for (const child of element.children) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'a:solidFill':
        // 目前只支持 solidFill
        const colorChild = child.firstElementChild;
        if (colorChild) {
          const colorType = colorChild.tagName;
          switch (colorType) {
            case 'a:prstClr':
              const color = colorChild.getAttribute('val') || '';
              style['border-color'] = color;
              break;

            case 'a:srgbClr':
              const rgbColor = colorChild.getAttribute('val') || '';
              style['border-color'] = '#' + rgbColor;

            case 'a:schemeClr':
              const schemeClr = colorChild.getAttribute('val') || '';
              if (schemeClr) {
                style['border-color'] = word.getThemeColor(schemeClr);
              }

            default:
              console.warn(
                'parseOutline: Unknown color type ',
                colorType,
                colorChild
              );
          }
        }
        break;

      case 'a:noFill':
        style['border'] = 'none';
        break;

      case 'a:round':
        // 瞎写的，规范里也没写是多少
        style['border-radius'] = '8%';
        break;

      case 'a:prstDash':
        style['border-style'] = prstDashToCSSBorderType(
          child.getAttribute('val') as ST_PresetLineDashVal
        );
        break;

      default:
        console.warn('parseOutline: Unknown tag ', tagName, child);
    }
  }
}

export class ShapePr {
  xfrm?: Transform;

  // 内置图形
  prstGeom?: Geom;

  // 主要是边框样式
  style?: CSSStyle;

  static fromXML(word: Word, element?: Element | null): ShapePr {
    const shapePr = new ShapePr();
    const style = {};
    shapePr.style = style;
    if (element) {
      for (const child of element.children) {
        const tagName = child.tagName;
        switch (tagName) {
          case 'a:xfrm':
            shapePr.xfrm = Transform.fromXML(word, child);
            break;

          case 'a:prstGeom':
            shapePr.prstGeom = Geom.fromXML(word, child, style);
            break;

          case 'a:ln':
            // http://officeopenxml.com/drwSp-outline.php
            parseOutline(word, child, style);
            break;

          default:
            console.warn('ShapePr: Unknown tag ', tagName, child);
        }
      }
    }

    return shapePr;
  }
}

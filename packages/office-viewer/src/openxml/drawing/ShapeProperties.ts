/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/spPr_2.html
 */

import {ST_PresetLineDashVal, ST_ShapeType} from '../Types';
import Word from '../../Word';
import {Transform} from './Transform';
import {parseSize, LengthUsage} from '../../parse/parseSize';
import {Geom} from './Geom';
import {parseChildColor} from '../../parse/parseChildColor';
import {CustomGeom} from './CustomGeom';

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

export type OutLine = {
  style?: 'solid' | 'dashed' | 'dotted' | string;
  width?: string;
  color?: string;
  radius?: string;
};

function parseOutline(word: Word, element: Element) {
  const borderWidth = parseSize(element, 'w', LengthUsage.Emu);
  const outline: OutLine = {
    width: borderWidth
  };

  outline.style = 'solid';

  for (const child of element.children) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'a:solidFill':
        outline.color = parseChildColor(word, child);

        break;

      case 'a:noFill':
        outline.style = 'none';
        break;

      case 'a:round':
        // 瞎写的，规范里也没写是多少
        outline.radius = '8%';
        break;

      case 'a:prstDash':
        outline.style = prstDashToCSSBorderType(
          child.getAttribute('val') as ST_PresetLineDashVal
        );
        break;

      default:
        console.warn('parseOutline: Unknown tag ', tagName, child);
    }
  }

  return outline;
}

export class ShapePr {
  xfrm?: Transform;

  // 内置图形
  geom?: Geom;

  // 自定义
  custGeom?: CustomGeom;

  // 边框样式
  outline?: OutLine;

  // 填充颜色
  fillColor?: string;

  // 不填充
  noFill?: boolean;

  static fromXML(word: Word, element?: Element | null): ShapePr {
    const shapePr = new ShapePr();

    if (element) {
      for (const child of element.children) {
        const tagName = child.tagName;
        switch (tagName) {
          case 'a:xfrm':
            shapePr.xfrm = Transform.fromXML(word, child);
            break;

          case 'a:prstGeom':
            shapePr.geom = Geom.fromXML(word, child);
            break;

          case 'a:custGeom':
            shapePr.custGeom = CustomGeom.fromXML(word, child);
            break;

          case 'a:ln':
            // http://officeopenxml.com/drwSp-outline.php
            shapePr.outline = parseOutline(word, child);
            break;

          case 'a:noFill':
            shapePr.noFill = true;
            break;

          case 'a:solidFill':
            shapePr.fillColor = parseChildColor(word, child);
            break;

          default:
            console.warn('ShapePr: Unknown tag ', tagName, child);
        }
      }
    }

    return shapePr;
  }
}

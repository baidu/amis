/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/xfrm_2.html
 */

import {convertAngle, LengthUsage, parseSize} from '../../word/parse/parseSize';
import Word from '../../Word';

export interface Off {
  x: string;
  y: string;
}

export interface Ext {
  cx: string;
  cy: string;
}

export class Transform {
  off?: Off;
  ext?: Ext;
  chOff?: Off;
  chExt?: Ext;
  rot?: number;

  static fromXML(word: Word, element: Element): Transform {
    const transform = new Transform();

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'a:off':
          transform.off = {
            x: parseSize(child, 'x', LengthUsage.Emu),
            y: parseSize(child, 'y', LengthUsage.Emu)
          };
          break;

        case 'a:ext':
          transform.ext = {
            cx: parseSize(child, 'cx', LengthUsage.Emu),
            cy: parseSize(child, 'cy', LengthUsage.Emu)
          };
          break;

        case 'a:chOff':
          transform.chOff = {
            x: parseSize(child, 'x', LengthUsage.Emu),
            y: parseSize(child, 'y', LengthUsage.Emu)
          };
          break;

        case 'a:chExt':
          transform.chExt = {
            cx: parseSize(child, 'cx', LengthUsage.Emu),
            cy: parseSize(child, 'cy', LengthUsage.Emu)
          };
          break;

        default:
          console.warn('Transform: Unknown tag ', tagName, child);
      }
    }

    const rot = element.getAttribute('rot');
    if (rot) {
      transform.rot = convertAngle(rot);
    }
    return transform;
  }
}

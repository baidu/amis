/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/xfrm_2.html
 */

import {convertAngle, LengthUsage, parseSize} from '../../parse/parseSize';
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
  rot?: number;

  static fromXML(word: Word, element: Element): Transform {
    const transform = new Transform();

    const off = element.getElementsByTagName('a:off').item(0);
    if (off) {
      transform.off = {
        x: parseSize(off, 'x', LengthUsage.Emu),
        y: parseSize(off, 'y', LengthUsage.Emu)
      };
    }

    const ext = element.getElementsByTagName('a:ext').item(0);
    if (ext) {
      transform.ext = {
        cx: parseSize(ext, 'cx', LengthUsage.Emu),
        cy: parseSize(ext, 'cy', LengthUsage.Emu)
      };
    }

    const rot = element.getAttribute('rot');
    if (rot) {
      transform.rot = convertAngle(rot);
    }
    return transform;
  }
}

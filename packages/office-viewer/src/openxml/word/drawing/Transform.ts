/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/xfrm_2.html
 */

import {LengthUsage, parseSize} from '../../../parse/parseSize';
import Word from '../../../Word';

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

  static fromXML(word: Word, element: Element): Transform {
    const transform = new Transform();

    const off = element.querySelector('off');
    if (off) {
      transform.off = {
        x: parseSize(off, 'x', LengthUsage.Emu),
        y: parseSize(off, 'y', LengthUsage.Emu)
      };
    }

    const ext = element.querySelector('ext');
    if (ext) {
      transform.ext = {
        cx: parseSize(ext, 'cx', LengthUsage.Emu),
        cy: parseSize(ext, 'cy', LengthUsage.Emu)
      };
    }
    return transform;
  }
}

/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/xfrm_2.html
 */

import {LengthUsage, parseSize} from '../../../parse/parseSize';
import {XMLData, ATag, Attr} from '../../../OpenXML';
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

  static fromXML(word: Word, xfrm: XMLData): Transform {
    const transform = new Transform();

    if (ATag.off in xfrm) {
      const off = xfrm[ATag.off] as XMLData;
      transform.off = {
        x: parseSize(off, Attr.x, LengthUsage.Emu),
        y: parseSize(off, Attr.y, LengthUsage.Emu)
      };
    }

    if (ATag.ext in xfrm) {
      const ext = xfrm[ATag.ext] as XMLData;
      transform.ext = {
        cx: parseSize(ext, Attr.cx, LengthUsage.Emu),
        cy: parseSize(ext, Attr.cy, LengthUsage.Emu)
      };
    }
    return transform;
  }
}

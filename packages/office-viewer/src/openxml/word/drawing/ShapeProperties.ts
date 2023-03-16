/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/spPr_2.html
 */

import Word from '../../../Word';
import {Transform} from './Transform';

export class ShapePr {
  xfrm?: Transform;

  static fromXML(word: Word, element?: Element | null): ShapePr {
    const shapePr = new ShapePr();
    const xfrm = element?.querySelector('xfrm');
    if (xfrm) {
      shapePr.xfrm = Transform.fromXML(word, xfrm);
    }
    return shapePr;
  }
}

/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/spPr_2.html
 */

import Word from '../../../Word';
import {Transform} from './Transform';

export class ShapeProperties {
  xfrm?: Transform;

  static fromXML(word: Word, element?: Element | null): ShapeProperties {
    const shapeProperties = new ShapeProperties();
    const xfrm = element?.querySelector('xfrm');
    if (xfrm) {
      shapeProperties.xfrm = Transform.fromXML(word, xfrm);
    }
    return shapeProperties;
  }
}

/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/spPr_2.html
 */

import {XMLData, ATag} from '../../../OpenXML';
import Word from '../../../Word';
import {Transform} from './Transform';

export class ShapeProperties {
  xfrm?: Transform;

  static fromXML(word: Word, data: XMLData): ShapeProperties {
    const shapeProperties = new ShapeProperties();
    if (data[ATag.xfrm]) {
      shapeProperties.xfrm = Transform.fromXML(
        word,
        data[ATag.xfrm] as XMLData
      );
    }
    return shapeProperties;
  }
}

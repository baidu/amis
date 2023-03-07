/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/blipFill_2.html
 */

import {ATag, XMLData} from '../../../OpenXML';
import Word from '../../../Word';
import {Blip} from './Blip';

export class BlipFill {
  blip?: Blip;

  static fromXML(word: Word, data: XMLData): BlipFill {
    const blipFill = new BlipFill();
    blipFill.blip = Blip.fromXML(word, data[ATag.blip] as XMLData);
    return blipFill;
  }
}

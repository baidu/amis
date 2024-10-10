/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/blipFill_2.html
 */

import Word from '../../Word';
import {Blip} from './Blip';

export class BlipFill {
  blip?: Blip;

  static fromXML(word: Word, element?: Element | null): BlipFill {
    const blipFill = new BlipFill();
    const blip = element?.getElementsByTagName('a:blip').item(0);
    if (blip) {
      blipFill.blip = Blip.fromXML(word, blip);
    }

    return blipFill;
  }
}

import {ATag, XMLData} from '../../../OpenXML';
import Word from '../../../Word';
import {Graphic} from './Graphic';

export class Inline {
  graphic: Graphic;

  static fromXML(word: Word, data: XMLData): Inline {
    const inline = new Inline();
    inline.graphic = Graphic.fromXML(word, data[ATag.graphic] as XMLData);
    return inline;
  }
}

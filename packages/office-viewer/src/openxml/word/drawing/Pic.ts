import {PicTag, XMLData} from '../../../OpenXML';
import Word from '../../../Word';
import {BlipFill} from './BlipFill';
import {ShapeProperties} from './ShapeProperties';

export class Pic {
  blipFill: BlipFill;
  spPr: ShapeProperties;

  static fromXML(word: Word, data: XMLData): Pic {
    const pic = new Pic();
    pic.blipFill = BlipFill.fromXML(word, data[PicTag.blipFill] as XMLData);
    pic.spPr = ShapeProperties.fromXML(word, data[PicTag.spPr] as XMLData);
    return pic;
  }
}

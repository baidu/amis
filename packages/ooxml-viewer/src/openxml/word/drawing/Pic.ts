import Word from '../../../Word';
import {BlipFill} from './BlipFill';
import {ShapePr} from './ShapeProperties';

export class Pic {
  blipFill: BlipFill;
  spPr: ShapePr;

  static fromXML(word: Word, element?: Element | null): Pic {
    const pic = new Pic();
    pic.blipFill = BlipFill.fromXML(
      word,
      element?.getElementsByTagName('pic:blipFill').item(0)
    );
    pic.spPr = ShapePr.fromXML(
      word,
      element?.getElementsByTagName('pic:spPr').item(0)
    );
    return pic;
  }
}

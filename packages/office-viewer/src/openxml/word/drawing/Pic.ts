import Word from '../../../Word';
import {BlipFill} from './BlipFill';
import {ShapePr} from './ShapeProperties';

export class Pic {
  blipFill: BlipFill;
  spPr: ShapePr;

  static fromXML(word: Word, element?: Element | null): Pic {
    const pic = new Pic();
    pic.blipFill = BlipFill.fromXML(word, element?.querySelector('blipFill'));
    pic.spPr = ShapePr.fromXML(word, element?.querySelector('spPr'));
    return pic;
  }
}

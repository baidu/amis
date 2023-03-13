import Word from '../../../Word';
import {BlipFill} from './BlipFill';
import {ShapeProperties} from './ShapeProperties';

export class Pic {
  blipFill: BlipFill;
  spPr: ShapeProperties;

  static fromXML(word: Word, element?: Element | null): Pic {
    const pic = new Pic();
    pic.blipFill = BlipFill.fromXML(word, element?.querySelector('blipFill'));
    pic.spPr = ShapeProperties.fromXML(word, element?.querySelector('spPr'));
    return pic;
  }
}

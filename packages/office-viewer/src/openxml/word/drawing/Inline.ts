import Word from '../../../Word';
import {Graphic} from './Graphic';

export class Inline {
  graphic: Graphic;

  static fromXML(word: Word, element: Element): Inline {
    const inline = new Inline();
    const graphic = element.querySelector('graphic');
    if (graphic) {
      inline.graphic = Graphic.fromXML(word, graphic);
    }

    return inline;
  }
}

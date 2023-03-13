import Word from '../../../Word';
import {Inline} from './Inline';

export class Drawing {
  inline: Inline;

  static fromXML(word: Word, element: Element): Drawing | null {
    const drawing = new Drawing();
    const inlineElement = element.querySelector('inline');
    if (inlineElement) {
      drawing.inline = Inline.fromXML(word, inlineElement);
    }

    return drawing;
  }
}

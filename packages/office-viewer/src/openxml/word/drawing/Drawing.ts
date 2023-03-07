import {XMLData, WPTag} from '../../../OpenXML';
import Word from '../../../Word';
import {Inline} from './Inline';

export class Drawing {
  inline: Inline;

  static fromXML(word: Word, data: XMLData): Drawing | null {
    const drawing = new Drawing();
    drawing.inline = Inline.fromXML(word, data[WPTag.inline] as XMLData);
    return drawing;
  }
}

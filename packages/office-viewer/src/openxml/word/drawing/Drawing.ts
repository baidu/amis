import Word from '../../../Word';
import {Pic} from './Pic';

export class Drawing {
  pic: Pic;

  static fromXML(word: Word, element: Element): Drawing | null {
    const drawing = new Drawing();
    const pic = element.querySelector('pic');
    drawing.pic = Pic.fromXML(word, pic);
    return drawing;
  }
}

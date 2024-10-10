import Word from '../../Word';
import {InlineText} from './InlineText';

export class FldSimple {
  instr: string;
  inlineText: InlineText;

  static fromXML(word: Word, element: Element): FldSimple {
    const fldSimple = new FldSimple();
    fldSimple.inlineText = InlineText.fromXML(word, element);

    fldSimple.instr = element.getAttribute('w:instr') || '';

    return fldSimple;
  }
}

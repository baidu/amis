import {getVal} from '../../../OpenXML';
import Word from '../../../Word';

export class NumberPr {
  ilvl: string;
  numId: string;

  static fromXML(word: Word, element: Element): NumberPr {
    const numPr = new NumberPr();

    const ilvl = element.querySelector('ilvl');
    if (ilvl) {
      numPr.ilvl = getVal(ilvl);
    }

    const numId = element.querySelector('numId');
    if (numId) {
      numPr.numId = getVal(numId);
    }
    return numPr;
  }
}

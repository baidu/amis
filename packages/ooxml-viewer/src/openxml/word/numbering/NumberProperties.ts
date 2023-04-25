import {getVal} from '../../../OpenXML';
import Word from '../../../Word';

export class NumberPr {
  ilvl: string;
  numId: string;

  static fromXML(word: Word, element: Element): NumberPr {
    const numPr = new NumberPr();

    const ilvl = element.getElementsByTagName('w:ilvl').item(0);
    if (ilvl) {
      numPr.ilvl = getVal(ilvl);
    }

    const numId = element.getElementsByTagName('w:numId').item(0);
    if (numId) {
      numPr.numId = getVal(numId);
    }
    return numPr;
  }
}

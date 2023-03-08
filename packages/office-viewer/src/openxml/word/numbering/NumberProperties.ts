import {XMLData, WTag, getVal} from '../../../OpenXML';
import Word from '../../../Word';

export class NumberProperties {
  ilvl: string;
  numId: string;

  static fromXML(word: Word, data: XMLData): NumberProperties {
    const numPr = new NumberProperties();

    numPr.ilvl = getVal(data[WTag.ilvl] as XMLData);
    numPr.numId = getVal(data[WTag.numId] as XMLData);

    return numPr;
  }
}

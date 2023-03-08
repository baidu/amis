import {XMLData, WAttr, WTag, getVal, loopChildren} from '../../../OpenXML';
import Word from '../../../Word';
import {Lvl} from './Lvl';

export class Num {
  numId: string;
  abstractNumId: string;
  lvlOverride: {
    lvls: Record<string, Lvl>;
  } = {lvls: {}};

  static fromXML(word: Word, data: XMLData): Num {
    const num = new Num();

    num.numId = getVal(data[WAttr.numId] as XMLData);
    num.abstractNumId = getVal(data[WTag.abstractNumId] as XMLData);

    if (WTag.lvlOverride in data) {
      const lvlOverride = data[WTag.lvlOverride] as XMLData;
      loopChildren(lvlOverride, (key, value) => {
        if (typeof value !== 'object') {
          return;
        }

        switch (key) {
          case WTag.lvl:
            const lvlData = value as XMLData;
            const lvlId = getVal(lvlData[WTag.ilvl] as XMLData);
            num.lvlOverride.lvls[lvlId] = Lvl.fromXML(word, lvlData);
            break;

          default:
            console.warn(`Num: Unknown tag `, key);
        }
      });
    }

    return num;
  }
}

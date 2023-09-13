import {getVal, getValNumber} from '../../../OpenXML';
import Word from '../../../Word';
import {Lvl} from './Lvl';

export class Num {
  numId: string;
  abstractNumId: string;
  lvlOverride: {
    lvls: Record<string, Lvl>;
  } = {lvls: {}};

  static fromXML(word: Word, element: Element): Num {
    const num = new Num();

    num.numId = element.getAttribute('w:numId') || '';
    const abstractNumId = element
      .getElementsByTagName('w:abstractNumId')
      .item(0);

    if (abstractNumId) {
      num.abstractNumId = getVal(abstractNumId);
    }

    const lvlOverride = element.getElementsByTagName('w:lvlOverride').item(0);
    if (lvlOverride) {
      for (const child of lvlOverride.children) {
        const tagName = child.tagName;
        switch (tagName) {
          case 'w:lvl':
            const lvlId = child.getAttribute('w:lvlId') || '';
            num.lvlOverride.lvls[lvlId] = Lvl.fromXML(word, child);
            break;

          case 'w:startOverride':
            const id = child.getAttribute('w:lvlId') || '';
            if (num.lvlOverride.lvls[id]) {
              num.lvlOverride.lvls[id].start = getValNumber(child);
            }
            break;

          default:
            console.warn(`Num: Unknown tag `, tagName, child);
        }
      }
    }

    return num;
  }
}

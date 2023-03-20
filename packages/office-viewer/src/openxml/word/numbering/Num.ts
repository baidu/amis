import {getVal} from '../../../OpenXML';
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
    const abstractNumId = element.querySelector('abstractNumId');

    if (abstractNumId) {
      num.abstractNumId = getVal(abstractNumId);
    }

    const lvlOverride = element.querySelector('lvlOverride');
    if (lvlOverride) {
      for (const child of lvlOverride.children) {
        const tagName = child.tagName;
        switch (tagName) {
          case 'w:lvl':
            const lvlId = child.getAttribute('w:lvlId') || '';
            num.lvlOverride.lvls[lvlId] = Lvl.fromXML(word, child);
            break;

          default:
            console.warn(`Num: Unknown tag `, tagName, child);
        }
      }
    }

    return num;
  }
}

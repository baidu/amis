import {loopChildren, XMLData, WTag} from '../../../OpenXML';
import Word from '../../../Word';
import {AbstractNum} from './AbstractNum';
import {Num} from './Num';

export class Numbering {
  abstractNums: Record<string, AbstractNum> = {};
  nums: Record<string, Num> = {};
  // 某个 numId 当前值，如果要重新渲染文档，需要将这个置空，
  // 第一个 key 是 numId，第二个 key 是 ilvl，第一个 key 会自动初始化
  numData: Record<string, Record<string, number>> = {};

  static fromXML(word: Word, data: XMLData): Numbering {
    const numbering = new Numbering();

    loopChildren(data[WTag.numbering] as XMLData, (key, value) => {
      if (typeof value !== 'object') {
        return;
      }

      switch (key) {
        case WTag.abstractNum:
          const abstractNum = AbstractNum.fromXML(word, value as XMLData);
          numbering.abstractNums[abstractNum.abstractNumId] = abstractNum;
          break;

        case WTag.num:
          const num = Num.fromXML(word, value as XMLData);
          numbering.nums[num.numId] = num;
          numbering.numData[num.numId] = {};
          break;

        default:
          console.warn(`Numbering: Unknown tag `, key);
      }
    });

    return numbering;
  }
}

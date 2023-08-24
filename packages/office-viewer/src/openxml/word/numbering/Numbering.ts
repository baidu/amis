import Word from '../../../Word';
import {AbstractNum} from './AbstractNum';
import {Num} from './Num';

export class Numbering {
  abstractNums: Record<string, AbstractNum> = {};
  nums: Record<string, Num> = {};
  // 某个 numId 当前值，如果要重新渲染文档，需要将这个置空，
  // 第一个 key 是 numId，第二个 key 是 ilvl，第一个 key 会自动初始化
  numData: Record<string, Record<string, number>> = {};

  static fromXML(word: Word, element: Document): Numbering {
    const numbering = new Numbering();

    for (const abstractNumElement of element.getElementsByTagName(
      'w:abstractNum'
    )) {
      const abstractNum = AbstractNum.fromXML(word, abstractNumElement);
      numbering.abstractNums[abstractNum.abstractNumId] = abstractNum;
    }

    for (const numElement of element.getElementsByTagName('w:num')) {
      const num = Num.fromXML(word, numElement);
      numbering.nums[num.numId] = num;
      numbering.numData[num.numId] = {};
    }

    return numbering;
  }
}

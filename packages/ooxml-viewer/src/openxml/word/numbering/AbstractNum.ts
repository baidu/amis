/**
 * lvl 的解析，只支持部分
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/abstractNum.html
 */

import {ST_MultiLevelType} from '../../Types';
import {Lvl} from './Lvl';
import Word from '../../../Word';
import {getVal} from '../../../OpenXML';

export class AbstractNum {
  abstractNumId: string;
  multiLevelType?: ST_MultiLevelType;
  lvls: Record<string, Lvl> = {};

  static fromXML(word: Word, element: Element): AbstractNum {
    const abstractNum = new AbstractNum();

    abstractNum.abstractNumId = element.getAttribute('w:abstractNumId') || '';
    abstractNum.multiLevelType = element.getAttribute(
      'w:multiLevelType'
    ) as ST_MultiLevelType;

    const lvls = element.getElementsByTagName('w:lvl');
    for (const child of lvls) {
      const lvlId = child.getAttribute('w:ilvl') || '';
      abstractNum.lvls[lvlId] = Lvl.fromXML(word, child);
    }

    const multiLevelType = element
      .getElementsByTagName('w:multiLevelType')
      .item(0);

    if (multiLevelType) {
      abstractNum.multiLevelType = getVal(multiLevelType) as ST_MultiLevelType;
    }

    return abstractNum;
  }
}

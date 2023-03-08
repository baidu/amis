/**
 * lvl 的解析，只支持部分
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/abstractNum.html
 */

import {XMLData, WTag, WAttr, loopChildren, getVal} from './../../../OpenXML';

import {ST_MultiLevelType} from '../../Types';
import {Lvl} from './Lvl';
import Word from '../../../Word';

export class AbstractNum {
  abstractNumId: string;
  multiLevelType?: ST_MultiLevelType;
  lvls: Record<string, Lvl> = {};

  static fromXML(word: Word, data: XMLData): AbstractNum {
    const abstractNum = new AbstractNum();

    abstractNum.abstractNumId = data[WAttr.abstractNumId] as string;
    abstractNum.multiLevelType = data[WTag.multiLevelType] as ST_MultiLevelType;

    const lvl = data[WTag.lvl] as XMLData[];

    loopChildren(data, (key, value) => {
      if (typeof value !== 'object') {
        return;
      }

      switch (key) {
        case WTag.multiLevelType:
          abstractNum.multiLevelType = getVal(value) as ST_MultiLevelType;
          break;

        case WTag.lvl:
          const lvlData = value as XMLData;
          const lvlId = lvlData[WAttr.ilvl] as string;
          abstractNum.lvls[lvlId] = Lvl.fromXML(word, lvlData);
          break;
      }
    });

    return abstractNum;
  }
}

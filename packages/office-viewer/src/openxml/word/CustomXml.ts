/**
 * 不知道是啥，主要是为了避免文本内容丢失，目前先当 SmartTag 处理了
 */

import Word from '../../Word';
import {SmartTag} from './SmartTag';

export class CustomXml {
  static fromXML(word: Word, element: Element): SmartTag {
    return SmartTag.fromXML(word, element);
  }
}

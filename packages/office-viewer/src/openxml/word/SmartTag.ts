/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/smartTag.html
 */

import Word from '../../Word';
import {InlineText} from './InlineText';

export class SmartTag extends InlineText {
  static fromXML(word: Word, element: Element): InlineText {
    return InlineText.fromXML(word, element);
  }
}

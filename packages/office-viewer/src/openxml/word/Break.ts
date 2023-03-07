/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/br.html
 */

import {XMLData} from '../../OpenXML';
import Word from '../../Word';

// http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/ST_BrType.html
export enum BreakType {
  column = 'column',
  page = 'page',
  textWrapping = 'textWrapping'
}

// http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/ST_BrClear.html
export enum BreakClear {
  all = 'all',
  left = 'left',
  none = 'none',
  right = 'right'
}

export class Break {
  /**
   * 目前也只支持这种
   */
  type: BreakType.textWrapping;
  clear?: BreakClear;

  static fromXML(word: Word, data: XMLData): Break {
    return new Break();
  }
}

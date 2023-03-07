/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/hyperlink_2.html
 */

import {loopChildren, RAttr, WAttr, WTag, XMLData} from '../../OpenXML';
import {Relationship} from '../../parse/parseRelationship';
import Word from '../../Word';
import {Run} from './Run';

export class Hyperlink {
  anchor?: string;
  relation: Relationship;
  children: Run[] = [];

  addChild(Run: Run): void {
    this.children.push(Run);
  }

  static fromXML(word: Word, data: XMLData): Hyperlink {
    const hyperlink = new Hyperlink();

    const rId = data[RAttr.id] as string;
    if (rId) {
      const rel = word.getRelationship(rId);
      hyperlink.relation = rel;
    } else {
      console.warn('Hyperlink without r:id');
    }

    if (WAttr.anchor in data) {
      hyperlink.anchor = data[WAttr.anchor] as string;
    }

    loopChildren(data, (key, value) => {
      if (typeof value !== 'object') {
        return;
      }
      switch (key) {
        case WTag.r:
          hyperlink.addChild(Run.fromXML(word, value));
          break;
        default:
          console.warn('parse Hyperlink: Unknown key', key);
      }
    });

    return hyperlink;
  }
}

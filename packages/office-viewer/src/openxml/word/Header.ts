/**
 * header 的定义，footer 也是用这个，因为结构是一样的
 */

import {mergeSdt} from '../../word/parse/mergeSdt';
import {parseTable} from '../../word/parse/parseTable';
import Word from '../../Word';
import {Paragraph} from './Paragraph';
import {Table} from './Table';

export type HeaderChild = Paragraph | Table;

export class Header {
  children: HeaderChild[] = [];

  static fromXML(word: Word, doc: Document): Header {
    const footer = new Header();
    const children: HeaderChild[] = [];
    footer.children = children;
    let elm: Document | Element = doc;
    const firstChild = doc.firstElementChild;
    if (
      firstChild &&
      (firstChild.tagName === 'w:hdr' || firstChild.tagName === 'w:ftr')
    ) {
      elm = firstChild;
    }
    for (const child of mergeSdt(elm)) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:p':
          const paragraph = Paragraph.fromXML(word, child);
          children.push(paragraph);
          break;

        case 'w:tbl':
          const table = parseTable(word, child);
          children.push(table);
          break;

        default:
          console.warn('Header.fromXML Unknown key', tagName, child);
      }
    }
    return footer;
  }
}

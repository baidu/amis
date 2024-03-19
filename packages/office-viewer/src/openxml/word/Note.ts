/**
 * footnote 和 endnote 的结构几乎是一样的，所以统一叫 Note 了
 */

import {parseTable} from '../../word/parse/parseTable';
import Word from '../../Word';
import {Paragraph} from './Paragraph';
import {Table} from './Table';

export type NoteChild = Paragraph | Table;

export class Note {
  children: NoteChild[] = [];

  addChild(child: NoteChild) {
    this.children.push(child);
  }

  static fromXML(word: Word, element: Element): Note {
    const note = new Note();
    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:p':
          const paragraph = Paragraph.fromXML(word, child);
          note.addChild(paragraph);
          break;

        case 'w:tbl':
          const table = parseTable(word, child);
          note.addChild(table);
          break;

        default:
          console.warn('Note.fromXML unknown tag', tagName, child);
      }
    }
    return note;
  }
}

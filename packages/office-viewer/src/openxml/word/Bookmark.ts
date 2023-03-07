import {WAttr, XMLData} from '../../OpenXML';
import Word from '../../Word';

export class BookmarkStart {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static fromXML(word: Word, data: XMLData): BookmarkStart {
    const name = data[WAttr.name] as string;
    if (name) {
      return new BookmarkStart(name);
    } else {
      console.warn('Bookmark without name');
      return new BookmarkStart('unknown');
    }
  }
}

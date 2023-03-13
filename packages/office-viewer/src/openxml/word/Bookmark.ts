import Word from '../../Word';

export class BookmarkStart {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static fromXML(word: Word, element: Element): BookmarkStart {
    const name = element.getAttribute('w:name');
    if (name) {
      return new BookmarkStart(name);
    } else {
      console.warn('Bookmark without name');
      return new BookmarkStart('unknown');
    }
  }
}

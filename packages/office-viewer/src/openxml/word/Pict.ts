import Word from '../../Word';

export class Pict {
  src?: string | null;

  static fromXML(word: Word, element: Element): Pict | null {
    const pict = new Pict();

    const imagedataElement = element
      .getElementsByTagName('v:imagedata')
      .item(0);

    if (imagedataElement) {
      const rId = imagedataElement.getAttribute('r:id') || '';
      const rel = word.getDocumentRels(rId);
      if (rel) {
        pict.src = word.loadImage(rel);
      }
    }

    return pict;
  }
}

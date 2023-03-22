import {Relationship} from '../../parse/parseRelationship';
import Word from '../../Word';

export class Pict {
  imagedata?: Relationship;

  static fromXML(word: Word, element: Element): Pict | null {
    const pict = new Pict();

    const imagedataElement = element.querySelector('imagedata');

    if (imagedataElement) {
      const rId = imagedataElement.getAttribute('r:id') || '';
      const rel = word.getDocumentRels(rId);
      if (rel) {
        pict.imagedata = rel;
      }
    }

    return pict;
  }
}

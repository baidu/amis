import {Relationship} from '../../../parse/parseRelationship';
import Word from '../../../Word';

export class Blip {
  embled?: Relationship;

  static fromXML(word: Word, element: Element): Blip {
    const blip = new Blip();
    // 目前值支持 embed 这一种
    const embedId = element.getAttribute('r:embed') || '';
    const rel = word.getDocumentRels(embedId);
    if (rel) {
      blip.embled = rel;
    }

    return blip;
  }
}

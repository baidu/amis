import {Relationship} from '../../../parse/parseRelationship';
import {XMLData, RAttr} from '../../../OpenXML';
import Word from '../../../Word';

export class Blip {
  embled?: Relationship;

  static fromXML(word: Word, data: XMLData): Blip {
    const blip = new Blip();
    // 目前值支持 embed 这一种
    const embedId = data[RAttr.embed] as string;
    const rel = word.getRelationship(embedId);
    if (rel) {
      blip.embled = rel;
    }

    return blip;
  }
}

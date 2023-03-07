import {PicTag, XMLData} from '../../../OpenXML';
import Word from '../../../Word';
import {Pic} from './Pic';

export class GraphicData {
  pic: Pic;

  static fromXML(word: Word, data: XMLData): GraphicData {
    const graphicData = new GraphicData();
    graphicData.pic = Pic.fromXML(word, data[PicTag.pic] as XMLData);
    return graphicData;
  }
}

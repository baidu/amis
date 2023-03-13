import Word from '../../../Word';
import {Pic} from './Pic';

export class GraphicData {
  pic: Pic;

  static fromXML(word: Word, element: Element): GraphicData {
    const graphicData = new GraphicData();
    const pic = element.querySelector('pic');
    graphicData.pic = Pic.fromXML(word, pic);
    return graphicData;
  }
}

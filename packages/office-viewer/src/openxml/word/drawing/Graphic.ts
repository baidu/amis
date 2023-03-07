import {GraphicData} from './GraphicData';
import {XMLData, ATag} from '../../../OpenXML';
import Word from '../../../Word';

export class Graphic {
  graphicData: GraphicData;

  static fromXML(word: Word, data: XMLData): Graphic {
    const graphic = new Graphic();
    graphic.graphicData = GraphicData.fromXML(
      word,
      data[ATag.graphicData] as XMLData
    );
    return graphic;
  }
}

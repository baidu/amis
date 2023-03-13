import {GraphicData} from './GraphicData';

import Word from '../../../Word';

export class Graphic {
  graphicData: GraphicData;

  static fromXML(word: Word, element: Element): Graphic {
    const graphic = new Graphic();
    const graphicData = element.querySelector('graphicData');
    if (graphicData) {
      graphic.graphicData = GraphicData.fromXML(word, graphicData);
    }

    return graphic;
  }
}

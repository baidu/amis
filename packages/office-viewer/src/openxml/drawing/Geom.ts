/**
 * 形状
 */
import {ST_ShapeType} from '../Types';
import Word from '../../Word';
import {parseShapeGuide} from '../../word/parse/parseShape';
import {ShapeGuide} from './Shape';

export class Geom {
  prst: ST_ShapeType;
  avLst?: ShapeGuide[];

  static fromXML(word: Word, element: Element): Geom {
    const geom = new Geom();
    geom.prst = element.getAttribute('prst') as ST_ShapeType;

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'a:avLst': {
          geom.avLst = parseShapeGuide(child);
        }
      }
    }

    return geom;
  }
}

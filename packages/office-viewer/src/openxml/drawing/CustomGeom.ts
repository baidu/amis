/**
 * 自定义形状
 */

import Word from '../../Word';
import {parseShape} from '../../parse/parseShape';
import {Shape} from './Shape';

export class CustomGeom {
  shape: Shape;

  static fromXML(word: Word, element: Element): CustomGeom {
    const geom = new CustomGeom();
    geom.shape = parseShape(element);
    return geom;
  }
}

/**
 * 形状，目前大部分不支持
 */
import {ST_ShapeType} from '../../Types';
import Word from '../../../Word';
import {CSSStyle} from './../../Style';

export class Geom {
  type: ST_ShapeType;

  static fromXML(word: Word, element: Element, style: CSSStyle): Geom {
    const geom = new Geom();
    geom.type = element.getAttribute('prst') as ST_ShapeType;
    // 后面得改成用 SVG 实现
    return geom;
  }
}

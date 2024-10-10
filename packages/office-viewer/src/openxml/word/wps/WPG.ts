/**
 * 图形组，目前是当成 wps 用了
 */

import {WPS} from './WPS';
import Word from '../../../Word';
import {ShapePr} from '../../drawing/ShapeProperties';
import {Pic} from '../../drawing/Pic';

export class WPG {
  wps: WPS[];
  // 组合中的组合
  wpg: WPG[];
  spPr?: ShapePr;
  pic?: Pic;

  static fromXML(word: Word, element: Element) {
    const wpg = new WPG();
    const wps: WPS[] = [];
    wpg.wps = wps;
    wpg.wpg = [];
    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'wpg:cNvGrpSpPr':
          // 和展现无关
          break;

        case 'wpg:grpSpPr':
          wpg.spPr = ShapePr.fromXML(word, child);
          break;

        case 'wps:wsp':
          wps.push(WPS.fromXML(word, child));
          break;

        case 'pic:pic':
          wpg.pic = Pic.fromXML(word, child);
          break;

        case 'wpg:grpSp':
          // 组合中的组合
          wpg.wpg.push(WPG.fromXML(word, child));
          break;

        default:
          console.warn('WPS: Unknown tag ', tagName, child);
      }
    }
    return wpg;
  }
}

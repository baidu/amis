/**
 * 没去不太清楚这个是什么，目前主要用于形状的颜色
 */

import Word from '../../../Word';
import {parseChildColor} from '../../../parse/parseChildColor';

export class WPSStyle {
  lineColor?: string;

  fillColor?: string;

  fontColor?: string;

  static fromXML(word: Word, element: Element) {
    const wpsStyle = new WPSStyle();

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'a:fillRef':
          wpsStyle.fillColor = parseChildColor(word, child);
          break;

        case 'a:lnRef':
          wpsStyle.lineColor = parseChildColor(word, child);
          break;

        case 'a:fontRef':
          wpsStyle.fontColor = parseChildColor(word, child);
          break;
      }
    }

    return wpsStyle;
  }
}

import {CSSStyle} from '../../Style';
import {getValBoolean, loopChildren, WTag, XMLData} from '../../../OpenXML';
import {Tc} from './Tc';
import Word from '../../../Word';

export interface TrProperties {
  cssStyle?: CSSStyle;
}

export class Tr {
  properties: TrProperties;
  children: Tc[] = [];

  static parseTrProperties(word: Word, data: XMLData): TrProperties {
    const cssStyle: CSSStyle = {};

    loopChildren(data, (key, value) => {
      switch (key) {
        case WTag.hidden:
          if (getValBoolean(value)) {
            cssStyle.display = 'none';
          }
          break;
      }
    });

    return {
      cssStyle
    };
  }

  static fromXML(
    word: Word,
    xml: XMLData,
    rowSpanMap: {[key: string]: Tc}
  ): Tr {
    const tr = new Tr();

    let colIndex = 0;
    loopChildren(xml, (key, value) => {
      switch (key) {
        case WTag.tc:
          const tc = Tc.fromXML(word, value as XMLData, colIndex, rowSpanMap);
          if (tc) {
            tr.children.push(tc);
            const colSpan = tc.properties.gridSpan || 1;
            colIndex += colSpan;
          } else {
            colIndex += 1;
          }
          break;
      }
    });

    return tr;
  }
}

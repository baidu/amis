import {CSSStyle} from '../../Style';
import {getVal, getValBoolean} from '../../../OpenXML';
import {Tc} from './Tc';
import Word from '../../../Word';
import {parseTrHeight} from '../../../parse/parseTrHeight';
import {jcToTextAlign} from '../../../parse/jcToTextAlign';
import {Table} from '../Table';

export interface TrProperties {
  cssStyle?: CSSStyle;
}

export class Tr {
  properties: TrProperties;
  tcs: Tc[] = [];

  static parseTrProperties(word: Word, element: Element): TrProperties {
    const cssStyle: CSSStyle = {};

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:hidden':
          if (getValBoolean(child)) {
            cssStyle.display = 'none';
          }
          break;

        case 'w:trHeight':
          parseTrHeight(child, cssStyle);
          break;

        case 'w:jc':
          cssStyle['text-align'] = jcToTextAlign(getVal(child));
          break;

        case 'w:cantSplit':
          // 目前也不支持分页
          break;

        case 'w:tblPrEx':
          // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblPrEx_1.html
          const tableProperties = Table.parseTableProperties(word, child);
          Object.assign(cssStyle, tableProperties.cssStyle);
          break;

        default:
          console.warn(`Tr: Unknown tag `, tagName, child.innerHTML);
      }
    }

    return {
      cssStyle
    };
  }

  static fromXML(
    word: Word,
    element: Element,
    rowSpanMap: {[key: string]: Tc}
  ): Tr {
    const tr = new Tr();

    let colIndex = 0;

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:tc':
          const tc = Tc.fromXML(word, child, colIndex, rowSpanMap);
          if (tc) {
            tr.tcs.push(tc);
            const colSpan = tc.properties.gridSpan || 1;
            colIndex += colSpan;
          } else {
            colIndex += 1;
          }
          break;

        case 'w:trPr':
          tr.properties = Tr.parseTrProperties(word, child);
          break;

        default:
          console.warn(`Tr: Unknown tag `, tagName);
      }
    }

    return tr;
  }
}

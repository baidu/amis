import {CSSStyle} from '../../Style';
import {getVal, getValBoolean} from '../../../OpenXML';
import {parseTblCellSpacing, Tc} from './Tc';
import Word from '../../../Word';
import {parseTrHeight} from '../../../parse/parseTrHeight';
import {jcToTextAlign} from '../../../parse/jcToTextAlign';
import {Table} from '../Table';

export interface TrPr {
  cssStyle?: CSSStyle;

  /**
   * 单元格样式
   */
  tcStyle?: CSSStyle;
}

export class Tr {
  properties: TrPr = {};
  tcs: Tc[] = [];

  static parseTrPr(word: Word, element: Element): TrPr {
    const cssStyle: CSSStyle = {};
    const tcStyle: CSSStyle = {};

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
          const tablePr = Table.parseTablePr(word, child);
          Object.assign(cssStyle, tablePr.cssStyle);
          break;

        case 'w:tblCellSpacing':
          parseTblCellSpacing(child, tcStyle);
          break;

        default:
          console.warn(`Tr: Unknown tag `, tagName, child);
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

    // 做成对象是为了传递引用来修改
    const currentCol = {
      index: 0
    };

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:tc':
          const tc = Tc.fromXML(word, child, currentCol, rowSpanMap);
          if (tc) {
            tr.tcs.push(tc);
          }
          break;

        case 'w:trPr':
          tr.properties = Tr.parseTrPr(word, child);
          break;

        case 'w:tblPrEx':
          // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblPrEx_1.html
          const tablePr = Table.parseTablePr(word, child);
          Object.assign(tr.properties.cssStyle || {}, tablePr.cssStyle);
          break;

        default:
          console.warn(`Tr: Unknown tag `, tagName, child);
      }
    }

    return tr;
  }
}

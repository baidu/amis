import {getVal, getValBoolean} from '../../OpenXML';
import {CSSStyle} from '../../openxml/Style';
import {TrPr} from '../../openxml/word/table/Tr';
import Word from '../../Word';
import {jcToTextAlign} from './jcToTextAlign';
import {parseTablePr} from './parseTablePr';
import {parseTblCellSpacing} from './parseTcPr';
import {parseTrHeight} from './parseTrHeight';

export function parseTrPr(word: Word, element: Element): TrPr {
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
        const tablePr = parseTablePr(word, child);
        Object.assign(cssStyle, tablePr.cssStyle);
        break;

      case 'w:tblCellSpacing':
        parseTblCellSpacing(child, tcStyle);
        break;

      case 'w:cnfStyle':
        // 目前是自动计算的，所以不需要这个了
        break;

      default:
        console.warn(`Tr: Unknown tag `, tagName, child);
    }
  }

  return {
    cssStyle
  };
}

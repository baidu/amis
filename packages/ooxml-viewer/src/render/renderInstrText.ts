import {InstrText} from '../openxml/word/InstrText';
import Word from '../Word';
import {createElement} from '../util/dom';
import renderInlineText from './renderInlineText';

/**
 * 渲染字段指令，目前基本都没实现
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Field%20definitions.html
 * http://officeopenxml.com/WPfieldInstructions.php
 */

export function renderInstrText(word: Word, instrText: InstrText) {
  let {text} = instrText;

  const span = createElement('span');

  const fldSimples = word.currentParagraph?.fldSimples;
  if (fldSimples) {
    // 其实不知道这样做是不是对的
    // 另外就是这里有很多指令还不支持 http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/FILENAME.html
    for (const fldSimple of fldSimples) {
      if (
        fldSimple.instr === text.trim() ||
        text.startsWith(fldSimple.instr + ' ')
      ) {
        renderInlineText(word, fldSimple.inlineText, span);
        break;
      }
    }
  }

  return span;
}

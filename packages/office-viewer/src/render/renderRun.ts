/**
 * run 相关的 http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Run_1.html
 */

import {renderBr} from './renderBr';
import {appendChild, createElement, applyStyle} from '../util/dom';
import Word from '../Word';
import {Run, Text} from '../openxml/word/Run';
import {Break} from '../openxml/word/Break';
import {Drawing} from '../openxml/drawing/Drawing';
import {renderDrawing} from './renderDrawing';
import {setElementStyle} from './setElementStyle';
import {Tab} from '../openxml/word/Tab';
import {renderTab} from './renderTab';
import {renderPict} from './renderPict';
import {Pict} from '../openxml/word/Pict';
import {Ruby} from '../openxml/word/Ruby';
import {renderRuby} from './renderRuby';
import {InstrText} from '../openxml/word/InstrText';
import {renderInstrText} from './renderInstrText';
import {Sym} from '../openxml/word/Sym';
import {renderSym} from './renderSym';
import {cjkspace} from '../util/autoSpace';
import type {Paragraph} from '../openxml/word/Paragraph';
import {renderSoftHyphen} from './renderSoftHyphen';
import {SoftHyphen} from '../openxml/word/SoftHyphen';
import {NoBreakHyphen} from '../openxml/word/NoBreakHyphen';
import {renderNoBreakHyphen} from './renderNoBreakHyphen';
import {Separator} from '../openxml/word/Separator';
import {renderSeparator} from './renderSeparator';

const VARIABLE_CLASS_NAME = 'variable';

/**
 * 对文本进行替换
 */
function renderText(
  span: HTMLElement,
  word: Word,
  text: string,
  paragraph?: Paragraph
) {
  // 简单过滤一下提升性能
  if (text.indexOf('{{') === -1) {
    let finalText;
    if (paragraph?.properties?.autoSpace) {
      finalText = cjkspace(text.split(''));
    } else {
      finalText = text;
    }
    span.textContent = finalText;
  } else {
    span.dataset.originText = text;
    // 加个标识，后续可以通过它来查找哪些变量需要替换，这样就不用重新渲染整个文档了
    span.classList.add(VARIABLE_CLASS_NAME);
    span.textContent = word.replaceText(text);
  }

  // 大于两个空格才转成 nbsp
  let html = span.innerHTML.split('  ').join('&nbsp;&nbsp;');
  span.innerHTML = html;
}

/**
 * 更新文档里的所有变量
 */
export function updateVariableText(word: Word) {
  const spans = word.rootElement.querySelectorAll(`.${VARIABLE_CLASS_NAME}`);
  for (let i = 0; i < spans.length; i++) {
    const span = spans[i] as HTMLElement;
    const text = span.dataset.originText || '';
    span.textContent = word.replaceText(text);
  }
}

/**
 * 渲染 run 节点
 *
 * @param inFldChar 是否在 complex field 里，预留功能，目前还不支持
 */
export default function renderRun(
  word: Word,
  run: Run,
  paragraph?: Paragraph,
  inFldChar?: boolean,
  inHeader?: boolean
) {
  const span = createElement('span');

  word.addClass(span, 'r');

  setElementStyle(word, span, run.properties);

  // run 不好通过 class 来设置 rStyle，所以单独支持一下
  if (run.properties?.rStyle) {
    const style = word.getStyle(run.properties.rStyle);
    if (style?.rPr?.cssStyle) {
      applyStyle(span, style.rPr.cssStyle);
    }
  }

  if (run.children.length === 1 && run.children[0] instanceof Text) {
    const text = run.children[0] as Text;
    renderText(span, word, text.text, paragraph);
  } else {
    for (const child of run.children) {
      if (child instanceof Text) {
        let newSpan = createElement('span');
        renderText(newSpan, word, child.text, paragraph);
        appendChild(span, newSpan);
      } else if (child instanceof Break) {
        const br = renderBr(word, child);
        appendChild(span, br);
      } else if (child instanceof Drawing) {
        appendChild(span, renderDrawing(word, child, inHeader));
      } else if (child instanceof Tab) {
        appendChild(span, renderTab(word, child));
      } else if (child instanceof Pict) {
        appendChild(span, renderPict(word, child));
      } else if (child instanceof Ruby) {
        appendChild(span, renderRuby(word, child));
      } else if (child instanceof InstrText) {
        appendChild(span, renderInstrText(word, child));
      } else if (child instanceof Sym) {
        appendChild(span, renderSym(word, child));
      } else if (child instanceof SoftHyphen) {
        appendChild(span, renderSoftHyphen());
      } else if (child instanceof NoBreakHyphen) {
        appendChild(span, renderNoBreakHyphen());
      } else if (child instanceof Separator) {
        appendChild(span, renderSeparator());
      } else {
        console.warn('unknown child', child);
      }
    }
  }

  return span;
}

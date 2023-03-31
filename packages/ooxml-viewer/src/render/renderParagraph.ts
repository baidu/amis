import {createElement, appendChild, applyStyle} from '../util/dom';
import Word from '../Word';

import {Paragraph, ParagraphPr} from '../openxml/word/Paragraph';
import {Run} from '../openxml/word/Run';
import {BookmarkStart} from './../openxml/word/Bookmark';
import {Hyperlink} from '../openxml/word/Hyperlink';
import renderRun from './renderRun';
import {renderHyperLink} from './renderHyperLink';
import {renderBookmarkStart} from './renderBookmark';
import {renderNumbering} from './renderNumbering';
import {setElementStyle} from './setElementStyle';
import {renderTab} from './renderTab';
import {OMath} from '../openxml/math/OMath';
import {renderOMath} from './renderMath';

/**
 * 渲染段落
 * @param renderEmptySpace 如果是 true 的话，当内容为空时会自动加上 &nbsp;
 */
export default function renderParagraph(
  word: Word,
  paragraph: Paragraph,
  renderEmptySpace = true
) {
  word.currentParagraph = paragraph;
  let p = createElement('p');

  word.addClass(p, 'p');

  const properties = paragraph.properties;

  setElementStyle(word, p, properties);

  // 渲染列表前缀
  if (properties.numPr) {
    appendChild(p, renderNumbering(p, word, properties.numPr));
  }

  if (properties.tabs) {
    for (const tab of properties.tabs) {
      appendChild(p, renderTab(word, tab));
    }
  }

  let inFldChar = false;

  for (const child of paragraph.children) {
    if (child instanceof Run) {
      if (child.fldChar === 'begin') {
        inFldChar = true;
      } else if (child) {
        inFldChar = false;
      }
      appendChild(p, renderRun(word, child, paragraph, inFldChar));
    } else if (child instanceof BookmarkStart) {
      appendChild(p, renderBookmarkStart(word, child));
    } else if (child instanceof Hyperlink) {
      const hyperlink = renderHyperLink(word, child, paragraph);
      appendChild(p, hyperlink);
    } else if (child instanceof OMath) {
      appendChild(p, renderOMath(word, child));
    } else {
      console.warn('unknow pargraph type', child);
    }
  }

  // 空行自动加个空格，不然会没高度
  if (p.innerHTML === '' && renderEmptySpace) {
    p.innerHTML = '&nbsp;';
  }

  return p;
}

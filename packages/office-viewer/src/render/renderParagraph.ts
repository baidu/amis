import {createElement, appendChild, setStyle} from '../util/dom';
import Word from '../Word';

import {Paragraph, ParagraphProperties} from '../openxml/word/Paragraph';
import {Run} from '../openxml/word/Run';
import {BookmarkStart} from './../openxml/word/Bookmark';
import {Hyperlink} from '../openxml/word/Hyperlink';
import renderRun from './renderRun';
import {renderHyperLink} from './renderHyperLink';
import {renderBookmarkStart} from './renderBookmark';
import {renderNumbering} from './renderNumbering';
import {setElementStyle} from './setElementStyle';
import {renderTab} from './renderTab';

/**
 * 渲染段落
 * @param renderEmptySpace 如果是 true 的话，当内容为空时会自动加上 &nbsp;
 */
export default function renderParagraph(
  word: Word,
  paragraph: Paragraph,
  renderEmptySpace = true
) {
  let p = createElement('p');

  p.classList.add('p');

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

  for (const child of paragraph.children) {
    if (child instanceof Run) {
      appendChild(p, renderRun(word, child));
    } else if (child instanceof BookmarkStart) {
      appendChild(p, renderBookmarkStart(word, child));
    } else if (child instanceof Hyperlink) {
      const hyperlink = renderHyperLink(word, child);
      appendChild(p, hyperlink);
    }
  }

  // 空行自动加个空格，不然会没高度
  if (p.innerHTML === '' && renderEmptySpace) {
    p.innerHTML = '&nbsp;';
  }

  return p;
}

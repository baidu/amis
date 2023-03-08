/**
 * 解析段落。类型装换部分参考了 docxjs 的代码
 */

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

export default function renderParagraph(word: Word, paragraph: Paragraph) {
  let p = createElement('p');

  const properties = paragraph.properties;

  setElementStyle(word, p, properties);

  // 渲染列表前缀
  if (properties.numPr) {
    appendChild(p, renderNumbering(word, properties.numPr));
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

  return p;
}

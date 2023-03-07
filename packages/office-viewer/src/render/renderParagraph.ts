/**
 * 解析段落。类型装换部分参考了 docxjs 的代码
 */

import {createElement, appendChild, setStyle} from '../util/dom';
import Word from '../Word';

import {Paragraph} from '../openxml/word/Paragraph';
import {Run} from '../openxml/word/Run';
import {Drawing} from '../openxml/word/drawing/Drawing';
import {BookmarkStart} from './../openxml/word/Bookmark';
import {Hyperlink} from '../openxml/word/Hyperlink';
import renderRun from './renderRun';
import {renderHyperLink} from './renderHyperLink';
import {renderDrawing} from './renderDrawing';
import {renderBookmarkStart} from './renderBookmark';

export default function renderParagraph(word: Word, paragraph: Paragraph) {
  let p = createElement('p');

  const properties = paragraph.properties;

  if (properties.cssStyle) {
    setStyle(p, properties.cssStyle);
  }

  if (properties.pStyle) {
    const className = word.getClassName(properties.pStyle);
    if (className) {
      p.className = className;
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

  return p;
}

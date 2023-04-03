import {appendChild} from '../util/dom';
import Word from '../Word';

import {Run} from '../openxml/word/Run';
import {BookmarkStart} from '../openxml/word/Bookmark';
import {Hyperlink} from '../openxml/word/Hyperlink';
import renderRun from './renderRun';
import {renderHyperLink} from './renderHyperLink';
import {renderBookmarkStart} from './renderBookmark';
import {InlineText} from '../openxml/word/InlineText';

/**
 * 渲染 smart tag
 */
export default function renderInlineText(
  word: Word,
  inlineText: InlineText,
  parent: HTMLElement
) {
  for (const child of inlineText.children) {
    if (child instanceof Run) {
      appendChild(parent, renderRun(word, child));
    } else if (child instanceof BookmarkStart) {
      appendChild(parent, renderBookmarkStart(word, child));
    } else if (child instanceof Hyperlink) {
      const hyperlink = renderHyperLink(word, child);
      appendChild(parent, hyperlink);
    }
  }
}

import {WTag} from '../parse/Names';
import Word from '../Word';
import {renderBookmarkStart} from './renderBookmark';
import {renderDrawing} from './renderDrawing';
import {renderHyperLink} from './renderHyperLink';
import renderParagraph from './renderParagraph';
import renderRun from './renderRun';
import renderTable from './renderTable';

/**
 * 渲染元素的主要入口，因为这可能是递归的
 * @return 如果可以渲染就返回渲染后的元素，否则返回 null
 */
export function renderElement(
  word: Word,
  tagName: string,
  data: any
): HTMLElement | null {
  switch (tagName) {
    case WTag.p:
      return renderParagraph(word, data);
    case WTag.tbl:
      return renderTable(word, data);
    case WTag.r:
      return renderRun(word, data);
    case WTag.hyperlink:
      return renderHyperLink(word, data);
    case WTag.bookmarkStart:
      return renderBookmarkStart(word, data);
    case WTag.drawing:
      return renderDrawing(word, data);
  }

  return null;
}

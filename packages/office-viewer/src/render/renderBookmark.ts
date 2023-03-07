import {BookmarkStart} from '../openxml/word/Bookmark';
import {createElement} from '../util/dom';
import Word from '../Word';

export function renderBookmarkStart(word: Word, bookmarkStart: BookmarkStart) {
  const name = bookmarkStart.name;
  if (name) {
    const bookmark = createElement('a') as HTMLAnchorElement;
    bookmark.name = name;
    bookmark.id = name;
    return bookmark;
  }

  return null;
}

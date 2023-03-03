import {WAttr} from './../parse/Names';
import {createElement} from '../util/dom';
import Word from '../Word';

export function renderBookmarkStart(word: Word, data: any) {
  const bookmark = createElement('a') as HTMLAnchorElement;
  const name = data[WAttr.name];
  if (name) {
    bookmark.name = name;
    bookmark.id = name;
  }

  return bookmark;
}

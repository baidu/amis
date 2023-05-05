/**
 * 渲染 footnotes 和 endnotes，这个需要最后执行
 */

import {Note, NoteChild} from '../openxml/word/Note';
import {Paragraph} from '../openxml/word/Paragraph';
import {Table} from '../openxml/word/Table';
import {appendChild, appendComment, createElement} from '../util/dom';
import Word from '../Word';
import renderParagraph from './renderParagraph';
import renderTable from './renderTable';

function renderNote(
  word: Word,
  noteRoot: HTMLElement,
  type: 'footnote' | 'endnote',
  id: string,
  note: Note
) {
  const noteChild = note.children;
  const noteElement = createElement('div');
  const mark = createElement('a') as HTMLAnchorElement;
  const fName = type + '-' + id;
  mark.name = fName;
  mark.id = fName;
  noteRoot.appendChild(noteElement);

  for (const child of noteChild) {
    if (child instanceof Paragraph) {
      const p = renderParagraph(word, child);
      appendChild(noteElement, p);
    } else if (child instanceof Table) {
      appendChild(noteElement, renderTable(word, child));
    } else {
      console.warn('unknown child', child);
    }
  }
}

/*
 * 过滤掉 0 和 -1 后是否还有其他的值，没有的话就不需要渲染
 */
function hasNote(notes: Record<string, Note>) {
  if (!notes) {
    return false;
  }
  for (const id in notes) {
    if (id !== '0' && id !== '-1') {
      return true;
    }
  }
  return false;
}

export function renderNotes(word: Word) {
  const noteRoot = createElement('div');

  if (hasNote(word.footNotes)) {
    for (const fId in word.footNotes) {
      renderNote(word, noteRoot, 'footnote', fId, word.footNotes[fId]);
    }
  }

  if (hasNote(word.endNotes)) {
    for (const fId in word.endNotes || {}) {
      renderNote(word, noteRoot, 'endnote', fId, word.endNotes[fId]);
    }
  }

  if (noteRoot.children.length) {
    return noteRoot;
  } else {
    return null;
  }
}

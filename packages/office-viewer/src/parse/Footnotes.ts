import Word from '../Word';
import {Note} from '../openxml/word/Note';

export function parseFootnotes(
  word: Word,
  doc: Document
): Record<string, Note> {
  const footnotes: Record<string, Note> = {};
  const footnotesElement = [].slice.call(
    doc.getElementsByTagName('w:footnote')
  );

  for (const footnoteElement of footnotesElement) {
    const footnote = Note.fromXML(word, footnoteElement);
    footnotes[footnoteElement.getAttribute('w:id')] = footnote;
  }

  return footnotes;
}

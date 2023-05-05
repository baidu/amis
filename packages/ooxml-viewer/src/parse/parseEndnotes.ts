import Word from '../Word';
import {Note} from '../openxml/word/Note';

export function parseEndnotes(word: Word, doc: Document): Record<string, Note> {
  const endnotes: Record<string, Note> = {};
  const endnotesElement = [].slice.call(doc.getElementsByTagName('w:endnote'));

  for (const endnoteElement of endnotesElement) {
    const endnote = Note.fromXML(word, endnoteElement);
    endnotes[endnoteElement.getAttribute('w:id')] = endnote;
  }

  return endnotes;
}

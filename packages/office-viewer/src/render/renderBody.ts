import {createElement, appendChild} from '../util/dom';
import Word from '../Word';
import {Body} from '../openxml/word/Body';
import {Paragraph} from '../openxml/word/Paragraph';
import {Table} from '../openxml/word/Table';
import {Hyperlink} from '../openxml/word/Hyperlink';
import renderParagraph from './renderParagraph';
import {renderSection} from './renderSection';
import renderTable from './renderTable';

export default function renderBody(
  word: Word,
  parent: HTMLElement,
  body: Body
) {
  for (const section of body.sections) {
    const sectionEl = renderSection(word, section);
    appendChild(parent, sectionEl);
    for (const child of section.children) {
      if (child instanceof Paragraph) {
        const p = renderParagraph(word, child);
        appendChild(sectionEl, p);
      } else if (child instanceof Table) {
        appendChild(sectionEl, renderTable(word, child));
      } else if (child instanceof Hyperlink) {
      }
    }
    appendChild(parent, sectionEl);
  }
}

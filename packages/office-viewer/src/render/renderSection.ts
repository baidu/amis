import {Section} from '../openxml/word/Section';
import {createElement} from '../util/dom';
import Word from '../Word';

export function renderSection(word: Word, section: Section) {
  const sectionEl = createElement('section') as HTMLElement;

  const props = section.properties;
  const pageSize = props.pageSize;
  if (pageSize) {
    if (!word.renderOptions.ignoreWidth) {
      sectionEl.style.width = pageSize.width;
    }
    if (!word.renderOptions.ignoreHeight) {
      sectionEl.style.height = pageSize.height;
    }
  }

  const pageMargin = props.pageMargin;
  if (pageMargin) {
    sectionEl.style.paddingLeft = pageMargin.left || '0';
    sectionEl.style.paddingRight = pageMargin.right || '0';
    sectionEl.style.paddingTop = pageMargin.top || '0';
    sectionEl.style.paddingBottom = pageMargin.bottom || '0';
  }

  return sectionEl;
}

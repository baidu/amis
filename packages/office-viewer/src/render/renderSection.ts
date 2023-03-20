import {Section} from '../openxml/word/Section';
import {createElement} from '../util/dom';
import Word from '../Word';

/**
 * 渲染「节」，在 word 中每个节都可以有自己的页边距和页面大小设置，但目前其实并没有实现分页展现，等后续再考虑
 */
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

  // 强制控制 padding
  if (word.renderOptions.padding) {
    sectionEl.style.padding = word.renderOptions.padding;
  } else {
    const pageMargin = props.pageMargin;
    if (pageMargin) {
      sectionEl.style.paddingLeft = pageMargin.left || '0';
      sectionEl.style.paddingRight = pageMargin.right || '0';
      sectionEl.style.paddingTop = pageMargin.top || '0';
      sectionEl.style.paddingBottom = pageMargin.bottom || '0';
    }
  }

  return sectionEl;
}

import {Section} from '../openxml/word/Section';
import {createElement} from '../util/dom';
import Word, {WordRenderOptions} from '../Word';

/**
 * 渲染「节」，在 word 中每个节都可以有自己的页边距和页面大小设置，但目前其实并没有实现分页展现，等后续再考虑
 */
export function renderSection(
  word: Word,
  section: Section,
  renderOptions: WordRenderOptions
) {
  const sectionEl = createElement('section') as HTMLElement;

  // 用于后续绝对定位
  sectionEl.style.position = 'relative';

  if (renderOptions.page) {
    if (renderOptions.pageMarginBottom) {
      sectionEl.style.marginBottom = renderOptions.pageMarginBottom + 'px';
    }

    if (renderOptions.pageShadow) {
      sectionEl.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.5)';
    }

    if (renderOptions.pageBackground) {
      sectionEl.style.background = renderOptions.pageBackground;
    }
  }

  const props = section.properties;
  const pageSize = props.pageSize;
  if (pageSize) {
    if (!renderOptions.ignoreWidth) {
      sectionEl.style.width = pageSize.width;
    }
    if (!renderOptions.ignoreHeight) {
      sectionEl.style.height = pageSize.height;
    }
  }

  // 强制控制 padding
  if (renderOptions.padding) {
    sectionEl.style.padding = renderOptions.padding;
  } else {
    const pageMargin = props.pageMargin;
    if (pageMargin) {
      sectionEl.style.paddingLeft = pageMargin.left || '0';
      sectionEl.style.paddingRight = pageMargin.right || '0';
      sectionEl.style.paddingTop = pageMargin.top || '0';
      sectionEl.style.paddingBottom = pageMargin.bottom || '0';
    }
  }

  if (props.cols) {
    if (props.cols.num && props.cols.num > 1) {
      sectionEl.style.columnCount = '' + props.cols.num;
      if (props.cols.space) {
        sectionEl.style.columnGap = props.cols.space;
      }
    }
  }

  return sectionEl;
}

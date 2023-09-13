/**
 * 渲染 body 节点
 */

import {createElement, appendChild, removeChild} from '../util/dom';
import Word, {WordRenderOptions} from '../Word';
import {Body} from '../openxml/word/Body';
import {Paragraph} from '../openxml/word/Paragraph';
import {Table} from '../openxml/word/Table';
import renderParagraph from './renderParagraph';
import {renderSection} from './renderSection';
import renderTable from './renderTable';
import {Section} from '../openxml/word/Section';
import {WDocument} from '../openxml/word/WDocument';

/**
 * 判断是否需要创建一个新 section，包括强制分页和超出了 section 的高宽或宽度
 */
function createNewSection(
  word: Word,
  sectionEnd: SectionEnd,
  child: HTMLElement
) {
  // 支持插入分页符
  if (word.breakPage) {
    word.breakPage = false;
    return true;
  }
  const childBound = child.getBoundingClientRect();
  return (
    childBound.top + childBound.height > sectionEnd.bottom ||
    // 注意这里没有 + childBound.width，因为 width 一般都是 100% 导致容易超出
    childBound.left > sectionEnd.right
  );
}

/**
 * 添加到 section 里，如果超出了就创建一个新的 section
 */
function appendToSection(
  word: Word,
  wDocument: WDocument,
  renderOptions: WordRenderOptions,
  bodyEl: HTMLElement,
  sectionEl: HTMLElement,
  sectionEnd: SectionEnd,
  section: Section,
  child: HTMLElement
) {
  // 如果是第一个节点，即便超长也得写入，不然就会出现一个空 section
  const isFirst = sectionEl.children.length === 0;
  // 首先尝试写入
  appendChild(sectionEl, child);

  // 如果超出了就新建一个 section
  if (!isFirst && createNewSection(word, sectionEnd, child)) {
    const newChild = child.cloneNode(true) as HTMLElement;
    removeChild(sectionEl, child);
    let newSectionEl = renderSection(word, wDocument, section, renderOptions);
    appendChild(bodyEl, newSectionEl);
    appendChild(newSectionEl, newChild);
    sectionEnd = getSectionEnd(section, newSectionEl);
    return {sectionEl: newSectionEl, sectionEnd};
  }

  return {sectionEl, sectionEnd};
}

type SectionEnd = {
  bottom: number;
  right: number;
};

/**
 * 获取 section 结束的位置，也就是最后能放下子元素的位置
 */
function getSectionEnd(section: Section, sectionEl: HTMLElement): SectionEnd {
  const sectionBound = sectionEl.getBoundingClientRect();
  const pageMargin = section.properties.pageMargin;
  let bottom = sectionBound.top + sectionBound.height;
  if (pageMargin?.bottom) {
    bottom = bottom - parseInt(pageMargin.bottom.replace('px', ''), 10);
  }
  let right = sectionBound.left + sectionBound.width;
  if (pageMargin?.right) {
    right = right - parseInt(pageMargin.right.replace('px', ''), 10);
  }
  return {bottom, right};
}

/**
 * 获取缩放比例
 */
function getTransform(
  rootWidth: number,
  section: Section,
  renderOptions: WordRenderOptions
) {
  const props = section.properties;
  const pageSize = props.pageSize;
  if (renderOptions.zoomFitWidth && !renderOptions.ignoreWidth) {
    const pageWidth = pageSize?.width;
    if (rootWidth && pageWidth) {
      let pageWidthNum = parseInt(pageWidth.replace('px', ''), 10);

      if (props.pageMargin) {
        const pageMargin = props.pageMargin;
        pageWidthNum += pageMargin.left
          ? parseInt(pageMargin.left.replace('px', ''), 10)
          : 0;
        pageWidthNum += pageMargin.right
          ? parseInt(pageMargin.right.replace('px', ''), 10)
          : 0;
      }
      const zoomWidth = rootWidth / pageWidthNum;

      return zoomWidth;
    }
  }
  return 1;
}

/**
 * 分页渲染
 * @param isLastSection 是否是最后一节
 */
function renderSectionInPage(
  word: Word,
  wDocument: WDocument,
  bodyEl: HTMLElement,
  renderOptions: WordRenderOptions,
  sectionEl: HTMLElement,
  section: Section,
  isLastSection: boolean
) {
  // 如果不 setTimeout 取到的位置信息不对
  setTimeout(() => {
    let sectionEnd = getSectionEnd(section, sectionEl);
    for (const child of section.children) {
      if (child instanceof Paragraph) {
        const p = renderParagraph(word, child);
        const appendResult = appendToSection(
          word,
          wDocument,
          renderOptions,
          bodyEl,
          sectionEl,
          sectionEnd,
          section,
          p
        );
        sectionEl = appendResult.sectionEl;
        sectionEnd = appendResult.sectionEnd;
      } else if (child instanceof Table) {
        const table = renderTable(word, child);
        const appendResult = appendToSection(
          word,
          wDocument,
          renderOptions,
          bodyEl,
          sectionEl,
          sectionEnd,
          section,
          table
        );
        sectionEl = appendResult.sectionEl;
        sectionEnd = appendResult.sectionEnd;
      } else {
        console.warn('unknown child', child);
      }
    }

    if (isLastSection) {
      sectionEl.style.marginBottom = '0';
    }
  }, 0);
}

/**
 * 渲染文档主体
 */
export default function renderBody(
  root: HTMLElement,
  word: Word,
  bodyEl: HTMLElement,
  wDocument: WDocument,
  body: Body,
  renderOptions: WordRenderOptions
) {
  const page = renderOptions.page || false;

  const rootWidth =
    root.getBoundingClientRect().width -
    (renderOptions.pageWrapPadding || 0) * 2;

  const zooms: number[] = [];

  let index = 0;
  const sections = body.sections;
  const sectionLength = sections.length;
  // 用于最后一个 section 不加 margin-bottom
  let isLastSection = false;
  for (const section of sections) {
    zooms.push(getTransform(rootWidth, section, renderOptions));
    word.currentSection = section;
    let sectionEl = renderSection(word, wDocument, section, renderOptions);
    appendChild(bodyEl, sectionEl);

    index = index + 1;
    if (index === sectionLength) {
      isLastSection = true;
    }
    if (page) {
      renderSectionInPage(
        word,
        wDocument,
        bodyEl,
        renderOptions,
        sectionEl,
        section,
        isLastSection
      );
    } else {
      for (const child of section.children) {
        if (child instanceof Paragraph) {
          const p = renderParagraph(word, child);
          appendChild(sectionEl, p);
        } else if (child instanceof Table) {
          const table = renderTable(word, child);
          appendChild(sectionEl, table);
        } else {
          console.warn('unknown child', child);
        }
      }
    }
  }

  setTimeout(() => {
    if (renderOptions.zoom) {
      // 固定缩放
      bodyEl.style.transformOrigin = '0 0';
      bodyEl.style.transform = `scale(${renderOptions.zoom})`;
    } else if (
      renderOptions.page &&
      renderOptions.zoomFitWidth &&
      !renderOptions.ignoreWidth
    ) {
      // 自适应宽度的缩放
      const minZoom = Math.min(...zooms);
      bodyEl.style.transformOrigin = '0 0';
      bodyEl.style.transform = `scale(${minZoom})`;
    }
  }, 0);
}

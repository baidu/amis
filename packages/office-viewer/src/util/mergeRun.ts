/**
 * 合并 p 下相同的文本，主要是为了方便替换变量
 */

import {parsePr} from '../parse/parsePr';
import Word from '../Word';

/**
 *  是否具有相同样式
 */
function hasSomeStyle(
  word: Word,
  first: Element | null,
  second: Element | null
) {
  const firstStyle = first ? parsePr(word, first, 'r') : {};
  const secondStyle = second ? parsePr(word, second, 'r') : {};
  return JSON.stringify(firstStyle) === JSON.stringify(secondStyle);
}

/**
 * 是否 r 里的 t 有设置 xml:space
 */
function hasTSpace(element: Element) {
  const t = element.getElementsByTagName('w:t')[0];
  if (t) {
    return t.getAttribute('xml:space') === 'preserve';
  }
  return false;
}

function mergeText(first: Element, second: Element) {
  const firstT = first.getElementsByTagName('w:t')[0];
  const secondT = second.getElementsByTagName('w:t')[0];
  if (firstT && secondT) {
    let secondText = secondT.textContent || '';
    firstT.textContent += secondText || '';
  }
}

/**
 * 只支持处理 w:r 下有 w:t 的情况
 */
export function canMerge(element: Element) {
  const tagName = element.tagName;

  const childChildren = element.children;

  let hasText = false;
  let textHasSpace = false;
  for (const childChild of childChildren) {
    if (childChild.tagName === 'w:t') {
      hasText = true;
      textHasSpace = childChild.getAttribute('xml:space') === 'preserve';
      if (textHasSpace) {
        break;
      }
    }
    // 有 tab 的情况下不能合并
    if (childChild.tagName === 'w:tab') {
      return false;
    }
  }
  return tagName === 'w:r' && hasText && !textHasSpace;
}

/**
 * 合并 p 下相同的文本
 */
export function mergeRunInP(word: Word, p: Element) {
  const newElements: Element[] = [];
  let lastRun: Element | null = null;

  for (const child of p.children) {
    const tagName = child.tagName;
    // 避免图片和空格被合并了
    if (canMerge(child)) {
      if (lastRun) {
        const lastRunProps = lastRun.getElementsByTagName('w:rPr')[0];
        const thisProps = child.getElementsByTagName('w:rPr')[0];
        if (hasSomeStyle(word, lastRunProps, thisProps)) {
          mergeText(lastRun, child);
        } else {
          lastRun = child;
          newElements.push(child);
        }
      } else {
        // 说明是第一次运行
        lastRun = child;
        newElements.push(child);
      }
    } else {
      // 忽略这个标签
      if (tagName !== 'w:proofErr') {
        lastRun = null;
        newElements.push(child);
      }
    }
  }

  p.innerHTML = '';

  for (const newElement of newElements) {
    p.appendChild(newElement);
  }
}

/**
 * 合并
 * @param document
 */
export function mergeRun(word: Word, doc: Document) {
  const ps = doc.getElementsByTagName('w:p');
  for (const p of ps) {
    mergeRunInP(word, p);
  }
}

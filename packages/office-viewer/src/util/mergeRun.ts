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

export function mergeRunInP(word: Word, p: Element) {
  const newElements: Element[] = [];
  let lastRun: Element | null = null;

  for (const child of p.children) {
    const tagName = child.tagName;
    if (tagName === 'w:r') {
      if (lastRun) {
        const lastRunProps = lastRun.querySelector('rPr');
        const thisProps = child.querySelector('rPr');
        if (hasSomeStyle(word, lastRunProps, thisProps)) {
          lastRun.textContent += child.textContent || '';
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
      newElements.push(child);
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
  const ps = doc.getElementsByTagName('p');
  for (const p of ps) {
    mergeRunInP(word, p);
  }
}

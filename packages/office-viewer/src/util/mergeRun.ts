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

function mergeText(first: Element, second: Element) {
  const firstT = first.getElementsByTagName('w:t')[0];
  const secondT = second.getElementsByTagName('w:t')[0];
  if (firstT && secondT) {
    let secondText = secondT.textContent || '';
    const space = secondT.getAttribute('xml:space');
    if (space === 'preserve' && secondText === '') {
      secondText = ' ';
    } else {
      secondText = secondText.trim();
    }
    firstT.textContent += secondText || '';
  }
}

/**
 * 合并 p 下相同的文本
 */
export function mergeRunInP(word: Word, p: Element) {
  const newElements: Element[] = [];
  let lastRun: Element | null = null;

  for (const child of p.children) {
    const tagName = child.tagName;
    if (tagName === 'w:r') {
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

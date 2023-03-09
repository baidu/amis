/**
 * 合并 p 下相同的文本，主要是为了方便替换变量
 */

import {XMLData, WTag, Attr, Tag, XMLKeys} from '../OpenXML';
import {parsePr} from '../parse/parsePr';
import Word from '../Word';

function addText(run: XMLData, newRun: XMLData) {
  if (WTag.t in run && WTag.t in newRun) {
    const t = run[WTag.t] as XMLData;
    const newText = newRun[WTag.t] as XMLData;
    t[Tag.text] += newText[Tag.text] as string;

    if (Attr.xmlSpace in newRun) {
      t[Attr.xmlSpace] = newRun[Attr.xmlSpace];
    }
  }
}

/**
 *  是否具有相同样式
 */
function hasSomeStyle(word: Word, first: XMLData, second: XMLData) {
  const firstStyle = parsePr(word, first as XMLData, 'r');
  const secondStyle = parsePr(word, second as XMLData, 'r');
  return JSON.stringify(firstStyle) === JSON.stringify(secondStyle);
}

export function mergeRunInP(word: Word, p: XMLData) {
  const newRuns: XMLData[] = [];
  if (WTag.r in p && Array.isArray(p[WTag.r])) {
    let lastRun = null;
    for (const run of p[WTag.r] as XMLData[]) {
      if (lastRun) {
        const lastRunProps = lastRun[WTag.rPr] as XMLData;
        const tProps = run[WTag.rPr] as XMLData;
        if (hasSomeStyle(word, lastRunProps || {}, tProps || {})) {
          addText(lastRun, run);
        } else {
          lastRun = run;
          newRuns.push(lastRun);
        }
      } else {
        // 说明是第一次运行
        lastRun = run;
        newRuns.push(run);
      }
    }
  }
  if (newRuns.length) {
    p[WTag.r] = newRuns;
  }
}

export function findObjectsWithKey(document: XMLData, key: XMLKeys) {
  const result: XMLData[] = [];

  for (const xmlKey in document) {
    const k = xmlKey as XMLKeys;
    if (k === key) {
      if (Array.isArray(document[k])) {
        result.push(...(document[k] as XMLData[]));
      } else {
        result.push(document[k] as XMLData);
      }
    } else if (typeof document[k] === 'object') {
      result.push(...findObjectsWithKey(document[k] as XMLData, key));
    }
  }

  return result;
}

/**
 * 合并
 * @param document
 */
export function mergeRun(word: Word, document: XMLData) {
  const ps = findObjectsWithKey(document, WTag.p);
  for (const p of ps) {
    mergeRunInP(word, p);
  }
}

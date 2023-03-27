/**
 * 执行变量替换，和普通变量不同，这个支持数组，但因为是提前执行好的，没法再动态生效了
 * 为了避免 word 里不必要的标签要先执行 mergeRun
 */

import Word from '../Word';
import {createObject} from './createObject';

/**
 * 替换单个文本变量
 */
export function replaceT(word: Word, t: Element, data: any) {
  let text = t.textContent || '';
  const evalVar = word.renderOptions.evalVar;
  if (text.startsWith('{{')) {
    text = text.replace(/^{{/g, '').replace(/}}$/g, '');
    const result = String(evalVar(text, data)) || '';
    t.textContent = result;
  }
}

/**
 * 替换表格行
 */
function replaceTableRow(word: Word, tr: Element) {
  const evalVar = word.renderOptions.evalVar;
  const data = word.renderOptions.data;
  const table = tr.parentNode as Element;
  const tcs = tr.getElementsByTagName('w:tc');
  let hasLoop = false;
  let loopArray = [];

  // 查找对应的循环
  for (const tc of tcs) {
    const ts = tc.getElementsByTagName('w:t');
    for (const t of ts) {
      const text = t.textContent || '';
      if (text.startsWith('{{#')) {
        const arrayNameMatch = /{{#([^\}]+)}}/;
        const arrayMatchResult = arrayNameMatch.exec(text);
        if (arrayMatchResult && arrayMatchResult.length > 0) {
          hasLoop = true;
          const arrayName = arrayMatchResult[1];
          const array = evalVar(arrayName, data) as any[];
          if (Array.isArray(array)) {
            loopArray = array;
          }
          // 去掉这个循环变量
          t.textContent = t.textContent!.replace(`{{#${arrayName}}}`, '');
        }
      }
      if (text.indexOf('{{/}}')) {
        // 去掉结束变量
        t.textContent = t.textContent!.replace('{{/}}', '');
      }
    }
  }

  if (hasLoop) {
    // 有循环，复制多行
    for (const item of loopArray) {
      const newTr = tr.cloneNode(true) as Element;
      // 去掉 tr 里的属性，感觉可能会有问题
      for (const attr of newTr.attributes) {
        newTr.removeAttribute(attr.name);
      }

      const ts = newTr.getElementsByTagName('w:t');
      // 将 item 加入上下文
      const rowData = createObject(data, item);
      for (const t of ts) {
        replaceT(word, t, rowData);
      }

      table.appendChild(newTr);
    }
    // 删除原来的行
    table.removeChild(tr);
  }
}

/**
 * 替换表格，目前只支持行
 */
function replaceTable(word: Word, documentData: Document) {
  const evalVar = word.renderOptions.evalVar;
  const trs = [].slice.call(documentData.getElementsByTagName('w:tr'));
  for (const tr of trs) {
    replaceTableRow(word, tr);
  }
}

export function replaceVar(word: Word, documentData: Document) {
  replaceTable(word, documentData);
}

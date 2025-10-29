/**
 * 执行变量替换，和普通变量不同，这个支持数组，但因为是提前执行好的，没法再动态生效了
 * 为了避免 word 里不必要的标签要先执行 mergeRun
 */

import {Pic} from '../openxml/drawing/Pic';
import Word from '../Word';
import {createObject} from './createObject';

/**
 * 替换单个文本变量
 */
export function replaceT(word: Word, t: Element, data: any) {
  let text = t.textContent || '';
  t.textContent = replaceText(word, text, data);
}

/**
 * 替换变量文本
 */
function replaceText(word: Word, text: string, data: any) {
  const evalVar = word.renderOptions.evalVar;
  if (text.startsWith('{{')) {
    text = text.replace(/^{{/g, '').replace(/}}$/g, '');
    const result = evalVar(text, data);
    if (result !== undefined && result !== null) {
      return String(result);
    } else {
      console.warn('var error: [', text, '] not found in data');
      return '';
    }
  }
  return text;
}

// 生成的新 id
let newRelId = 1;

/**
 * 替换图片里的变量
 * @param replaceImage 如果为 true，则会实际替换掉 zip 里的图片，但可能影响性能所以默认不开启，只有下载的时候才开启
 */
async function replaceAlt(
  word: Word,
  cNvPr: Element,
  data: any,
  replaceImage: boolean = false
) {
  if (cNvPr.getAttribute('downloaded')) {
    // 已经替换过了
    return;
  }
  const alt = cNvPr.getAttribute('descr') || '';
  const imageURL = replaceText(word, alt, data);
  cNvPr.setAttribute('descrVar', imageURL);
  if (replaceImage && imageURL) {
    const parentElement = cNvPr.parentElement!.parentElement!;
    const blip = parentElement.getElementsByTagName('a:blip').item(0);
    if (blip) {
      const newId = `rIdn${newRelId}`;
      blip.setAttribute('r:embed', newId);
      const imageResponse = await fetch(imageURL);
      const imageData = await imageResponse.arrayBuffer();
      word.saveNewImage(newId, new Uint8Array(imageData));
      cNvPr.setAttribute('downloaded', 'true');
      newRelId++;
    }
    const pic = Pic.fromXML(word, parentElement);
    if (pic && pic.blipFill && pic.blipFill.blip) {
      const blip = pic.blipFill.blip;
      if (blip.embled) {
      }
    }
  }
}

/**
 * 替换表格行
 */
async function replaceTableRow(
  word: Word,
  tr: Element,
  replaceImage: boolean = false
) {
  const evalVar = word.renderOptions.evalVar;
  const data = word.renderOptions.data;
  const table = tr.parentNode as Element;
  const tcs = tr.getElementsByTagName('w:tc');
  let hasLoop = false;
  let loopArray = [];

  // 查找对应的循环
  for (const tc of tcs as any) {
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
      if (text.indexOf('{{/}}') !== -1) {
        // 去掉结束变量
        t.textContent = t.textContent!.replace('{{/}}', '');
      }
    }
  }

  if (hasLoop) {
    // 有循环，复制多行
    for (const item of loopArray) {
      const newTr = cloneTr(tr);

      const ts = newTr.getElementsByTagName('w:t');
      // 将 item 加入上下文
      const rowData = createObject(data, item);
      for (const t of ts as any) {
        replaceT(word, t, rowData);
      }

      for (const cNvPr of newTr.getElementsByTagName('pic:cNvPr') as any) {
        await replaceAlt(word, cNvPr, rowData, replaceImage);
      }

      table.insertBefore(newTr, tr);
    }

    // 删除原来的行
    table.removeChild(tr);
  }
}

/**
 * 克隆行，并进行一些清理
 */
function cloneTr(tr: Element) {
  const newTr = tr.cloneNode(true) as Element;
  // 去掉 tr 里的属性，感觉可能会有问题
  removeAllAttr(newTr);

  const ps = [].slice.call(newTr.getElementsByTagName('w:p'));
  for (const p of ps) {
    removeAllAttr(p);
  }

  // cnfStyles 基本上都是错的所以删了
  const cnfStyles = [].slice.call(newTr.getElementsByTagName('w:cnfStyle'));
  for (const cnfStyle of cnfStyles) {
    cnfStyle.parentElement?.removeChild(cnfStyle);
  }

  return newTr;
}

/**
 * 删掉所有属性，虽然不知道为啥有些不生效
 */
function removeAllAttr(node: Element) {
  while (node.attributes.length > 0) {
    node.removeAttributeNode(node.attributes[0]);
  }
}

/**
 * 替换表格，目前只支持行
 */
async function replaceTable(
  word: Word,
  documentData: Document,
  replaceImage: boolean = false
) {
  const trs = [].slice.call(documentData.getElementsByTagName('w:tr'));
  for (const tr of trs) {
    await replaceTableRow(word, tr, replaceImage);
  }
}

/**
 * 替换单个图片，必须是不在表格里的
 * @param word
 * @param documentData
 */
async function replaceSingleImage(word: Word, documentData: Document) {
  for (const cNvPr of documentData.getElementsByTagName('pic:cNvPr') as any) {
    await replaceAlt(word, cNvPr, word.renderOptions.data, true);
  }
}

/**
 * 变量替换主入口
 * @param word
 * @param documentData
 * @param replaceImage 是否替换掉图片，只有下载时才替换，避免性能问题
 */
export async function replaceVar(
  word: Word,
  documentData: Document,
  replaceImage: boolean = false
) {
  await replaceTable(word, documentData, replaceImage);
  if (replaceImage) {
    await replaceSingleImage(word, documentData);
  }
}

import {NumberProperties} from '../openxml/word/numbering/NumberProperties';
import {createElement, setStyle} from '../util/dom';
import Word from '../Word';
import {ST_NumberFormat} from '../openxml/Types';
import {setElementStyle} from './setElementStyle';

// https://stackoverflow.com/a/32851198
function romanize(num: number) {
  let lookup = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
  } as {[key: string]: number};
  let roman = '';
  for (let key in lookup) {
    while (num >= lookup[key]) {
      roman += key;
      num -= lookup[key];
    }
  }
  return roman;
}

function convertNumToFormat(numFmt: ST_NumberFormat, num: number): string {
  switch (numFmt) {
    case ST_NumberFormat.decimal:
      return num.toString();

    case ST_NumberFormat.lowerLetter:
      return String.fromCharCode(96 + num);

    case ST_NumberFormat.upperLetter:
      return String.fromCharCode(64 + num);

    case ST_NumberFormat.lowerRoman:
      return romanize(num).toLowerCase();

    case ST_NumberFormat.upperRoman:
      return romanize(num).toUpperCase();

    case ST_NumberFormat.bullet:
      // 原本其实是用
      return '&bull;';

    default:
      return num.toString();
  }
}

/**
 * 生成列表的前缀，为了支持复杂场景，这里使用代码来直接生成内容
 */
export function renderNumbering(
  word: Word,
  numPr: NumberProperties
): HTMLElement | null {
  const numbering = word.numbering;
  const numId = numPr.numId;
  if (!numId) {
    console.warn('renderNumbering: numId is empty');
    return null;
  }

  const num = numbering.nums[numId];

  const abstractNum = numbering.abstractNums[num.abstractNumId];

  let lvls = abstractNum.lvls;

  if (num.lvlOverride) {
    lvls = {...lvls, ...num.lvlOverride.lvls};
  }

  const lvl = lvls[numPr.ilvl];

  if (!lvl) {
    console.warn('renderNumbering: lvl is empty');
    return null;
  }

  const ilvl = numPr.ilvl;

  const ilvlData = numbering.numData[numId];

  if (!ilvlData[ilvl]) {
    ilvlData[ilvl] = lvl.start;
  } else {
    ilvlData[ilvl] += 1;
  }

  const element = createElement('span');

  let lvlText = lvl.lvlText;

  // 格式化内容
  let level = parseInt(ilvl);
  // 获取每个层级的值
  const levelNums = [];
  for (let i = 0; i <= level; i++) {
    const listNumber = ilvlData[i];
    if (listNumber) {
      const numFmt = lvls[i].numFmt;
      const numText = convertNumToFormat(numFmt, listNumber);
      levelNums.push(numText);
    }
  }

  for (let i = 0; i < levelNums.length; i++) {
    const levelNum = levelNums[i];
    lvlText = lvlText.replace(`%${i + 1}`, levelNum);
  }

  setElementStyle(word, element, lvl.pPr);
  setElementStyle(word, element, lvl.rPr);

  if (lvl.numFmt !== ST_NumberFormat.bullet) {
    element.innerHTML = lvlText;
  } else {
    element.innerHTML = '&bull;';
  }

  if (lvl.suff === 'space') {
    element.innerHTML += ' ';
  } else if (lvl.suff === 'tab') {
    element.innerHTML += '&emsp;';
  }

  return element;
}

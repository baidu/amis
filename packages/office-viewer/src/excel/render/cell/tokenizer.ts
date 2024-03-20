import {stringToArray} from '../../../util/stringToArray';
import {IRPrElt} from '../../types/IRPrElt';

export interface Token {
  /**
   * 类型，w 代表单词或汉字，h 代表连字符，s 代表空格，br 代表换行
   */
  type: 'w' | 'h' | 's' | 'br';
  /**
   * 文本样式
   */
  rPr?: IRPrElt;
  /**
   * 文本
   */
  t: string;

  /**
   * 字符宽度，这个宽度需要在后面确定
   */
  w?: number;
}

// 需要合并的字符，也就是当成一个 token，主要是英文单词和数字，后面几个是拉丁语，虽然不知道是不是对的
// 可能还有其它语言的情况，知道了再加
const wordReg = /['a-zA-Z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]/;
// 连字符，如果遇到可以折行
const hyphenReg = /[\u002D\u2010\u2010\u2014]/;
const spaceReg = /\s/;
const lineBreakReg = /\n/;

/**
 * 将文本拆分为 token，主要是保证英文单词不被截断
 * @param text
 */
export function tokenizer(text: string) {
  if (!text) {
    return [];
  }
  // 这里不能用 split，避免表情符号被分开
  const chars = stringToArray(text.replace(/\r\n?/g, '\n'));
  const tokens: Token[] = [];
  let currentWord = '';
  function saveWord() {
    if (currentWord) {
      tokens.push({
        type: 'w',
        t: currentWord
      });
      currentWord = '';
    }
  }
  for (const char of chars) {
    if (wordReg.test(char)) {
      currentWord += char;
      // 换行要放前面，因为后面的 space 会包含换行
    } else if (lineBreakReg.test(char)) {
      if (currentWord) {
        saveWord();
      }
      tokens.push({
        type: 'br',
        t: char
      });
    } else if (spaceReg.test(char)) {
      if (currentWord) {
        saveWord();
      }
      tokens.push({
        type: 's',
        t: char
      });
    } else if (hyphenReg.test(char)) {
      if (currentWord) {
        saveWord();
      }
      tokens.push({
        type: 'h',
        t: char
      });
    } else {
      if (currentWord) {
        saveWord();
      }
      tokens.push({
        type: 'w',
        t: char
      });
    }
  }
  if (currentWord) {
    tokens.push({
      type: 'w',
      t: currentWord
    });
  }

  return tokens;
}

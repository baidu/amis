/**
 * 中英文间自动加空格，基于下面代码改的，去掉了 lodash 依赖
 * https://gist.github.com/wyl8899/e0f31068681023480e20c34f6b19a275
 */

/* Partial implementation from https://zhuanlan.zhihu.com/p/33612593 */

/* 标点 */
// @ts-ignore
const punctuationRegex = /\p{Punctuation}/u;
/* 空格 */
// @ts-ignore
const spaceRegex = /\p{Separator}/u;
/* CJK 字符，中日韩 */

const cjkRegex = // @ts-ignore
  /\p{Script=Han}|\p{Script=Katakana}|\p{Script=Hiragana}|\p{Script=Hangul}/u;

const shouldSpace = (a: string, b: string): boolean => {
  if (cjkRegex.test(a)) {
    return !(
      punctuationRegex.test(b) ||
      spaceRegex.test(b) ||
      cjkRegex.test(b)
    );
  } else {
    return cjkRegex.test(b) && !punctuationRegex.test(a) && !spaceRegex.test(a);
  }
};

const join = (
  parts: string[],
  sepFunc: (a: string, b: string) => string
): string => {
  return parts.reduce((r, p, i) => {
    const sep = i !== 0 ? sepFunc(p, parts[i - 1]) : '';
    return r + sep + p;
  }, '');
};

export const cjkspace = (strings: string[]): string => {
  const filtered = strings.filter(c => c !== undefined && c !== '') as string[];
  return join(filtered, (a, b) => (shouldSpace(a, b) ? ' ' : ''));
};

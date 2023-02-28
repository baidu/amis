/**
 * run 相关的 http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Run_1.html
 */

import Word from '../Word';

export default async function renderRun(word: Word, data: any) {
  const span = document.createElement('span');

  for (const key in data) {
    const value = data[key];
    if (key === 'w:t') {
      if (typeof value === 'string') {
        span.textContent = value;
      } else {
        span.textContent = value['#text'];
      }
    } else {
      console.warn(`renderRun: ${key} is not supported.`);
    }
  }
  return span;
}

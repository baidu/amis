/**
 * 解析 HTML Entity，比如 &#x2F; 转成 /
 * @param text 要解析的值
 */

export const decodeEntity = (text: string) => {
  let textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

/**
 * 解析 br http://officeopenxml.com/WPtextSpecialContent-break.php
 * 其实还有 column 和 page，但在 web 里不好实现，所以目前先简单处理，后续再看看如何处理
 * @returns 生成的 dom 结构
 */

import {Break} from '../openxml/word/Break';
import {createElement} from '../util/dom';

export function renderBr(brak: Break) {
  const br = createElement('br');
  return br;
}

import {createElement} from '../util/dom';
import Word from '../Word';
import renderBody from './renderBody';

import {WDocument} from '../openxml/word/Document';

/**
 * 渲染 document 主要入口
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/document.html
 */
export default function renderDocument(word: Word, document: WDocument) {
  const doc = createElement('article');
  renderBody(word, doc, document.body);
  return doc;
}

/**
 * 渲染 document 主要入口
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/document.html
 */

import {WTag} from '../parse/Names';
import {createElement} from '../util/dom';
import Word from '../Word';
import renderBody from './renderBody';

export default async function renderDocument(word: Word, data: any) {
  const doc = createElement('article');
  const wDocument = data[WTag.document];
  const wBody = wDocument[WTag.body];
  const body = renderBody(word, wBody);
  doc.appendChild(body);
  return doc;
}

/**
 * 渲染 document 主要入口
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/document.html
 */

import Word from '../Word';
import renderBody from './renderBody';

export default async function renderDocument(word: Word) {
  const doc = document.createElement('div');
  const documentData = await word.getXML('word/document.xml');
  const wDocument = documentData['w:document'];
  const wBody = wDocument['w:body'];
  const body = await renderBody(word, wBody);
  doc.appendChild(body);
  return doc;
}

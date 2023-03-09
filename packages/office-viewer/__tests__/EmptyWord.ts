/**
 * 构建一个空 word，主要是很多传参依赖
 */

import Word from '../src/Word';
import {Document, Packer, Paragraph, Tab, TextRun} from 'docx';

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun('Hello World')]
        })
      ]
    }
  ]
});

export async function createWord(): Promise<Word> {
  const buffer = await Packer.toBuffer(doc);
  return await Word.load(buffer);
}

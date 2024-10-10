/**
 * 构建一个空 word，主要是很多传参依赖
 */

import Word from '../src/Word';
import fs from 'fs';
import path from 'path';
import XMLPackageParser from '../src/package/XMLPackageParser';

export function createWord() {
  const xmlContent = fs.readFileSync(
    path.join(__dirname, './docx/empty.xml'),
    'utf-8'
  );
  return new Word(xmlContent, {}, new XMLPackageParser());
}

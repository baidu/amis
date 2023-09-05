import fs from 'fs';
import path from 'path';

import Word from '../../src/Word';
import {replaceVar} from '../../src/util/replaceVar';
import {buildXML} from '../../src/util/xml';
import {mergeRun} from '../../src/util/mergeRun';
import xmlFormat from 'xml-formatter';

export function createWord(fileName: string, data: any) {
  const xmlContent = new Uint8Array(
    fs.readFileSync(path.join(__dirname, fileName), null).buffer
  );
  return new Word(xmlContent, {
    enableVar: true,
    data,
    evalVar: (name, d: any) => {
      if (name in d) {
        return d[name];
      }
      return undefined;
    }
  });
}

test('table-list', async () => {
  const data = {
    users: [
      {
        name: 'u1',
        age: 10,
        location: 'l1'
      },
      {
        name: 'u2',
        age: 11,
        location: 'l2'
      }
    ]
  };

  const word = createWord('./var/table-list.docx', data);

  const documentData = word.getXML('word/document.xml');
  mergeRun(word, documentData);
  await replaceVar(word, documentData);

  const xmlResult = xmlFormat(
    buildXML(documentData.getElementsByTagName('w:tbl').item(0)!),
    {lineSeparator: '\n'}
  );

  const expectResult = fs.readFileSync(
    path.join(__dirname, './var/table-list.xml'),
    'utf-8'
  );

  expect(xmlResult).toBe(expectResult);
});

test('var-space', async () => {
  // 之前空格会影响变量
  const data = {
    date: '2020-01-01'
  };

  const word = createWord('./var/space.docx', data);

  document.body.innerHTML = `
  <div id="root"></div>
`;
  const root = document.getElementById('root')!;
  await word.render(root);

  const spans = document.getElementsByTagName('span');
  const lastSpan = spans.item(spans.length - 1)!;

  expect(lastSpan!.innerHTML).toBe(
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2020-01-01'
  );
});

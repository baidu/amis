import fs from 'fs';
import path from 'path';

import Word from '../src/Word';

export function createWord(fileName: string, data: any) {
  const xmlContent = new Uint8Array(
    fs.readFileSync(path.join(__dirname, fileName), null).buffer
  );
  return new Word(xmlContent, {});
}

export async function snapShotTest(filePath: string) {
  // jsdom 不支持这个函数
  global.URL.createObjectURL = jest.fn(x => 'blob:http://localhost/mock');
  document.body.innerHTML = `
    <div id="root"></div>
  `;
  const root = document.getElementById('root')!;
  const word = createWord(filePath, {});
  await word.render(root);

  expect(root).toMatchSnapshot();
}

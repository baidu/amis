import fs from 'fs';
import path from 'path';
import XMLPackageParser from '../src/package/XMLPackageParser';

import Word from '../src/Word';

export function createWord(fileName: string, data: any) {
  const xmlContent = new Uint8Array(
    fs.readFileSync(path.join(__dirname, fileName), null).buffer
  );
  if (fileName.endsWith('.xml')) {
    return new Word(
      xmlContent as any as ArrayBuffer,
      {},
      new XMLPackageParser()
    );
  }
  return new Word(xmlContent as any as ArrayBuffer, {});
}

export async function snapShotTest(filePath: string) {
  // jsdom 不支持这个函数
  global.URL.createObjectURL = () => 'blob:http://localhost/mock';
  document.body.innerHTML = `
    <div id="root"></div>
  `;
  const root = document.getElementById('root')!;
  const word = createWord(filePath, {});
  await word.render(root);

  // 样式后续单独测试，不然太多冗余了
  expect(root.getElementsByTagName('article')[0]).toMatchSnapshot();
}

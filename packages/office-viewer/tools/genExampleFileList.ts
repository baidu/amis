/**
 * 生成示例文件列表
 */

import {readdir} from 'node:fs/promises';
import {writeFileSync} from 'fs';
import prettier from 'prettier';

async function genFiles(path: string) {
  const fileLists: Record<string, string[]> = {};
  const dirs = (await readdir(path)).filter(
    item => !/(^|\/)\.[^\/\.]/g.test(item)
  );
  for (const dir of dirs) {
    fileLists[dir] = (await readdir(path + '/' + dir)).filter(
      item =>
        (item.endsWith('.xlsx') ||
          item.endsWith('.csv') ||
          item.endsWith('.tsv')) &&
        !item.startsWith('~')
    );
  }
  return fileLists;
}

function writeFile(fileName: string, content: string) {
  prettier.resolveConfig('../../../.prettierrc').then(options => {
    const formatted = prettier.format(content, {
      ...options,
      parser: 'typescript'
    });
    writeFileSync(fileName, formatted);
  });
}

(async () => {
  const excelFiles = genFiles('__tests__/xlsx/');
  writeFile(
    'examples/excelFileList.ts',
    `export default ${JSON.stringify(await excelFiles, null, 2)};`
  );
})();

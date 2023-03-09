/**
 * 本地测试例子
 */

import Word from '../src/Word';

const appElement = document.getElementById('app') as HTMLElement;

const testFile = '__tests__/docx/helloworld.docx';

(async () => {
  const file = await (await fetch(testFile)).blob();

  const word = await Word.load(file, {
    bulletUseFont: true,
    replaceVar: true,
    data: {var: 'hello'}
  });

  await word.render(appElement);
})();

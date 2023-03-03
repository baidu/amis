import Word from '../src/Word';

const appElement = document.getElementById('app');

const testFile = '__tests__/docx/helloworld.docx';

(async () => {
  const file = await (await fetch(testFile)).blob();

  const word = await Word.load(file, {
    replaceVar: true,
    data: {var: 'hello'}
  });

  const render = await word.render();
  appElement?.appendChild(render);
})();

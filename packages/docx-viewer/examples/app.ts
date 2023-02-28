import renderDocument from '../src/render/renderDocument';
import Word from '../src/Word';

const appElement = document.getElementById('app');

const testFile = '__tests__/docx/helloworld.docx';

(async () => {
  const file = await (await fetch(testFile)).blob();

  const word = await Word.load(file);

  const document = await word.getXML('word/document.xml');

  console.log(document);

  const render = await word.render();
  appElement?.appendChild(render);
})();

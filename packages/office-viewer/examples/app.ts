/**
 * 本地测试例子
 */

import XMLPackageParser from '../src/package/XMLPackageParser';
import Word from '../src/Word';

const viewerElement = document.getElementById('viewer') as HTMLElement;

const testDir = '__tests__/docx';

const fileLists = {
  simple: ['helloworld.docx', 'list.docx', 'tableborder.docx'],
  docx4j: [
    'ArialUnicodeMS.docx',
    'DOCPROP_builtin.docx',
    'FontEmbedded.docx',
    'Headers.docx',
    'Images.docx',
    'Symbols.docx',
    'Word2007-fonts.docx',
    'chart.docx',
    'chunk.docx',
    'decracdiscrim1.docx',
    'docProps.docx',
    'fonts-modesOfApplication.docx',
    'hyperlinks-internal.docx',
    'sample-docx.docx',
    'sample-docxv2.docx',
    'tableborder.docx',
    'tables.docx',
    'toc.docx',
    'unmarshallFromTemplateDirtyExample.docx',
    'unmarshallFromTemplateExample.docx',
    'numberingrestart.xml',
    'sample-docx.xml',
    'table-features.xml',
    'table-spans.xml'
  ]
};

/**
 * 生成左侧文件列表
 */
(function genFileList() {
  const fileListElement = document.getElementById('fileList')!;
  for (const dirName in fileLists) {
    fileListElement.innerHTML += `<h2 class="dir">${dirName}</h2>`;
    const dir = dirName as keyof typeof fileLists;
    for (const file of fileLists[dir]) {
      const fileName = file.split('.')[0];
      fileListElement.innerHTML += `<div class="file" data-path="${dirName}/${file}" title="file">${fileName}</div>`;
    }
  }

  document.querySelectorAll('.file').forEach(file => {
    file.addEventListener('click', elm => {
      const fileName = (elm.target as Element).getAttribute('data-path')!;
      history.pushState({fileName}, fileName, `?file=${fileName}`);
      renderDocx(fileName);
    });
  });
})();

async function renderDocx(fileName: string) {
  const filePath = `${testDir}/${fileName}`;
  const file = await (await fetch(filePath)).blob();
  let word: Word;
  if (filePath.endsWith('.xml')) {
    word = await Word.load(file, {}, new XMLPackageParser());
  } else {
    word = await Word.load(file, {});
  }

  await word.render(viewerElement);
}

const url = new URL(location.href);

const initFile = url.searchParams.get('file');

if (initFile) {
  renderDocx(initFile);
}

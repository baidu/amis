/**
 * 本地测试例子
 */

import XMLPackageParser from '../src/package/XMLPackageParser';
import Word from '../src/Word';

const viewerElement = document.getElementById('viewer') as HTMLElement;

const testDir = '__tests__/docx';

const fileLists = {
  simple: [
    'br.xml',
    'bold.xml',
    'drop-cap.xml',
    'em.xml',
    'embed-font.xml',
    'hideMark.xml',
    'highlight.xml',
    'image.xml',
    'info.xml',
    'link.xml',
    'list.xml',
    'math.xml',
    'noBreakHyphen.xml',
    'pinyin.xml',
    'svg.xml',
    'sym.xml',
    'shadow.xml',
    'shape-ellipse.xml',
    'shape-custom.xml',
    'all-shape-1.xml',
    'all-shape-2.xml',
    'tableborder.xml',
    'tablestyle.xml',
    'textbox.xml',
    'textbox-background.xml',
    'textbox-behindDoc.xml',
    'textbox-vert.xml',
    'textbox-rotation.xml',
    'textbox-order.xml',
    'tooltip.xml',
    'w.xml',
    'jianli.docx',
    'text-background.docx'
  ],
  docx4j: [
    'ArialUnicodeMS.docx',
    'Symbols.docx',
    'Word2007-fonts.docx',
    'chart.docx',
    'decracdiscrim1.docx',
    'docProps.docx',
    'fonts-modesOfApplication.docx',
    'hyperlinks-internal.docx',
    'toc.docx',
    'unmarshallFromTemplateDirtyExample.docx',
    'unmarshallFromTemplateExample.docx',
    'numberingrestart.xml',
    'sample-docx.xml',
    'table-features.xml',
    'table-spans.xml'
  ]
};

// local storage 里的 key
const pageKey = 'page';

const page = !!localStorage.getItem(pageKey) || false;

if (page) {
  // 不知道为啥，大概是 vite 的问题
  setTimeout(() => {
    const pageSwitch = document.getElementById(
      'switchPage'
    )! as HTMLInputElement;
    pageSwitch.checked = true;
  }, 0);
}

(window as any).switchPage = (checked: boolean) => {
  if (checked) {
    localStorage.setItem(pageKey, 'true');
  } else {
    localStorage.removeItem(pageKey);
  }

  location.reload();
};

/**
 * 生成左侧文件列表
 */

const fileListElement = document.getElementById('fileList')!;
for (const dirName in fileLists) {
  fileListElement.innerHTML += `<h2 class="dir">${dirName}</h2>`;
  const dir = dirName as keyof typeof fileLists;
  for (const file of fileLists[dir]) {
    const fileName = file.split('.')[0];
    fileListElement.innerHTML += `<div class="file" data-path="${dirName}/${file}" title="${file}">${fileName}</div>`;
  }
}

document.querySelectorAll('.file').forEach(file => {
  file.addEventListener('click', elm => {
    const fileName = (elm.target as Element).getAttribute('data-path')!;
    history.pushState({fileName}, fileName, `?file=${fileName}`);
    renderDocx(fileName);
  });
});

const data = {
  var: 'amis'
};
const renderOptions = {
  debug: true,
  page
};

async function renderDocx(fileName: string) {
  const filePath = `${testDir}/${fileName}`;
  const file = await (await fetch(filePath)).arrayBuffer();
  let word: Word;

  if (filePath.endsWith('.xml')) {
    word = new Word(file, renderOptions, new XMLPackageParser());
  } else {
    word = new Word(file, renderOptions);
  }

  const fileNameSplit = fileName.split('/');
  const downloadName = fileNameSplit[fileNameSplit.length - 1].replace(
    '.xml',
    '.docx'
  );

  (window as any).downloadDocx = () => {
    word.download(downloadName);
  };

  (window as any).printDocx = () => {
    word.print();
  };

  word.render(viewerElement);
}

const url = new URL(location.href);

const initFile = url.searchParams.get('file');

if (initFile) {
  renderDocx(initFile);
}

// 支持临时拖拽文件到页面里显示
document.addEventListener('dragover', function (event) {
  event.preventDefault();
});

document.addEventListener(
  'drop',
  e => {
    e.preventDefault();
    let dt = e.dataTransfer!;
    let files = dt.files;
    renderWord(files[0]);
  },
  false
);

function renderWord(file: File) {
  const reader = new FileReader();
  reader.onload = _e => {
    const data = reader.result as ArrayBuffer;
    let word;
    if (file.name.endsWith('.xml')) {
      word = new Word(data, renderOptions, new XMLPackageParser());
    } else {
      word = new Word(data, renderOptions);
    }
    word.render(viewerElement);
  };
  reader.readAsArrayBuffer(file);
}

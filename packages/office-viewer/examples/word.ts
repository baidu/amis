/**
 * 本地测试例子
 */
import {App} from './common';

const viewerElement = document.getElementById('viewer') as HTMLElement;

const testDir = '/__tests__/docx';

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
    'image-var.docx',
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
    'text-background.docx',
    'group.docx',
    'group-in-group.docx',
    'shape-group.docx',
    'tab2.xml'
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

const data = {
  date: 'amis',
  list: [
    {
      item1: 'item1.0',
      item2: 'item2.0',
      img: '/examples/static/image/firefox.jpg'
    },
    {
      item1: 'item1.1',
      item2: 'item2.1',
      img: '/examples/static/image/ie.png'
    }
  ],
  list2: [
    {
      item1: 'item2-1.0',
      item2: 'item2-2.0',
      img: '/examples/static/image/firefox.jpg'
    },
    {
      item1: 'item2-1.1',
      item2: 'item2-2.1',
      img: '/examples/static/image/ie.png'
    }
  ],
  sum: 'sum20',
  aImg: '/examples/static/image/ie.png'
};

const renderOptions = {
  debug: true,
  page,
  data,
  enableVar: true
};

new App(testDir, fileLists, viewerElement, renderOptions);

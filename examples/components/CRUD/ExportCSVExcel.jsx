export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
  title: 'CSV 导出的是原始数据，而 Excel 是尽可能还原展现效果',
  body: {
    type: 'crud',
    headerToolbar: ['export-excel', 'export-csv'],
    data: {
      items: [
        {
          icon: '../../../examples/static/ie.png',
          link: 'https://www.microsoft.com/',
          engine: 'Trident',
          browser: 'Internet Explorer 4.2',
          platform: 'Win 95+',
          version: '4',
          grade: 'A'
        },
        {
          icon: '../../../examples/static/ie.png',
          link: 'https://www.microsoft.com/',
          engine: 'Trident',
          browser: 'Internet Explorer 4.2',
          platform: 'Win 95+',
          version: '4',
          grade: 'B'
        },
        {
          icon: '../../../examples/static/ie.png',
          link: 'https://www.microsoft.com/',
          engine: 'Trident',
          browser: 'AOL browser (AOL desktop)',
          platform: 'Win 95+',
          version: '4',
          grade: 'C'
        },
        {
          icon: '../../../examples/static/ie.png',
          link: 'https://www.microsoft.com/',
          engine: 'Trident',
          browser: 'AOL browser (AOL desktop)',
          platform: 'Win 98',
          version: '3',
          grade: 'A'
        },
        {
          icon: '../../../examples/static/ie.png',
          link: 'https://www.microsoft.com/',
          engine: 'Trident',
          browser: 'AOL browser (AOL desktop)',
          platform: 'Win 98',
          version: '4',
          grade: 'A'
        },
        {
          icon: '../../../examples/static/firefox.png',
          link: 'https://www.mozilla.org/',
          engine: 'Gecko',
          browser: 'Firefox 1.0',
          platform: 'Win 98+ / OSX.2+',
          version: '4',
          grade: 'A'
        },
        {
          icon: '../../../examples/static/firefox.png',
          link: 'https://www.mozilla.org/',
          engine: 'Gecko',
          browser: 'Firefox 1.0',
          platform: 'Win 98+ / OSX.2+',
          version: '5',
          grade: 'A'
        },
        {
          icon: '../../../examples/static/firefox.png',
          link: 'https://www.mozilla.org/',
          engine: 'Gecko',
          browser: 'Firefox 2.0',
          platform: 'Win 98+ / OSX.2+',
          version: '5',
          grade: 'B'
        },
        {
          icon: '../../../examples/static/firefox.png',
          link: 'https://www.mozilla.org/',
          engine: 'Gecko',
          browser: 'Firefox 2.0',
          platform: 'Win 98+ / OSX.2+',
          version: '5',
          grade: 'C'
        },
        {
          icon: '../../../examples/static/firefox.png',
          link: 'https://www.mozilla.org/',
          engine: 'Gecko',
          browser: 'Firefox 2.0',
          platform: 'Win 98+ / OSX.2+',
          version: '5',
          grade: 'D'
        }
      ]
    },
    combineNum: 3,
    columns: [
      {
        name: 'icon',
        label: '图标',
        type: 'image'
      },
      {
        name: 'link',
        label: '官网',
        type: 'link'
      },
      {
        name: 'engine',
        label: '引擎'
      },
      {
        name: 'browser',
        label: '浏览器'
      },
      {
        name: 'platform',
        label: '操作系统'
      },
      {
        name: 'version',
        label: '引擎版本'
      },
      {
        name: 'grade',
        label: 'CSS等级',
        type: 'mapping',
        map: {
          A: '优',
          B: '中',
          C: '差',
          D: '极差'
        }
      }
    ]
  }
};

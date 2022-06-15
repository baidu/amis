export default {
  title: 'CSV 导出的是原始数据，而 Excel 是尽可能还原展现效果',
  body: {
    type: 'crud',
    headerToolbar: ['export-excel', 'export-csv'],
    data: {
      items: [
        {
          link: 'https://www.microsoft.com/',
          icon: __uri('../../static/ie.png'),
          browser: 'Internet Explorer 4.2',
          platform: 'Win 95+',
          notExport: '1',
          grade: 'A',
          engine: {
            name: 'Trident',
            version: '4'
          },
          date: '1591326307'
        },
        {
          link: 'https://www.microsoft.com/',
          icon: __uri('../../static/ie.png'),
          browser: 'Internet Explorer 4.2',
          platform: 'Win 95+',

          engine: {
            name: 'Trident',
            version: '4'
          },
          notExport: '1',
          grade: 'B',
          date: '1591322307'
        },
        {
          link: 'https://www.microsoft.com/',
          icon: __uri('../../static/ie.png'),
          browser: 'AOL browser (AOL desktop)',
          platform: 'Win 95+',
          engine: {
            name: 'Trident',
            version: '4'
          },
          notExport: '1',
          grade: 'C',
          date: '1591322307'
        },
        {
          link: 'https://www.microsoft.com/',
          icon: __uri('../../static/ie.png'),
          engine: {
            name: 'Trident',
            version: '3'
          },
          browser: 'AOL browser (AOL desktop)',
          platform: 'Win 98',
          notExport: '1',
          grade: 'A',
          date: '1591322307'
        },
        {
          link: 'https://www.microsoft.com/',
          icon: __uri('../../static/ie.png'),
          engine: {
            name: 'Trident',
            version: '4'
          },
          browser: 'AOL browser (AOL desktop)',
          platform: 'Win 98',
          notExport: '1',
          grade: 'A',
          date: '1591322307'
        },
        {
          icon: __uri('../../static/firefox.png'),
          link: 'https://www.mozilla.org/',
          browser: 'Firefox 1.0',
          platform: 'Win 98+ / OSX.2+',
          engine: {
            name: 'Gecko',
            version: '4'
          },
          notExport: '1',
          grade: 'A',
          date: '1591322307'
        },
        {
          icon: __uri('../../static/firefox.png'),
          link: 'https://www.mozilla.org/',
          browser: 'Firefox 1.0',
          platform: 'Win 98+ / OSX.2+',
          engine: {
            name: 'Gecko',
            version: '5'
          },
          notExport: '1',
          grade: 'A',
          date: '1591322307'
        },
        {
          icon: __uri('../../static/firefox.png'),
          link: 'https://www.mozilla.org/',
          engine: {
            name: 'Gecko',
            version: '5'
          },
          browser: 'Firefox 2.0',
          platform: 'Win 98+ / OSX.2+',
          notExport: '1',
          grade: 'B',
          date: '1591322307'
        },
        {
          icon: __uri('../../static/firefox.png'),
          link: 'https://www.mozilla.org/',
          engine: {
            name: 'Gecko',
            version: '5'
          },
          browser: 'Firefox 2.0',
          platform: 'Win 98+ / OSX.2+',
          notExport: '1',
          grade: 'C',
          date: '1591322307'
        },
        {
          icon: __uri('../../static/firefox.png'),
          link: 'https://www.mozilla.org/',
          engine: {
            name: 'Gecko',
            version: '5'
          },
          browser: 'Firefox 2.0',
          platform: 'Win 98+ / OSX.2+',
          notExport: '1',
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
        name: 'link',
        label: '浏览器地址',
        type: 'link',
        href: 'http://www.browser.com/?q=${browser}',
        body: '${browser}'
      },
      {
        name: 'engine.name',
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
        name: 'engine.version',
        label: 'CSS版本',
        type: 'tpl',
        tpl: '<b>${engine.version}</b>'
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
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date'
      }
    ]
  }
};

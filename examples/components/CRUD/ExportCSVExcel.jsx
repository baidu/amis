export default {
  title: 'CSV 导出的是原始数据，而 Excel 是尽可能还原展现效果',
  body: {
    type: 'crud',
    headerToolbar: ['export-excel', 'export-csv'],
    data: {
      mapping_type: {
        '*': '其他'
      },
      items: [
        {
          link: 'https://www.microsoft1.com/',
          icon: __uri('../../static/ie.png'),
          browser: 'Internet Explorer 4.2 2',
          platform: 'Win 95+',
          notExport: '1',
          grade: 'A',
          engine: {
            name: 'Trident1',
            version: '4/2'
          },
          date: '1591326307',
          num: '12312334234234523',
          children: [
            {
              link: 'https://www.microsoft2.com/',
              engine: {
                name: 'Trident2',
                version: '4/2'
              },
              browser: 'Internet Explorer 4.0',
              platform: 'Win 95+',
              version: '4',
              grade: 'X',
              id: 1001
            },
            {
              link: 'https://www.microsoft3.com/',
              engine: {
                name: 'Trident3',
                version: '3/2'
              },
              browser: 'Internet Explorer 5.0',
              platform: 'Win 95+',
              version: '5',
              grade: 'C',
              id: 1002
            }
          ]
        },
        {
          link: 'https://www.microsoft.com/',
          icon: __uri('../../static/ie.png'),
          browser: 'Internet Explorer 4.2',
          platform: 'Win 95+',
          notExport: '1',
          grade: 'A',
          engine: {
            name: 'Trident',
            version: '4/2'
          },
          date: '1591326307',
          city: '310100',
          num: '12312334234234523'
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
          date: '1591322307',
          num: 1231233423232
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
        label: '<%= "图标" %>',
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
        label: '引擎',
        className: 'text-primary'
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
        label: '引擎版本',
        type: 'tpl',
        tpl: '<b>${engine.version}</b>',
        classNameExpr:
          "<%= data.engine.version > 4 ? 'bg-green-100' : 'bg-red-50' %>"
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
        name: 'grade',
        label: 'CSS grade',
        type: 'mapping',
        source: '${mapping_type}'
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date'
      },
      {
        name: 'city',
        label: 'city',
        type: 'input-city'
      },
      {
        name: 'num',
        label: 'num'
      }
    ],
    prefixRow: [
      {
        type: 'text',
        text: '前置总计',
        colSpan: 2
      },
      {
        type: 'tpl',
        tpl: '${items|pick:engine.version|sum}'
      }
    ],
    affixRow: [
      [
        {
          type: 'text',
          text: '总计1'
        },
        {
          type: 'tpl',
          tpl: '${items|pick:engine.version|sum}'
        }
      ],
      [
        {
          type: 'text',
          text: '总计2'
        },
        {
          type: 'tpl',
          tpl: '${items|pick:engine.version|sum}'
        }
      ]
    ]
  }
};

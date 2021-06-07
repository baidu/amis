export default {
  title:
    '支持自动合并单元格，从左到右，可配置从左侧起多少列内启动自动合并单元格，当前配置 3',
  body: {
    type: 'table',
    data: {
      items: [
        {
          engine: 'Trident',
          browser: 'Internet Explorer 4.2',
          platform: 'Win 95+',
          version: '4',
          grade: 'A'
        },
        {
          engine: 'Trident',
          browser: 'Internet Explorer 4.2',
          platform: 'Win 95+',
          version: '4',
          grade: 'B'
        },
        {
          engine: 'Trident',
          browser: 'AOL browser (AOL desktop)',
          platform: 'Win 95+',
          version: '4',
          grade: 'C'
        },
        {
          engine: 'Trident',
          browser: 'AOL browser (AOL desktop)',
          platform: 'Win 98',
          version: '3',
          grade: 'A'
        },
        {
          engine: 'Trident',
          browser: 'AOL browser (AOL desktop)',
          platform: 'Win 98',
          version: '4',
          grade: 'A'
        },
        {
          engine: 'Gecko',
          browser: 'Firefox 1.0',
          platform: 'Win 98+ / OSX.2+',
          version: '4',
          grade: 'A'
        },
        {
          engine: 'Gecko',
          browser: 'Firefox 1.0',
          platform: 'Win 98+ / OSX.2+',
          version: '5',
          grade: 'A'
        },
        {
          engine: 'Gecko',
          browser: 'Firefox 2.0',
          platform: 'Win 98+ / OSX.2+',
          version: '5',
          grade: 'B'
        },
        {
          engine: 'Gecko',
          browser: 'Firefox 2.0',
          platform: 'Win 98+ / OSX.2+',
          version: '5',
          grade: 'C'
        },
        {
          engine: 'Gecko',
          browser: 'Firefox 2.0',
          platform: 'Win 98+ / OSX.2+',
          version: '5',
          grade: 'D'
        }
      ]
    },
    combineNum: 3, // 配置自动合并单元格的列数。
    columns: [
      {
        name: 'engine',
        label: 'Rendering engine'
      },
      {
        name: 'browser',
        label: 'Browser'
      },
      {
        name: 'platform',
        label: 'Platform(s)'
      },
      {
        name: 'version',
        label: 'Engine version'
      },
      {
        name: 'grade',
        label: 'CSS grade'
      }
    ]
  }
};

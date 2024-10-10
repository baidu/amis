export default {
  title: '当 column 每一项的 label 值都为空字符时，可以隐藏表头',
  body: [
    {
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
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
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
      columns: [
        {
          name: 'engine',
          label: ''
        },
        {
          name: 'browser',
          label: ''
        },
        {
          name: 'platform',
          label: ''
        },
        {
          name: 'version',
          label: ''
        },
        {
          name: 'grade',
          label: ''
        }
      ]
    },
    {
      type: 'divider'
    },
    '<h4>搭配合并单元格和列上配置 isHead 可以实现超级表头放在左侧</h4>',
    {
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
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
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
      combineNum: 1,
      columns: [
        {
          name: 'engine',
          label: '',
          isHead: true
        },
        {
          name: 'browser',
          label: ''
        },
        {
          name: 'platform',
          label: ''
        },
        {
          name: 'version',
          label: ''
        },
        {
          name: 'grade',
          label: ''
        }
      ]
    },
    {
      type: 'divider'
    },
    '<h4>还可以继续使用超级表头</h4>',
    {
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
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D'
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
      combineNum: 1,
      columns: [
        {
          name: 'engine',
          label: '',
          groupName: 'A',
          isHead: true
        },
        {
          name: 'browser',
          label: '',
          groupName: 'A'
        },
        {
          name: 'platform',
          label: '',
          groupName: 'B'
        },
        {
          name: 'version',
          label: '',
          groupName: 'B'
        },
        {
          name: 'grade',
          label: ''
        }
      ]
    }
  ]
};

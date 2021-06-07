export default {
  title: '支持表头分组，通过在 cloumn 上设置 groupName 实现。',
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
    columns: [
      {
        name: 'engine',
        label: 'Rendering engine',
        groupName: 'A'
      },
      {
        name: 'browser',
        label: 'Browser',
        groupName: 'A'
      },
      {
        name: 'platform',
        label: 'Platform(s)',
        groupName: 'B'
      },
      {
        name: 'version',
        label: 'Engine version',
        groupName: 'B'
      },
      {
        name: 'grade',
        label: 'CSS grade'
      }
    ]
  }
};

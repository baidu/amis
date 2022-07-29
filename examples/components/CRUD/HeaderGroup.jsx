export default {
  title: '支持表头分组，通过在 cloumn 上设置 groupName 实现。',
  body: [
    {
      type: 'crud',
      bulkActions: [
        {
          label: '批量删除',
          actionType: 'ajax',
          api: 'delete:/amis/api/mock2/sample/${ids|raw}',
          confirmText: '确定要批量删除?'
        },
        {
          label: '批量修改',
          actionType: 'dialog',
          dialog: {
            title: '批量编辑',
            body: {
              type: 'form',
              api: '/amis/api/mock2/sample/bulkUpdate2',
              body: [
                {
                  type: 'hidden',
                  name: 'ids'
                },
                {
                  type: 'input-text',
                  name: 'engine',
                  label: 'Engine'
                }
              ]
            }
          }
        }
      ],
      data: {
        items: [
          {
            engine: 'Trident',
            browser: 'Internet Explorer 4.2',
            platform: 'Win 95+',
            version: '4',
            grade: 'A',
            id: 1
          },
          {
            engine: 'Trident',
            browser: 'Internet Explorer 4.2',
            platform: 'Win 95+',
            version: '4',
            grade: 'B',
            id: 2
          },
          {
            engine: 'Trident',
            browser: 'AOL browser (AOL desktop)',
            platform: 'Win 95+',
            version: '4',
            grade: 'C',
            id: 3
          },
          {
            engine: 'Trident',
            browser: 'AOL browser (AOL desktop)',
            platform: 'Win 98',
            version: '3',
            grade: 'A',
            id: 4
          },
          {
            engine: 'Trident',
            browser: 'AOL browser (AOL desktop)',
            platform: 'Win 98',
            version: '4',
            grade: 'A',
            id: 5
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 1.0',
            platform: 'Win 98+ / OSX.2+',
            version: '4',
            grade: 'A',
            id: 6
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 1.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'A',
            id: 7
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'B',
            id: 8
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'C',
            id: 9
          },
          {
            engine: 'Gecko',
            browser: 'Firefox 2.0',
            platform: 'Win 98+ / OSX.2+',
            version: '5',
            grade: 'D',
            id: 10
          }
        ]
      },
      columns: [
        {
          name: 'grade',
          label: 'CSS grade',
          groupName: 'A'
        },
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
        }
      ]
    }
  ]
};

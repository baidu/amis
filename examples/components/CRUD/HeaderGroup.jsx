export default {
  type: 'page',
  title: '支持表头分组，通过在 cloumn 上设置 groupName 实现。',
  body: [
    {
      type: 'crud',
      draggable: true,
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
      columns: [
        {
          name: 'id',
          label: 'ID',
          remark: 'ID',
          groupName: 'A'
        },
        {
          name: 'grade',
          label: 'CSS grade',
          remark: 'CSS grade',
          groupName: 'A'
        },
        {
          name: 'engine',
          label: 'Rendering engine',
          remark: 'Rendering engine',
          groupName: 'A'
        },
        {
          name: 'browser',
          label: 'Browser',
          remark: 'Browser'
        },
        {
          name: 'platform',
          label: 'Platform(s)',
          remark: 'Platform(s)',
          groupName: 'B'
        },
        {
          name: 'version',
          label: 'Engine version',
          remark: 'Engine version',
          groupName: 'B'
        }
      ],
      data: {
        items: [
          {
            engine: 'Trident',
            browser: 'Internet Explorer 4.0',
            platform: 'Win 95+',
            version: '4',
            grade: 'X',
            id: 1,
            children: [
              {
                engine: 'Trident',
                browser: 'Internet Explorer 4.0',
                platform: 'Win 95+',
                version: '4',
                grade: 'X',
                id: 1001
              },
              {
                engine: 'Trident',
                browser: 'Internet Explorer 5.0',
                platform: 'Win 95+',
                version: '5',
                grade: 'C',
                id: 1002
              }
            ]
          },
          {
            engine: 'Trident',
            browser: 'Internet Explorer 5.0',
            platform: 'Win 95+',
            version: '5',
            grade: 'C',
            id: 2,
            children: [
              {
                engine: 'Trident',
                browser: 'Internet Explorer 4.0',
                platform: 'Win 95+',
                version: '4',
                grade: 'X',
                id: 2001
              },
              {
                engine: 'Trident',
                browser: 'Internet Explorer 5.0',
                platform: 'Win 95+',
                version: '5',
                grade: 'C',
                id: 2002
              }
            ]
          },
          {
            engine: 'Trident',
            browser: 'Internet Explorer 5.5',
            platform: 'Win 95+',
            version: '5.5',
            grade: 'A',
            id: 3,
            children: [
              {
                engine: 'Trident',
                browser: 'Internet Explorer 4.0',
                platform: 'Win 95+',
                version: '4',
                grade: 'X',
                id: 3001
              },
              {
                engine: 'Trident',
                browser: 'Internet Explorer 5.0',
                platform: 'Win 95+',
                version: '5',
                grade: 'C',
                id: 3002
              }
            ]
          },
          {
            engine: 'Trident',
            browser: 'Internet Explorer 6',
            platform: 'Win 98+',
            version: '6',
            grade: 'A',
            id: 4,
            children: [
              {
                engine: 'Trident',
                browser: 'Internet Explorer 4.0',
                platform: 'Win 95+',
                version: '4',
                grade: 'X',
                id: 4001
              },
              {
                engine: 'Trident',
                browser: 'Internet Explorer 5.0',
                platform: 'Win 95+',
                version: '5',
                grade: 'C',
                id: 4002
              }
            ]
          },
          {
            engine: 'Trident',
            browser: 'Internet Explorer 7',
            platform: 'Win XP SP2+',
            version: '7',
            grade: 'A',
            id: 5,
            children: [
              {
                engine: 'Trident',
                browser: 'Internet Explorer 4.0',
                platform: 'Win 95+',
                version: '4',
                grade: 'X',
                id: 5001
              },
              {
                engine: 'Trident',
                browser: 'Internet Explorer 5.0',
                platform: 'Win 95+',
                version: '5',
                grade: 'C',
                id: 5002
              }
            ]
          }
        ]
      }
    }
  ]
};

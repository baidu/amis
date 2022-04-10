export default {
  title: '操作并下一个',
  remark: '当存在下一条时，支持直接打开下一条操作。',
  body: {
    type: 'crud',
    title: '',
    api: '/api/sample/list',
    columnsTogglable: false,
    columns: [
      {
        name: 'id',
        label: 'ID',
        width: 20,
        type: 'text',
        toggled: true
      },
      {
        name: 'engine',
        label: 'Rendering engine',
        type: 'text',
        toggled: true
      },
      {
        name: 'browser',
        label: 'Browser',
        type: 'text',
        toggled: true
      },
      {
        type: 'operation',
        label: '操作',
        width: 130,
        buttons: [
          {
            type: 'button',
            icon: 'fa fa-pencil',
            actionType: 'dialog',
            nextCondition: 'true',
            _nextCondition: '可以设置条件比如： data.grade == "B"',
            dialog: {
              title: '编辑',
              actions: [
                {
                  type: 'button',
                  actionType: 'prev',
                  level: 'info',
                  visibleOn: 'data.hasPrev',
                  label: '上一个'
                },
                {
                  type: 'button',
                  actionType: 'cancel',
                  label: '关闭'
                },
                {
                  type: 'submit',
                  actionType: 'next',
                  visibleOn: 'data.hasNext',
                  label: '保存并下一个',
                  level: 'primary'
                },
                {
                  type: 'submit',
                  visibleOn: '!data.hasNext',
                  label: '保存',
                  level: 'primary'
                },
                {
                  type: 'button',
                  actionType: 'next',
                  level: 'info',
                  visibleOn: 'data.hasNext',
                  label: '下一个'
                }
              ],
              body: {
                type: 'form',
                name: 'sample-edit-form',
                api: '/api/sample/$id',
                body: [
                  {
                    type: 'input-text',
                    name: 'engine',
                    label: 'Engine',
                    required: true
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'input-text',
                    name: 'browser',
                    label: 'Browser',
                    required: true
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'input-text',
                    name: 'platform',
                    label: 'Platform(s)',
                    required: true
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'input-text',
                    name: 'version',
                    label: 'Engine version'
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'input-text',
                    name: 'grade',
                    label: 'CSS grade'
                  }
                ]
              }
            }
          }
        ],
        toggled: true
      }
    ]
  }
};

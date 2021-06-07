export default {
  title: '增删改查示例',
  remark: 'bla bla bla',
  body: {
    type: 'crud',
    api: '/api/sample',
    mode: 'list',
    draggable: true,
    saveOrderApi: {
      url: '/api/sample/saveOrder'
    },
    orderField: 'weight',
    filter: {
      title: '条件搜索',
      submitText: '',
      body: [
        {
          type: 'input-text',
          name: 'keywords',
          placeholder: '通过关键字搜索',
          addOn: {
            label: '搜索',
            type: 'submit'
          }
        },
        {
          type: 'plain',
          text: '这只是个示例, 目前搜索对查询结果无效.'
        }
      ]
    },
    bulkActions: [
      {
        label: '批量删除',
        actionType: 'ajax',
        api: 'delete:/api/sample/${ids|raw}',
        confirmText: '确定要批量删除?',
        type: 'button',
        level: 'danger'
      },
      {
        label: '批量修改',
        actionType: 'dialog',
        level: 'info',
        type: 'button',
        dialog: {
          title: '批量编辑',
          body: {
            type: 'form',
            api: '/api/sample/bulkUpdate2',
            body: [
              {type: 'hidden', name: 'ids'},
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
    quickSaveApi: '/api/sample/bulkUpdate',
    quickSaveItemApi: '/api/sample/$id',
    listItem: {
      actions: [
        {
          type: 'button',
          icon: 'fa fa-eye',
          actionType: 'dialog',
          dialog: {
            title: '查看',
            body: {
              type: 'form',
              body: [
                {
                  type: 'static',
                  name: 'engine',
                  label: 'Engine'
                },
                {
                  type: 'divider'
                },
                {
                  type: 'static',
                  name: 'browser',
                  label: 'Browser'
                },
                {
                  type: 'divider'
                },
                {
                  type: 'static',
                  name: 'platform',
                  label: 'Platform(s)'
                },
                {
                  type: 'divider'
                },
                {
                  type: 'static',
                  name: 'version',
                  label: 'Engine version'
                },
                {
                  type: 'divider'
                },
                {
                  type: 'static',
                  name: 'grade',
                  label: 'CSS grade'
                },
                {
                  type: 'divider'
                },
                {
                  type: 'html',
                  html:
                    '<p>添加其他 <span>Html 片段</span> 需要支持变量替换（todo）.</p>'
                }
              ]
            }
          }
        },
        {
          type: 'button',
          icon: 'fa fa-pencil',
          actionType: 'dialog',
          dialog: {
            title: '编辑',
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
        },
        {
          type: 'button',
          icon: 'fa fa-times text-danger',
          actionType: 'ajax',
          confirmText: '您确认要删除?',
          api: 'delete:/api/sample/$id'
        }
      ],
      body: [
        {
          name: 'engine',
          label: 'Rendering engine',
          sortable: true,
          quickEdit: true
        },
        {
          type: 'hbox',
          columns: [
            {
              name: 'browser',
              label: 'Browser'
            },
            {
              name: 'platform',
              label: 'Platform(s)'
            }
          ]
        },
        {
          name: 'version',
          label: 'Engine version'
        }
      ]
    }
  }
};

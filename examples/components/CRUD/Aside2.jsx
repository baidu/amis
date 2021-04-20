export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
  title: '带边栏联动',
  aside: {
    type: 'nav',
    stacked: true,
    source: '/api/mock2/options/nav?parentId=${value}&waitSeconds=2'
  },
  toolbar: [
    {
      type: 'button',
      actionType: 'dialog',
      label: '新增',
      primary: true,
      dialog: {
        title: '新增',
        body: {
          type: 'form',
          name: 'sample-edit-form',
          api: 'post:/api/sample',
          controls: [
            {
              type: 'text',
              name: 'engine',
              label: 'Engine',
              required: true
            },
            {
              type: 'divider'
            },
            {
              type: 'text',
              name: 'browser',
              label: 'Browser',
              required: true
            },
            {
              type: 'divider'
            },
            {
              type: 'text',
              name: 'platform',
              label: 'Platform(s)',
              required: true
            },
            {
              type: 'divider'
            },
            {
              type: 'text',
              name: 'version',
              label: 'Engine version'
            },
            {
              type: 'divider'
            },
            {
              type: 'text',
              name: 'grade',
              label: 'CSS grade'
            }
          ]
        }
      }
    }
  ],
  body: {
    type: 'crud',
    draggable: true,
    api: {
      url: '/api/sample',
      sendOn: 'this.cat'
    },
    filter: {
      title: '条件搜索',
      submitText: '',
      controls: [
        {
          type: 'text',
          name: 'keywords',
          placeholder: '通过关键字搜索',
          addOn: {
            label: '搜索',
            type: 'submit'
          }
        },
        {
          type: 'plain',
          text: '这里的表单项可以配置多个'
        }
      ]
    },
    bulkActions: [
      {
        label: '批量删除',
        actionType: 'ajax',
        api: 'delete:/api/sample/$ids',
        confirmText: '确定要批量删除?'
      },
      {
        label: '批量修改',
        actionType: 'dialog',
        dialog: {
          title: '批量编辑',
          name: 'sample-bulk-edit',
          body: {
            type: 'form',
            api: '/api/sample/bulkUpdate2',
            controls: [
              {
                type: 'hidden',
                name: 'ids'
              },
              {
                type: 'text',
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
    columns: [
      {
        name: 'id',
        label: 'ID',
        width: 20,
        sortable: true,
        type: 'text',
        toggled: true
      },
      {
        name: 'engine',
        label: 'Rendering engine',
        sortable: true,
        searchable: true,
        type: 'text',
        toggled: true
      },
      {
        name: 'browser',
        label: 'Browser',
        sortable: true,
        type: 'text',
        toggled: true
      },
      {
        name: 'platform',
        label: 'Platform(s)',
        sortable: true,
        type: 'text',
        toggled: true
      },
      {
        name: 'version',
        label: 'Engine version',
        quickEdit: true,
        type: 'text',
        toggled: true
      },
      {
        name: 'grade',
        label: 'CSS grade',
        quickEdit: {
          mode: 'inline',
          type: 'select',
          options: ['A', 'B', 'C', 'D', 'X'],
          saveImmediately: true
        },
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
            icon: 'fa fa-eye',
            actionType: 'dialog',
            dialog: {
              title: '查看',
              body: {
                type: 'form',
                controls: [
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
                controls: [
                  {
                    type: 'text',
                    name: 'engine',
                    label: 'Engine',
                    required: true
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'text',
                    name: 'browser',
                    label: 'Browser',
                    required: true
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'text',
                    name: 'platform',
                    label: 'Platform(s)',
                    required: true
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'text',
                    name: 'version',
                    label: 'Engine version'
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'text',
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
        toggled: true
      }
    ]
  }
};

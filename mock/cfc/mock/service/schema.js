const predefined = {
  crud: {
    type: 'crud',
    draggable: true,
    api: 'http://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample',
    syncLocation: false,
    perPage: 50,
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
        api: 'delete:/api/mock2/sample$ids',
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
            api: '/api/mock2/samplebulkUpdate2',
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
    quickSaveApi: '/api/mock2/samplebulkUpdate',
    quickSaveItemApi: '/api/mock2/sample$id',
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
                    html: '<p>添加其他 <span>Html 片段</span> 需要支持变量替换（todo）.</p>'
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
                api: '/api/mock2/sample$id',
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
            api: 'delete:/api/mock2/sample$id'
          }
        ],
        toggled: true
      }
    ]
  },

  form: {
    type: 'form',
    api: '/api/form/saveForm?waitSeconds=2',
    title: '常规模式',
    mode: 'normal',
    controls: [
      {
        type: 'email',
        name: 'email',
        required: true,
        placeholder: '请输入邮箱',
        label: '邮箱'
      },
      {
        type: 'password',
        name: 'password',
        label: '密码',
        required: true,
        placeholder: '请输入密码'
      },
      {
        type: 'checkbox',
        name: 'rememberMe',
        label: '记住登录'
      },
      {
        type: 'static',
        value: 'AMIS_HOST'
      }
    ]
  },

  tabs: {
    type: 'tabs',
    tabs: [
      {
        title: 'TabA',
        body: '卡片A内容'
      },

      {
        title: 'TabB',
        body: '卡片B内容'
      }
    ]
  },
  controls: {
    controls: [
      {
        label: '名称',
        type: 'text',
        labelClassName: 'text-muted',
        name: 'name'
      },
      {
        label: '作者',
        type: 'text',
        labelClassName: 'text-muted',
        name: 'author'
      },
      {
        label: '请求时间',
        type: 'datetime',
        labelClassName: 'text-muted',
        name: 'date'
      },
      {
        type: 'static',
        value: 'AMIS_HOST'
      }
    ]
  }
};

module.exports = function (req, res) {
  const type = req.query.type;

  if (predefined[type]) {
    return res.json({
      status: 0,
      msg: '',
      data: predefined[type]
    });
  } else {
    return res.json({
      status: 404,
      msg: 'Not Found'
    });
  }
};

export default {
  type: 'page',
  data: {
    globalData: {
      website: 'http://www.baidu.com',
      email: 'amis!@baidu.com'
    }
  },
  body: [
    {
      type: 'alert',
      body: '远程请求后、表单提交后，将数据回填给另一个组件。请求返回的数据可以指定存储在`outputVar`变量里，其他动作可以通过`event.data.{{outputVar}}`直接获取该数据。',
      level: 'info',
      className: 'mb-1'
    },
    {
      type: 'alert',
      body: 'http请求后的数据回填给表单',
      level: 'info',
      className: 'mt-2 mb-1'
    },
    {
      type: 'form',
      id: 'form_data_3',
      title: '用户信息',
      body: [
        {
          type: 'input-text',
          label: '名称',
          name: 'name',
          disabled: false,
          mode: 'horizontal'
        },
        {
          type: 'input-text',
          label: '作者',
          name: 'author',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      actions: [
        {
          type: 'button',
          label: '去获取表单数据',
          primary: true,
          wrapWithPanel: false,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'ajax',
                  args: {
                    api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData'
                  },
                  outputVar: 'myResult'
                },
                {
                  actionType: 'setValue',
                  componentId: 'form_data_3',
                  args: {
                    value: '${event.data.myResult}'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'alert',
      body: '弹窗提交后的数据回填给表单',
      level: 'info',
      className: 'mt-2 mb-1'
    },
    {
      type: 'form',
      id: 'form_data_3',
      title: '用户信息',
      body: [
        {
          type: 'input-text',
          label: '名称',
          name: 'name',
          disabled: false,
          mode: 'horizontal'
        },
        {
          type: 'input-text',
          label: '作者',
          name: 'author',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      actions: [
        {
          type: 'button',
          label: '去获取表单数据',
          primary: true,
          wrapWithPanel: false,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'dialog',
                  dialog: {
                    title: '登录',
                    id: 'dialog_004',
                    data: {
                      username: 'amis'
                    },
                    body: {
                      type: 'form',
                      api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2',
                      body: [
                        {
                          type: 'input-text',
                          name: 'username',
                          required: true,
                          placeholder: '请输入用户名',
                          label: '用户名'
                        },
                        {
                          type: 'input-password',
                          name: 'password',
                          label: '密码',
                          required: true,
                          placeholder: '请输入密码'
                        },
                        {
                          type: 'checkbox',
                          name: 'rememberMe',
                          label: '记住登录'
                        }
                      ]
                    },
                    actions: [
                      {
                        type: 'button',
                        label: '提交',
                        className: 'm',
                        primary: true,
                        onEvent: {
                          click: {
                            actions: [
                              {
                                actionType: 'ajax',
                                args: {
                                  api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData'
                                },
                                outputVar: 'myResult'
                              },
                              {
                                actionType: 'setValue',
                                componentId: 'form_data_3',
                                args: {
                                  value: '${event.data.myResult}'
                                }
                              },
                              {
                                actionType: 'closeDialog'
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'alert',
      body: 'Picker选择后将数据回填到form的其他组件中',
      level: 'info',
      className: 'mt-2 mb-1'
    },
    {
      type: 'form',
      api: '/api/mock2/form/saveForm',
      debug: true,
      body: [
        {
          type: 'picker',
          name: 'picker',
          id: 'picker',
          joinValues: true,
          valueField: 'id',
          labelField: 'id',
          label: '多选',
          source: '/api/mock2/sample',
          size: 'lg',
          multiple: false,
          description: '选择一项内容，自动填入Form其他组件，并触发按钮动作',
          pickerSchema: {
            mode: 'table',
            name: 'thelist',
            quickSaveApi: '/api/mock2/sample/bulkUpdate',
            quickSaveItemApi: '/api/mock2/sample/$id',
            draggable: true,
            headerToolbar: {
              wrapWithPanel: false,
              type: 'form',
              className: 'text-right',
              target: 'thelist',
              mode: 'inline',
              body: [
                {
                  type: 'input-text',
                  name: 'keywords',
                  addOn: {
                    type: 'submit',
                    label: '搜索',
                    level: 'primary',
                    icon: 'fa fa-search pull-left'
                  }
                }
              ]
            },
            columns: [
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
                width: 100,
                buttons: [
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
                      position: 'left',
                      size: 'lg',
                      title: '编辑',
                      body: {
                        type: 'form',
                        name: 'sample-edit-form',
                        api: '/api/mock2/sample/$id',
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
                            type: 'select',
                            name: 'grade',
                            label: 'CSS grade',
                            options: ['A', 'B', 'C', 'D', 'X']
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
                    api: 'delete:/api/mock2/sample/$id'
                  }
                ],
                toggled: true
              }
            ]
          },
          onEvent: {
            change: {
              actions: [
                {
                  actionType: 'setValue',
                  componentId: 'id',
                  args: {
                    value: '${event.data.value}'
                  }
                },
                {
                  actionType: 'setValue',
                  componentId: 'platform',
                  args: {
                    value: '${event.data.option.platform}'
                  }
                },
                {
                  actionType: 'click',
                  componentId: 'dialog-action',
                  args: {
                    browser: '${event.data.option.browser}'
                  }
                }
              ]
            }
          }
        },
        {
          label: 'id',
          name: 'id',
          id: 'id',
          type: 'input-text'
        },
        {
          label: 'platform',
          name: 'platform',
          id: 'platform',
          type: 'input-text'
        },
        {
          type: 'action',
          id: 'dialog-action',
          label: '自动触发的弹窗',
          level: 'primary',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'dialog',
                  dialog: {
                    type: 'dialog',
                    title: 'browser',
                    id: 'browser-dialog',
                    body: [
                      {
                        type: 'form',
                        debug: true,
                        id: 'browser-form',
                        body: [
                          {
                            type: 'input-text',
                            id: 'browser',
                            name: 'browser',
                            label: 'browser'
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      ]
    }
  ]
};

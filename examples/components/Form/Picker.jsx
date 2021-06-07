export default {
  title: '表格编辑',
  body: {
    type: 'form',
    mode: 'horizontal',
    api: '/api/mock2/form/saveForm?waitSeconds=2',
    actions: [
      {
        type: 'submit',
        label: '提交',
        primary: true
      }
    ],
    body: [
      '<p>常规模式</p>',
      {
        type: 'divider'
      },
      {
        type: 'picker',
        name: 'type',
        label: '单选',
        value: 1,
        inline: true,
        options: [
          {
            label: '选项1',
            value: 1
          },
          {
            label: '选项2',
            value: 2
          },
          {
            label: '选项3',
            value: 3
          },
          {
            label: '选项4',
            value: 4
          }
        ]
      },

      {
        type: 'picker',
        name: 'type2',
        label: '多选',
        multiple: true,
        options: [
          {
            label: '选项1',
            value: 1
          },
          {
            label: '选项2',
            value: 2
          },
          {
            label: '选项3',
            value: 3
          },
          {
            label: '选项4',
            value: 4
          }
        ]
      },

      {
        type: 'divider'
      },

      '<p>Table 渲染类型</p>',
      {
        type: 'divider'
      },

      {
        type: 'picker',
        name: 'type3',
        joinValues: true,
        valueField: 'id',
        labelField: 'engine',
        label: '单选',
        source: '/api/sample',
        size: 'lg',
        value: '4',
        pickerSchema: {
          mode: 'table',
          name: 'thelist',
          quickSaveApi: '/api/sample/bulkUpdate',
          quickSaveItemApi: '/api/sample/$id',
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
                    position: 'left',
                    size: 'lg',
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
                  api: 'delete:/api/sample/$id'
                }
              ],
              toggled: true
            }
          ]
        }
      },

      {
        type: 'picker',
        name: 'type4',
        joinValues: true,
        valueField: 'id',
        labelField: 'engine',
        label: '多选',
        source: '/api/sample',
        size: 'lg',
        value: '4,5',
        multiple: true,
        pickerSchema: {
          mode: 'table',
          name: 'thelist',
          quickSaveApi: '/api/sample/bulkUpdate',
          quickSaveItemApi: '/api/sample/$id',
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
                    position: 'left',
                    size: 'lg',
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
                  api: 'delete:/api/sample/$id'
                }
              ],
              toggled: true
            }
          ]
        }
      },

      {
        type: 'divider'
      },

      '<p>List 渲染类型</p>',
      {
        type: 'divider'
      },

      {
        type: 'picker',
        name: 'type5',
        joinValues: true,
        valueField: 'id',
        labelField: 'engine',
        label: '单选',
        source: '/api/sample',
        size: 'lg',
        value: '4',
        pickerSchema: {
          mode: 'list',
          name: 'thelist',
          quickSaveApi: '/api/sample/bulkUpdate',
          quickSaveItemApi: '/api/sample/$id',
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
                quickEdit: true,
                labelClassName: 'w-sm'
              },
              {
                type: 'hbox',
                columns: [
                  {
                    name: 'browser',
                    label: 'Browser',
                    labelClassName: 'w-sm'
                  },
                  {
                    name: 'platform',
                    label: 'Platform(s)',
                    labelClassName: 'w-sm'
                  }
                ]
              },
              {
                name: 'version',
                label: 'Engine version',
                labelClassName: 'w-sm'
              }
            ]
          }
        }
      },
      {
        type: 'picker',
        name: 'type6',
        joinValues: true,
        valueField: 'id',
        labelField: 'engine',
        label: '多选',
        source: '/api/sample',
        size: 'lg',
        value: '4,5',
        multiple: true,
        pickerSchema: {
          mode: 'list',
          name: 'thelist',
          quickSaveApi: '/api/sample/bulkUpdate',
          quickSaveItemApi: '/api/sample/$id',
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
                quickEdit: true,
                labelClassName: 'w-sm'
              },
              {
                type: 'hbox',
                columns: [
                  {
                    name: 'browser',
                    label: 'Browser',
                    labelClassName: 'w-sm'
                  },
                  {
                    name: 'platform',
                    label: 'Platform(s)',
                    labelClassName: 'w-sm'
                  }
                ]
              },
              {
                name: 'version',
                label: 'Engine version',
                labelClassName: 'w-sm'
              }
            ]
          }
        }
      },

      {
        type: 'divider'
      },

      '<p>Cards 渲染类型</p>',
      {
        type: 'divider'
      },

      {
        type: 'picker',
        name: 'type7',
        joinValues: true,
        valueField: 'id',
        labelField: 'engine',
        label: '单选',
        source: '/api/sample',
        size: 'lg',
        value: '4',
        pickerSchema: {
          mode: 'cards',
          name: 'thelist',
          quickSaveApi: '/api/sample/bulkUpdate',
          quickSaveItemApi: '/api/sample/$id',
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
          card: {
            header: {
              title: '$engine',
              subTitle: '$platform',
              subTitlePlaceholder: '暂无说明',
              avatar:
                '<%= data.avatar || "https://internal-amis-res.cdn.bcebos.com/images/2019-12/1575350573496/4873dbfaf6a5.png" %>',
              avatarClassName: 'pull-left thumb b-3x m-r'
            },
            actions: [
              {
                type: 'button',
                label: '查看',
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
                label: '编辑',
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
                label: '删除',
                actionType: 'ajax',
                confirmText: '您确认要删除?',
                api: 'delete:/api/sample/$id'
              }
            ],
            body: [
              {
                name: 'engine',
                label: 'engine',
                sortable: true,
                quickEdit: true
              },
              {
                name: 'browser',
                label: 'Browser'
              },
              {
                name: 'platform',
                label: 'Platform'
              },
              {
                name: 'version',
                label: 'version'
              }
            ]
          }
        }
      },

      {
        type: 'picker',
        name: 'type8',
        joinValues: true,
        valueField: 'id',
        labelField: 'engine',
        label: '多选',
        source: '/api/sample',
        size: 'lg',
        value: '4,5',
        multiple: true,
        pickerSchema: {
          mode: 'cards',
          name: 'thelist',
          quickSaveApi: '/api/sample/bulkUpdate',
          quickSaveItemApi: '/api/sample/$id',
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
          card: {
            header: {
              title: '$engine',
              subTitle: '$platform',
              subTitlePlaceholder: '暂无说明',
              avatar:
                '<%= data.avatar || "https://internal-amis-res.cdn.bcebos.com/images/2019-12/1575350573496/4873dbfaf6a5.png" %>',
              avatarClassName: 'pull-left thumb b-3x m-r'
            },
            actions: [
              {
                type: 'button',
                label: '查看',
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
                label: '编辑',
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
                label: '删除',
                actionType: 'ajax',
                confirmText: '您确认要删除?',
                api: 'delete:/api/sample/$id'
              }
            ],
            body: [
              {
                name: 'engine',
                label: 'engine',
                sortable: true,
                quickEdit: true
              },
              {
                name: 'browser',
                label: 'Browser'
              },
              {
                name: 'platform',
                label: 'Platform'
              },
              {
                name: 'version',
                label: 'version'
              }
            ]
          }
        }
      }
    ]
  }
};

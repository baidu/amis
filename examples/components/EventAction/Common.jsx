export default {
  type: 'page',
  title: '触发通用动作',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'button',
      id: 'b_001',
      label: '发送Ajax请求',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'ajax',
              api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm',
              messages: {
                success: '成功了！欧耶',
                failed: '失败了呢。。'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_002',
      className: 'ml-2',
      label: '打开一个弹窗（模态）',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'dialog',
              dialog: {
                type: 'dialog',
                id: 'dialog_1',
                title: '一个模态弹窗',
                body: [
                  {
                    type: 'tpl',
                    tpl: '<p>对，你打开了一个模态弹窗</p>',
                    inline: false
                  }
                ]
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_003',
      label: '关闭一个弹窗（模态）',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'dialog',
              dialog: {
                type: 'dialog',
                id: 'dialog_1',
                title: '一个模态弹窗',
                body: [
                  {
                    type: 'button',
                    label: '打开一个子弹窗，然后关闭它的父亲',
                    onEvent: {
                      click: {
                        actions: [
                          {
                            actionType: 'dialog',
                            dialog: {
                              type: 'dialog',
                              title: '一个模态子弹窗',
                              body: [
                                {
                                  type: 'button',
                                  label: '关闭指定弹窗（关闭父弹窗）',
                                  onEvent: {
                                    click: {
                                      actions: [
                                        {
                                          actionType: 'closeDialog',
                                          componentId: 'dialog_1'
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
                  },
                  {
                    type: 'button',
                    label: '关闭当前弹窗',
                    className: 'ml-2',
                    onEvent: {
                      click: {
                        actions: [
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
    },
    {
      type: 'button',
      id: 'b_004',
      className: 'ml-2',
      label: '打开一个抽屉（模态）',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'drawer',
              drawer: {
                type: 'drawer',
                id: 'drawer_1',
                title: '一个模态抽屉',
                body: [
                  {
                    type: 'tpl',
                    tpl: '<p>对，你打开了一个模态抽屉</p>',
                    inline: false
                  }
                ]
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_005',
      label: '关闭一个抽屉（模态）',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'drawer',
              drawer: {
                type: 'drawer',
                id: 'drawer_1',
                title: '一个模态抽屉',
                body: [
                  {
                    type: 'button',
                    label: '打开一个子抽屉，然后关闭它的父亲',
                    onEvent: {
                      click: {
                        actions: [
                          {
                            actionType: 'drawer',
                            drawer: {
                              type: 'drawer',
                              title: '一个模态子抽屉',
                              body: [
                                {
                                  type: 'button',
                                  label: '关闭指定抽屉(关闭父抽屉)',
                                  onEvent: {
                                    click: {
                                      actions: [
                                        {
                                          actionType: 'closeDrawer',
                                          componentId: 'drawer_1'
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
                  },
                  {
                    type: 'button',
                    label: '关闭当前抽屉',
                    className: 'ml-2',
                    onEvent: {
                      click: {
                        actions: [
                          {
                            actionType: 'closeDrawer'
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
    },
    {
      type: 'button',
      id: 'b_006',
      label: '打开页面',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'url',
              url: 'http://www.baidu.com',
              blank: true
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_007',
      label: '打开页面（单页模式）',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'link',
              link: './broadcat'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_008',
      label: '弹个提示对话框（模态）',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'alert',
              msg: '该吃饭了~'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_009',
      label: '弹个确认对话框（模态）',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'confirm',
              title: '操作确认',
              msg: '要删除它吗？'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_010',
      label: '全局消息提示',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              msgType: 'warning',
              msg: '我是一个全局警告消息，可以配置不同类型和弹出位置~',
              options: {
                position: 'top-right'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_011',
      label: '复制一段文本',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'copy',
              content: 'http://www.baidu.com'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_012',
      label: '复制一段富文本',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'copy',
              copyFormat: 'text/html',
              content: "<a href='http://www.baidu.com'>link</a> <b>bold</b>"
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_013',
      label: '发送邮件',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'email',
              to: 'amis@baidu.com',
              cc: 'baidu@baidu.com',
              subject: '这是邮件主题',
              body: '这是邮件正文'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_018',
      label: '刷新(一个表单)',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'reload',
              componentId: 'form-reload'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_019',
      label: '刷新(一个下拉框)',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'reload',
              componentId: 'select-reload'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_014',
      label: '显示',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'show',
              // componentId: 'input-text_001'
              componentId: 'b_001'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_015',
      label: '隐藏',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'hidden',
              // componentId: 'input-text_001' // b_001
              componentId: 'b_001'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_016',
      label: '禁用',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'disabled',
              componentId: 'form_disable'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_017',
      label: '启用',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'enabled',
              componentId: 'form_disable'
            }
          ]
        }
      }
    },
    {
      label: '刷新下拉框',
      type: 'select',
      id: 'select-reload',
      mode: 'horizontal',
      className: 'm-t',
      name: 'select',
      source:
        'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1'
    },
    {
      type: 'form',
      id: 'form-reload',
      name: 'form-reload',
      initApi:
        'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData',
      title: '刷新表单',
      body: [
        {
          type: 'input-text',
          id: 'date-input-01',
          name: 'date',
          label: '时间戳'
        }
      ]
    },
    {
      type: 'input-text',
      label: '控制显隐',
      id: 'input-text_001',
      mode: 'horizontal'
    },
    {
      type: 'form',
      id: 'form_disable',
      title: '控制状态',
      body: [
        {
          type: 'group',
          body: [
            {
              type: 'button',
              id: 'b_002',
              className: 'ml-2',
              label: '打开一个弹窗（模态）'
            },
            {
              type: 'button',
              label: '隐藏',
              className: 'ml-2',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'hidden',
                      // componentId: 'input-text_001' // b_001
                      componentId: 'b_001'
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  ]
};

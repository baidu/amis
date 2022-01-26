export default {
  type: 'page',
  title: '触发通用动作',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'button',
      id: 'b_001',
      label: '发送Ajax请求',
      actionType: 'reload',
      dialog: {
        title: '系统提示',
        body: '对你点击了'
      },
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
      label: '打开一个弹窗',
      actionType: 'reload',
      dialog: {
        title: '系统提示',
        body: '对你点击了'
      },
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'dialog',
              args: {
                id: '${event.data.ajax1.id}'
              },
              dialog: {
                type: 'dialog',
                id: 'dialog_1',
                title: '弹框标题1',
                data: {
                  id: '${id}'
                },
                body: [
                  {
                    type: 'form',
                    debug: true,
                    body: [
                      {
                        type: 'tpl',
                        tpl: '<p>对，你刚刚点击了111${id}</p>',
                        inline: false
                      }
                    ]
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
      label: '关闭一个弹窗',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'dialog',
              dialog: {
                type: 'dialog',
                id: 'dialog_1',
                title: '弹框标题1',
                body: [
                  {
                    type: 'tpl',
                    tpl: '<p>对，你刚刚点击了111</p>',
                    inline: false
                  },
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
                              title: '弹框标题3',
                              body: [
                                {
                                  type: 'button',
                                  label: '关闭指定弹窗',
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
                    onEvent: {
                      click: {
                        actions: [
                          {
                            actionType: 'closeDialog'
                          }
                        ]
                      }
                    }
                  },
                  {
                    type: 'input-text',
                    label: '文本',
                    name: 'text',
                    disabled: false,
                    mode: 'horizontal'
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
      id: 'b_005',
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
      id: 'b_006',
      label: '弹个提示对话框',
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
      id: 'b_007',
      label: '弹个确认对话框',
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
      id: 'b_008',
      label: '全局消息提示',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              msgType: 'warning',
              msg: '我是一个全局警告消息',
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
      id: 'b_009',
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
      id: 'b_010',
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
      id: 'b_011',
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
    }
  ]
};

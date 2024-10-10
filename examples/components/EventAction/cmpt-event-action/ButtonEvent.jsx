export default {
  type: 'page',
  title: '按钮类组件事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'tpl',
      tpl: '1.普通按钮',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'button',
      label: 'Button',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '派发点击事件'
              }
            }
          ]
        },
        mouseenter: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '派发鼠标移入事件'
              }
            }
          ]
        },
        mouseleave: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '派发鼠标移出事件'
              }
            }
          ]
        }
      }
    },
    {
      type: 'tpl',
      tpl: '2.功能按钮',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      debug: true,
      api: '/api/mock2/form/saveForm',
      body: [
        {
          type: 'input-text',
          name: 'name',
          label: '名称'
        }
      ],
      actions: [
        {
          type: 'submit',
          label: 'Submit',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '派发点击事件'
                  }
                }
              ]
            }
          }
        },
        {
          type: 'reset',
          label: 'Reset',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '派发点击事件'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'tpl',
      tpl: '3.按钮组&按钮工具栏',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'button-toolbar',
      buttons: [
        {
          type: 'button',
          label: '按钮1',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '派发点击事件'
                  }
                }
              ]
            }
          }
        },
        {
          type: 'button',
          label: '按钮2',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '派发点击事件'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'button-group',
      buttons: [
        {
          type: 'button',
          label: '按钮1',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '派发点击事件'
                  }
                }
              ]
            }
          }
        },
        {
          type: 'button',
          label: '按钮2',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '派发点击事件'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'tpl',
      tpl: '4.下拉按钮',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'dropdown-button',
      label: '下拉按钮',
      buttons: [
        {
          type: 'button',
          label: '按钮1',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '派发点击事件'
                  }
                }
              ]
            }
          }
        },
        {
          type: 'button',
          label: '按钮2',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '派发点击事件'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'tpl',
      tpl: '5.按钮点选',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'button-group-select',
      name: 'a',
      options: [
        {
          label: '选项1',
          value: 'a'
        },
        {
          label: '选项2',
          value: 'b'
        }
      ],
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '派发点选事件'
              }
            }
          ]
        }
      }
    },
    {
      type: 'tpl',
      tpl: '6.作为容器',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'action',
      body: [
        {
          type: 'color',
          value: '#108cee'
        }
      ],
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '派发点击事件'
              }
            }
          ]
        },
        mouseenter: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '派发鼠标移入事件'
              }
            }
          ]
        },
        mouseleave: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '派发鼠标移出事件'
              }
            }
          ]
        }
      }
    }
  ]
};

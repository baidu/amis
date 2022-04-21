export default {
  type: 'page',
  title: '输入类组件事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'tpl',
      tpl: 'InputText输入框',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      name: 'text-form',
      debug: true,
      api: '/api/mock2/form/saveForm',
      body: [
        {
          type: 'group',
          body: [
            {
              name: 'trigger1',
              id: 'trigger1',
              type: 'action',
              label: 'clear触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'clear',
                      componentId: 'clear-receiver',
                      description: '点击清空指定输入框的内容'
                    },
                    {
                      actionType: 'toast',
                      args: {
                        msgType: 'info',
                        msg: '派发clear事件'
                      }
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-receiver',
              id: 'clear-receiver',
              type: 'input-text',
              clearable: true,
              label: 'clear动作测试',
              mode: 'row',
              value: 'chunk of text ready to be cleared.'
            }
          ]
        },
        {
          type: 'group',
          body: [
            {
              name: 'trigger2',
              id: 'trigger2',
              type: 'action',
              label: 'focus触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'focus',
                      componentId: 'focus-receiver',
                      description: '点击使指定输入框聚焦'
                    },
                    {
                      actionType: 'toast',
                      args: {
                        msgType: 'info',
                        msg: '派发focus事件'
                      }
                    }
                  ]
                }
              }
            },
            {
              name: 'focus-receiver',
              id: 'focus-receiver',
              type: 'input-text',
              label: 'focus动作测试',
              mode: 'row'
            }
          ]
        }
      ]
    },
    {
      type: 'divider'
    },
    {
      type: 'tpl',
      tpl: 'Textarea 多行文本输入框',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      name: 'textarea-form',
      debug: true,
      api: '/api/mock2/form/saveForm',
      body: [
        {
          type: 'group',
          body: [
            {
              name: 'textarea-trigger1',
              id: 'textarea-trigger1',
              type: 'action',
              label: 'clear触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'clear',
                      componentId: 'textarea-clear-receiver',
                      description: '点击清空指定输入框的内容'
                    },
                    {
                      actionType: 'toast',
                      args: {
                        msgType: 'info',
                        msg: '派发clear事件'
                      }
                    }
                  ]
                }
              }
            },
            {
              name: 'textarea-clear-receiver',
              id: 'textarea-clear-receiver',
              type: 'textarea',
              clearable: true,
              label: 'clear动作测试',
              mode: 'row',
              value: 'chunk of text ready to be cleared.'
            }
          ]
        },
        {
          type: 'group',
          body: [
            {
              name: 'textarea-trigger2',
              id: 'textarea-trigger2',
              type: 'action',
              label: 'focus触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'focus',
                      componentId: 'textarea-focus-receiver',
                      description: '点击使指定输入框聚焦'
                    },
                    {
                      actionType: 'toast',
                      args: {
                        msgType: 'info',
                        msg: '派发focus事件'
                      }
                    }
                  ]
                }
              }
            },
            {
              name: 'textarea-focus-receiver',
              id: 'textarea-focus-receiver',
              type: 'textarea',
              label: 'focus动作测试',
              mode: 'row'
            }
          ]
        }
      ]
    },
    {
      type: 'divider'
    },
    {
      type: 'tpl',
      tpl: 'InputNumber数字输入框',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      debug: true,
      body: [
        {
          type: 'group',
          body: [
            {
              name: 'trigger1',
              id: 'trigger1',
              type: 'action',
              label: 'clear触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'clear',
                      componentId: 'clear-input-number-receiver',
                      description: '点击清空指定输入框的内容'
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-input-number-receiver',
              id: 'clear-input-number-receiver',
              type: 'input-number',
              label: 'clear动作测试',
              value: 1,
              onEvent: {
                blur: {
                  actions: [
                    {
                      actionType: 'toast',
                      args: {
                        msgType: 'info',
                        msg: '派发blur事件'
                      }
                    }
                  ]
                },
                focus: {
                  actions: [
                    {
                      actionType: 'toast',
                      args: {
                        msgType: 'info',
                        msg: '派发focus事件'
                      }
                    }
                  ]
                },
                change: {
                  actions: [
                    {
                      actionType: 'toast',
                      args: {
                        msgType: 'info',
                        msg: '派发change事件'
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    },
    {
      type: 'divider'
    },
    {
      type: 'tpl',
      tpl: 'Editor 编辑器',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      name: 'editor-form',
      debug: true,
      api: '/api/mock2/form/saveForm',
      body: [
        {
          type: 'group',
          mode: 'inline',
          body: [
            {
              name: 'editor-trigger2',
              id: 'editor-trigger2',
              type: 'action',
              label: '编辑器focus触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'focus',
                      componentId: 'editor-focus-receiver',
                      description: '点击使指定输入框聚焦'
                    },
                    {
                      actionType: 'toast',
                      args: {
                        msgType: 'info',
                        msg: '派发focus事件'
                      }
                    }
                  ]
                }
              }
            },
            {
              name: 'editor-focus-receiver',
              id: 'editor-focus-receiver',
              type: 'editor',
              language: 'javascript',
              label: '编辑器focus动作测试',
              value:
                "function HelloWorld() {\n    console.log('Hello World');\n}",
              mode: 'row'
            }
          ]
        },
        {
          type: 'group',
          mode: 'inline',
          body: [
            {
              name: 'diffeditor-trigger2',
              id: 'diffeditor-trigger2',
              type: 'action',
              label: '对比编辑器focus触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'focus',
                      componentId: 'diffeditor-focus-receiver',
                      description: '点击使指定输入框聚焦'
                    },
                    {
                      actionType: 'toast',
                      args: {
                        msgType: 'info',
                        msg: '派发focus事件'
                      }
                    }
                  ]
                }
              }
            },
            {
              name: 'diffeditor-focus-receiver',
              id: 'diffeditor-focus-receiver',
              type: 'diff-editor',
              label: '对比编辑器focus动作测试',
              diffValue:
                "function HelloWorld() {\n    console.log('Hello World');\n}",
              value:
                "function HelloWorld() {\n    console.log('Hello World!');\n}",
              mode: 'row'
            }
          ]
        }
      ]
    }
  ]
};

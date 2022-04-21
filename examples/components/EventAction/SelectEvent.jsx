const change = {
  actions: [
    {
      actionType: 'toast',
      args: {
        msgType: 'info',
        msg: '派发change事件'
      }
    }
  ]
};

const blur = {
  actions: [
    {
      actionType: 'toast',
      args: {
        msgType: 'info',
        msg: '派发blur事件'
      }
    }
  ]
};

const focus = {
  actions: [
    {
      actionType: 'toast',
      args: {
        msgType: 'info',
        msg: '派发focus事件'
      }
    }
  ]
};

const options = [
  {
    label: '选项A',
    value: 'A'
  },
  {
    label: '选项B',
    value: 'B'
  },
  {
    label: '选项C',
    value: 'C'
  }
];

export default {
  type: 'page',
  title: '下拉框组件事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'tpl',
      tpl: 'Select下拉框',
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
                      componentId: 'clear-select',
                      description: '点击清空指定下拉框选中值'
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-select',
              id: 'clear-select',
              type: 'select',
              label: 'clear动作测试',
              mode: 'row',
              value: 'A,B,C',
              multiple: true,
              checkAll: true,
              options,
              onEvent: {
                change,
                blur,
                focus
              }
            }
          ]
        }
      ]
    },
    {
      type: 'tpl',
      tpl: 'inputTag标签选择器',
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
              name: 'trigger2',
              id: 'trigger2',
              type: 'action',
              label: 'clear触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'clear',
                      componentId: 'clear-input-tag',
                      description: '点击清空指定下拉框选中值'
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-input-tag',
              id: 'clear-input-tag',
              type: 'input-tag',
              label: 'clear动作测试',
              mode: 'row',
              value: 'A,B',
              multiple: true,
              options,
              onEvent: {
                change,
                blur,
                focus
              }
            }
          ]
        }
      ]
    },
    {
      type: 'tpl',
      tpl: 'matrix-checkboxes矩阵勾选',
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
              name: 'trigger3',
              id: 'trigger3',
              type: 'action',
              label: 'clear触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'clear',
                      componentId: 'clear-matrix-checkboxes',
                      description: '点击清空指定下拉框选中值'
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-matrix-checkboxes',
              id: 'clear-matrix-checkboxes',
              type: 'matrix-checkboxes',
              rowLabel: '行标题说明',
              columns: [
                {
                  label: '列1'
                },
                {
                  label: '列2'
                }
              ],
              rows: [
                {
                  label: '行1'
                },
                {
                  label: '行2'
                }
              ],
              onEvent: {
                change
              }
            }
          ]
        }
      ]
    },
    {
      type: 'tpl',
      tpl: 'radios单选框',
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
              name: 'trigger4',
              id: 'trigger4',
              type: 'action',
              label: 'clear触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'clear',
                      componentId: 'clear-radios',
                      description: '点击清空指定下拉框选中值'
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-radios',
              id: 'clear-radios',
              type: 'radios',
              options,
              onEvent: {
                change
              }
            }
          ]
        }
      ]
    },
    {
      type: 'tpl',
      tpl: 'nested-select嵌套下拉框',
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
              name: 'trigger6',
              id: 'trigger6',
              type: 'action',
              label: 'clear触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'clear',
                      componentId: 'clear-nested-select',
                      description: '点击清空指定嵌套下拉框选中值'
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-nested-select',
              id: 'clear-nested-select',
              type: 'nested-select',
              label: 'clear动作测试',
              mode: 'row',
              options: [
                {
                  label: '选项A',
                  value: 'A',
                  children: []
                },
                {
                  label: '选项B',
                  value: 'B',
                  children: [
                    {
                      label: '选项C',
                      value: 'C'
                    },
                    {
                      label: '选项D',
                      value: 'D'
                    }
                  ]
                }
              ],
              multiple: false,
              hideNodePathLabel: false,
              onlyChildren: false,
              joinValues: true,
              delimiter: '。',
              onEvent: {
                change,
                blur,
                focus
              }
            }
          ]
        }
      ]
    },
    {
      type: 'tpl',
      tpl: 'input-city城市选择器',
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
              name: 'trigger10',
              id: 'trigger10',
              type: 'action',
              label: 'clear触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'clear',
                      componentId: 'clear-input-city',
                      description: '点击清空城市选择器选中值'
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-input-city',
              id: 'clear-input-city',
              type: 'input-city',
              label: 'clear动作测试',
              mode: 'row',
              onEvent: {
                change
              }
            }
          ]
        }
      ]
    },
    {
      type: 'tpl',
      tpl: '单选框/复选框',
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
              name: 'trigger8',
              id: 'trigger8',
              type: 'action',
              label: 'clear触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'clear',
                      componentId: 'clear-checkbox',
                      description: '点击清空指定单选框选中值'
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-checkbox',
              id: 'clear-checkbox',
              type: 'checkbox',
              label: 'clear动作测试',
              mode: 'row',
              option: '勾选框',
              onEvent: {
                change
              }
            }
          ]
        },
        {
          type: 'group',
          body: [
            {
              name: 'trigger9',
              id: 'trigger9',
              type: 'action',
              mode: 'row',
              label: 'clear触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'clear',
                      componentId: 'clear-checkboxes',
                      description: '点击清空指定浮选框选中值'
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-checkboxes',
              id: 'clear-checkboxes',
              type: 'checkboxes',
              mode: 'row',
              label: 'clear动作测试',
              options,
              onEvent: {
                change
              }
            }
          ]
        }
      ]
    },
    {
      type: 'tpl',
      tpl: 'options类',
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
              type: 'group',
              body: [
                {
                  name: 'trigger5',
                  id: 'trigger5',
                  type: 'action',
                  label: 'clear触发器',
                  level: 'primary',
                  onEvent: {
                    click: {
                      actions: [
                        {
                          actionType: 'clear',
                          componentId: 'clear-options_001',
                          description: '点击清空指定下拉框选中值'
                        }
                      ]
                    }
                  }
                },
                {
                  name: 'clear-options_001',
                  id: 'clear-options_001',
                  type: 'button-group-select',
                  options,
                  onEvent: {
                    change
                  }
                }
              ]
            }
          ]
        },
        {
          type: 'group',
          body: [
            {
              name: 'trigger5',
              id: 'trigger5',
              type: 'action',
              label: 'clear触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'clear',
                      componentId: 'clear-options_002',
                      description: '点击清空指定下拉框选中值'
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-options_002',
              id: 'clear-options_002',
              type: 'list-select',
              options,
              onEvent: {
                change
              }
            }
          ]
        }
      ]
    }
  ]
};

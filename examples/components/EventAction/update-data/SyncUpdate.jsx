export default {
  type: 'page',
  body: [
    {
      type: 'alert',
      body: '当某组件的值发生变化时，联动去更新另一个组件的数据，可以通过${responseResult}来获取事件产生的数据，例如输入框change事件可以通过${[name]}来获取输入的值，name是组件的名称。',
      level: 'info',
      className: 'mb-1'
    },
    {
      type: 'alert',
      body: '输入框同步输入框：上面输入框输入时同步更新表单内的输入框。',
      level: 'info',
      className: 'mt-2 mb-1'
    },
    {
      type: 'input-text',
      name: 'role',
      label: '输入角色',
      mode: 'horizontal',
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'form_data_2',
              args: {
                value: {
                  myrole: '${role}'
                }
              }
            }
          ]
        }
      }
    },
    {
      type: 'input-text',
      label: '输入年龄',
      name: 'age',
      mode: 'horizontal',
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'form_data_2',
              args: {
                value: {
                  age: '${age}'
                }
              }
            }
          ]
        }
      }
    },
    {
      type: 'form',
      id: 'form_data_2',
      title: '表单',
      initApi: '/api/mock2/form/initData',
      body: [
        {
          type: 'input-text',
          label: '角色',
          name: 'myrole',
          disabled: false,
          mode: 'horizontal'
        },
        {
          type: 'input-text',
          label: '年龄',
          name: 'age',
          disabled: false,
          mode: 'horizontal'
        }
      ]
    },
    {
      type: 'alert',
      body: '下拉框与输入框联动：选择消息后，将选中值同步给消息输入框。',
      level: 'info',
      className: 'mt-2 mb-1'
    },
    {
      type: 'select',
      label: '选择消息',
      name: 'message',
      mode: 'horizontal',
      options: [
        {
          label: 'Hi',
          value: 'Hi!'
        },
        {
          label: 'Hello',
          value: 'Hello!'
        },
        {
          label: 'Hey',
          value: 'Hey!'
        }
      ],
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'input_data_msg2',
              args: {
                value: '${message}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'input-text',
      label: '消息',
      id: 'input_data_msg2',
      mode: 'horizontal',
      name: 'mymsg'
    },
    {
      type: 'alert',
      body: '动态更新下拉框的数据源： 选项1的选中值更新后同步更新选项2的数据源。',
      level: 'info',
      className: 'mt-2 mb-1'
    },
    {
      type: 'form',
      title: '表单',
      body: [
        {
          type: 'select',
          label: '选项1',
          name: 'select1',
          options: [
            {
              label: '选项A',
              value: 'A'
            },
            {
              label: '选项B',
              value: 'B'
            }
          ],
          id: 'u:af1ad4e2f8db',
          multiple: false,
          mode: 'inline',
          onEvent: {
            change: {
              weight: 0,
              actions: [
                {
                  actionType: 'setValue',
                  args: {
                    value: {
                      opts: '${optList[select1]}'
                    }
                  },
                  componentId: 'u:d731760b321e'
                }
              ]
            }
          }
        },
        {
          type: 'select',
          label: '选项2',
          name: 'select2',
          id: 'u:d731760b321d',
          multiple: false,
          mode: 'inline',
          source: '${opts}'
        }
      ],
      id: 'u:d731760b321e',
      data: {
        optList: {
          A: [
            {
              label: 'A',
              value: 'a'
            },
            {
              label: 'B',
              value: 'b'
            },
            {
              label: 'C',
              value: 'c'
            }
          ],
          B: [
            {
              label: 'A2',
              value: 'a2'
            },
            {
              label: 'B2',
              value: 'b2'
            },
            {
              label: 'C2',
              value: 'c2'
            }
          ]
        },
        opts: []
      }
    }
  ]
};

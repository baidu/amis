const options = [
  {
    label: 'Folder A',
    value: 1,
    children: [
      {
        label: 'file A(懒加载)',
        defer: true,
        value: 2
      },
      {
        label: 'Folder B',
        value: 3,
        children: [
          {
            label: 'file b1',
            value: 3.1
          },
          {
            label: 'file b2',
            value: 3.2
          }
        ]
      }
    ]
  },
  {
    label: 'file C',
    value: 4
  },
  {
    label: 'file D',
    value: 5
  }
];

const onEvent = name => ({
  blur: {
    actions: [
      {
        actionType: 'toast',
        args: {
          msgType: 'info',
          msg: '派发blur事件${' + name + '|json}'
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
          msg: '派发focus事件${' + name + '|json}'
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
          msg: '派发change事件${' + name + '|json}'
        }
      }
    ]
  },
  add: {
    actions: [
      {
        actionType: 'toast',
        args: {
          msgType: 'info',
          msg: '派发add事件${' + name + '|json}'
        }
      },
      {
        actionType: 'toast',
        args: {
          msgType: 'info',
          msg: '派发add事件${items|json}'
        }
      }
    ]
  },
  edit: {
    actions: [
      {
        actionType: 'toast',
        args: {
          msgType: 'info',
          msg: '派发edit事件${' + name + '|json}'
        }
      },
      {
        actionType: 'toast',
        args: {
          msgType: 'info',
          msg: '派发edit事件${items|json}'
        }
      }
    ]
  },
  delete: {
    actions: [
      {
        actionType: 'toast',
        args: {
          msgType: 'info',
          msg: '派发delete事件${' + name + '|json}'
        }
      },
      {
        actionType: 'toast',
        args: {
          msgType: 'info',
          msg: '派发delete事件${items|json}'
        }
      }
    ]
  },
  loadFinished: {
    actions: [
      {
        actionType: 'toast',
        args: {
          msgType: 'info',
          msg: '派发loadFinished事件${' + name + '|json}'
        }
      }
    ]
  }
});

export default {
  type: 'page',
  title: '树形选择器',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'form',
      debug: true,
      body: [
        {
          name: 'tree-select-clear',
          type: 'action',
          label: 'clear触发器',
          level: 'primary',
          className: 'mr-3',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: 'tree-select-action',
                  description: '点击清空内容'
                }
              ]
            }
          }
        },
        {
          name: 'tree-select-reset',
          type: 'action',
          label: 'reset触发器',
          level: 'primary',
          className: 'mr-3',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: 'tree-select-action',
                  description: '点击清空内容'
                }
              ]
            }
          }
        },
        {
          type: 'tree-select',
          id: 'tree-select-action',
          name: 'tree',
          label: 'Tree',
          creatable: true,
          removable: true,
          editable: true,
          deferApi: '/api/mock2/form/deferOptions?label=${label}&waitSeconds=2',
          options,
          onEvent: onEvent('tree')
        },
        {
          type: 'tree-select',
          id: 'tree-select-action2',
          name: 'tree多选',
          label: 'tree多选',
          multiple: true,
          creatable: true,
          removable: true,
          editable: true,
          deferApi: '/api/mock2/form/deferOptions?label=${label}&waitSeconds=2',
          options,
          onEvent: onEvent('tree多选')
        }
      ]
    }
  ]
};

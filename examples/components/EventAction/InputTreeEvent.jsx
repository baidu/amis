export default {
  type: 'page',
  title: '树形选择框',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'form',
      debug: true,
      body: [
        {
          name: "input-tree-clear",
          type: "action",
          label: 'clear触发器',
          level: 'primary',
          className: 'mr-3',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: 'input-tree-action',
                  description: '点击清空内容'
                }
              ]
            }
          }
        },
        {
          name: "input-tree-reset",
          type: "action",
          label: 'reset触发器',
          level: 'primary',
          className: 'mr-3',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: 'input-tree-action',
                  description: '点击清空内容'
                }
              ]
            }
          }
        },
        {
          name: "input-tree-expand",
          type: "action",
          label: 'expand触发器（openLevel: 1）',
          level: 'primary',
          className: 'mr-3',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'expand',
                  componentId: 'input-tree-action',
                  description: '点击展开',
                  args: {
                    openLevel: 1
                  },
                }
              ]
            }
          }
        },
        {
          name: "input-tree-collapse",
          type: "action",
          label: 'collapse触发器',
          level: 'primary',
          className: 'mr-3',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'collapse',
                  componentId: 'input-tree-action',
                  description: '点击收起'
                }
              ]
            }
          }
        },
        {
          name: "input-tree-choose",
          type: "action",
          label: 'choose触发器（Folder A）',
          level: 'primary',
          className: 'mr-3',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'choose',
                  componentId: 'input-tree-action',
                  description: '点击选中特定值',
                  args: {
                    value: 1
                  },
                }
              ]
            }
          }
        },
        {
          type: 'input-tree',
          id: 'input-tree-action',
          name: 'tree',
          label: 'Tree',
          creatable: true,
          removable: true,
          editable: true,
          initiallyOpen: false,
          unfoldedLevel: 0,
          deferApi: '/api/mock2/form/deferOptions?label=${label}&waitSeconds=2',
          options: [
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
          ],
          onEvent: {
            change: {
              actions: [
                {
                  actionType: 'toast',
                  msgType: 'info',
                  msg: '派发change事件'
                }
              ]
            },
            add: {
              actions: [
                {
                  actionType: 'toast',
                  msgType: 'info',
                  msg: '派发add事件'
                }
              ]
            },
            edit: {
              actions: [
                {
                  actionType: 'toast',
                  msgType: 'info',
                  msg: '派发edit事件'
                }
              ]
            },
            delete: {
              actions: [
                {
                  actionType: 'toast',
                  msgType: 'info',
                  msg: '派发delete事件'
                }
              ]
            },
            loadFinished: {
              actions: [
                {
                  actionType: 'toast',
                  msgType: 'info',
                  msg: '派发loadFinished事件'
                }
              ]
            }
          }
        }
      ]
    }
  ]
};

export default {
  type: 'page',
  title: '数字输入组件事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
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
    }
  ]
};

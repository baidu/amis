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
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-receiver',
              id: 'clear-receiver',
              type: 'input-text',
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
    }
  ]
};

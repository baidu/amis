export default {
  type: 'page',
  title: '时间类组件事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'tpl',
      tpl: 'inputDate日期',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      debug: false,
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
                      componentId: 'clear-inputDate-receiver',
                      description: '点击清空指定日期组件的具体时间'
                    }
                  ]
                }
              }
            },
            {
              name: 'clear-inputDate',
              id: 'clear-inputDate-receiver',
              type: 'input-date',
              label: 'clear动作测试',
              mode: 'row',
              value: new Date()
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
              label: 'reset触发器',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'reset',
                      componentId: 'reset-inputDate-receiver',
                      description: '点击重置指定日期组件的时间'
                    }
                  ]
                }
              }
            },
            {
              name: 'reset-inputDate',
              id: 'reset-inputDate-receiver',
              type: 'input-date',
              label: 'reset动作测试',
              mode: 'row',
              value: new Date()
            }
          ]
        }
      ]
    }
  ]
}
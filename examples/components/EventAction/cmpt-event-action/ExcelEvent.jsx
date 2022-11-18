const changeEvent = {
  actions: [
    {
      actionType: 'dialog',
      args: {
        val: '${file}'
      },
      dialog: {
        title: `派发change事件`,
        data: {
          val: '${val}'
        },
        body: [
          {
            type: 'tpl',
            tpl: '${val|json}'
          }
        ]
      }
    }
  ]
};

export default {
  type: 'page',
  title: 'excel事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'tpl',
      tpl: 'InputExcel',
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
                      componentId: 'clear-input-excel',
                      description: '点击清除数据'
                    }
                  ]
                }
              }
            },
            {
              type: 'input-excel',
              id: 'clear-input-excel',
              name: 'file',
              multiple: true,
              onEvent: {
                change: changeEvent
              }
            }
          ]
        }
      ]
    }
  ]
};

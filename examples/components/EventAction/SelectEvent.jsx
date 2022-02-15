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
              options: [
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
              ]
            }
          ]
        }
      ]
    }
  ]
};

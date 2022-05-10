export default {
  type: 'page',
  title: '标签页组件事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      name: 'trigger1',
      id: 'trigger1',
      type: 'action',
      label: '选项卡1',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'changeActiveKey',
              componentId: 'tabs-change-receiver',
              args: {
                activeKey: 1
              }
            }
          ]
        }
      }
    },
    {
      name: 'trigger2',
      id: 'trigger2',
      type: 'action',
      label: '选项卡2',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'changeActiveKey',
              componentId: 'tabs-change-receiver',
              args: {
                activeKey: 2
              }
            }
          ]
        }
      }
    },
    {
      name: 'trigger3',
      id: 'trigger3',
      type: 'action',
      label: '选项卡3',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'changeActiveKey',
              componentId: 'tabs-change-receiver',
              args: {
                activeKey: 3
              }
            }
          ]
        }
      }
    },
    {
      name: 'tabs-change-receiver',
      id: 'tabs-change-receiver',
      type: 'tabs',
      mode: 'line',
      tabs: [
        {
          title: '选项卡1',
          body: '选项卡内容1'
        },
        {
          title: '选项卡2',
          body: '选项卡内容2'
        },
        {
          title: '选项卡3',
          body: '选项卡内容3'
        }
      ],
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '切换至选项卡${event.data.value}'
              }
            }
          ]
        }
      }
    }
  ]
};

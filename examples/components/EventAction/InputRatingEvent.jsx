export default {
  type: 'page',
  title: '评分组件事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'tpl',
      tpl: 'InputRating组件',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      debug: true,
      body: [
        {
          name: "input-rating-clear",
          type: "action",
          label: 'clear触发器',
          level: 'primary',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: 'clear-input-rating-clear-receiver',
                  description: '点击清空内容'
                }
              ]
            }
          }
        },
        {
          name: 'rate-clear',
          id: 'clear-input-rating-clear-receiver',
          type: 'input-rating',
          value: 3,
          onEvent: {
            change: {
              actions: [
                {
                  actionType: 'toast',
                  msgType: 'info',
                  msg: '派发change事件'
                }
              ]
            }
          }
        },
        {
          name: "input-rating-reset",
          type: "action",
          label: 'reset触发器',
          level: 'primary',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: 'clear-input-rating-reset-receiver',
                  description: '点击清空内容'
                }
              ]
            }
          }
        },
        {
          name: 'rate-reset',
          id: 'clear-input-rating-reset-receiver',
          type: 'input-rating',
          value: 3,
          resetValue: 3,
          onEvent: {
            change: {
              actions: [
                {
                  actionType: 'toast',
                  msgType: 'info',
                  msg: '派发change事件'
                }
              ]
            }
          }
        }
      ]
    }
  ]
};

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
          name: "input-rating",
          type: "action",
          label: 'clear触发器',
          level: 'primary',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: 'clear-input-rating-receiver',
                  description: '点击清空指定输入框的内容'
                }
              ]
            }
          }
        },
        {
          name: 'rate',
          id: 'clear-input-rating-receiver',
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
        }
      ]
    }
  ]
};

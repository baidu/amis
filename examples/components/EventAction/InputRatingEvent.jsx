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
          type: "input-rating",
          option: "事件",
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

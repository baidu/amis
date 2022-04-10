export default {
  type: 'page',
  title: '开关组件事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'tpl',
      tpl: 'Switch组件',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      debug: true,
      body: [
        {
          name: "switch",
          type: "switch",
          option: "开关事件",
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

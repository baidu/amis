export default {
  type: 'page',
  title: '自定义JS',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'button',
      label: '发送个请求',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'custom',
              script:
                "doAction({actionType: 'ajax',api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm'});\n //event.stopPropagation();"
            }
          ]
        }
      }
    }
  ]
};

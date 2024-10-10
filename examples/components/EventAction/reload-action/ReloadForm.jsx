export default {
  type: 'page',
  body: [
    {
      type: 'alert',
      body: '刷新表单，使表单重新加载，这样可以触发表单的远程数据重新请求',
      level: 'info',
      className: 'mb-1'
    },
    {
      type: 'button',
      label: '刷新',
      className: 'mt-2 mb-2',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'reload',
              componentId: 'form-reload'
            }
          ]
        }
      }
    },
    {
      type: 'form',
      id: 'form-reload',
      name: 'form-reload',
      initApi:
        'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData',
      title: '表单',
      body: [
        {
          type: 'input-text',
          id: 'date-input-01',
          name: 'date',
          label: '时间戳'
        }
      ]
    }
  ]
};

export default {
  type: 'page',
  body: [
    {
      type: 'alert',
      body: '刷新下拉框，使下拉框重新加载，这样可以触发下拉框的远程数据重新请求',
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
              componentId: 'select-reload'
            }
          ]
        }
      }
    },
    {
      label: '下拉框',
      type: 'select',
      id: 'select-reload',
      mode: 'horizontal',
      className: 'mt-2',
      name: 'select',
      source:
        'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1'
    }
  ]
};

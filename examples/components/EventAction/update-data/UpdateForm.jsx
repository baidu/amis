export default {
  type: 'page',
  data: {
    globalData: {
      myrole: '法官',
      mymsg: '该吃饭了!'
    }
  },
  body: [
    {
      type: 'alert',
      body: '直接更新指定的表单组件的数据。',
      level: 'info',
      className: 'mb-1'
    },
    {
      type: 'button',
      label: '更新',
      level: 'primary',
      className: 'mt-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'form_data',
              args: {
                value: '${globalData}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'form',
      id: 'form_data',
      title: '表单',
      debug: true,
      data: {
        myrole: '预言家',
        age: '18'
      },
      initApi: '/api/mock2/form/initData',
      body: [
        {
          type: 'input-text',
          label: '角色',
          name: 'myrole',
          disabled: false,
          mode: 'horizontal'
        },
        {
          type: 'input-text',
          label: '年龄',
          name: 'age',
          disabled: false,
          mode: 'horizontal'
        }
      ]
    }
  ]
};

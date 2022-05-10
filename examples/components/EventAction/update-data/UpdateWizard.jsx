export default {
  type: 'page',
  data: {
    globalData: {
      website: 'http://www.baidu.com',
      email: 'amis!@baidu.com'
    }
  },
  body: [
    {
      type: 'alert',
      body: '直接更新指定的向导组件的数据。',
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
              componentId: 'wizard_data',
              args: {
                value: '${globalData}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'wizard',
      id: 'wizard_data',
      mode: 'vertical',
      data: {
        website: 'test',
        email: 'test'
      },
      steps: [
        {
          title: '第一步',
          body: [
            {
              name: 'website',
              label: '网址',
              type: 'input-url'
            }
          ]
        },
        {
          title: 'Step 2',
          body: [
            {
              name: 'email',
              label: '邮箱',
              type: 'input-email',
              required: true
            }
          ]
        }
      ]
    }
  ]
};

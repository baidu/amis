export default {
  type: 'page',
  id: 'mypage',
  data: {
    globalData: {
      myrole: '法官',
      mymsg: '该吃饭了!',
      title: 'beijing time'
    }
  },
  body: [
    {
      type: 'alert',
      body: '直接更新指定输入框的值。',
      level: 'info',
      className: 'mb-1'
    },
    {
      type: 'button',
      label: '更新输入框',
      level: 'primary',
      className: 'mt-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'input_data_msg',
              args: {
                value: '我是amis!'
              }
            }
          ]
        }
      }
    },
    {
      type: 'input-text',
      label: '消息',
      id: 'input_data_msg',
      mode: 'horizontal',
      name: 'mymsg'
    },
    {
      type: 'button',
      label: '更新表单内输入框',
      level: 'primary',
      className: 'mt-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'input_data_role',
              args: {
                value: '预言家'
              }
            }
          ]
        }
      }
    },
    {
      type: 'form',
      title: '表单',
      data: {
        myrole: '杀手',
        age: '18'
      },
      initApi: '/api/mock2/form/initData',
      body: [
        {
          type: 'input-text',
          id: 'input_data_role',
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

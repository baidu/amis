export default {
  type: 'page',
  id: 'mypage',
  data: {
    objData: {
      name: '路飞',
      role: '海贼王'
    },
    arrayData: [
      {
        name: '苹果',
        count: 10
      },
      {
        name: '黄瓜',
        count: 5
      }
    ]
  },
  body: [
    {
      type: 'alert',
      body: '直接更新指定输入组合的值，支持对象和数组。',
      level: 'info',
      className: 'mb-1'
    },
    {
      type: 'button',
      label: '更新对象类型数据',
      level: 'primary',
      className: 'mt-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'userinfo',
              args: {
                value: '${objData}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'combo',
      name: 'userinfo',
      id: 'userinfo',
      label: '用户信息',
      items: [
        {
          name: 'name',
          label: '姓名',
          type: 'input-text'
        },
        {
          name: 'role',
          label: '角色',
          type: 'input-text'
        }
      ]
    },
    {
      type: 'button',
      label: '更新数组类型数据',
      level: 'primary',
      className: 'mt-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'shoppingcart',
              args: {
                value: '${arrayData}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'combo',
      name: 'shoppingcart',
      id: 'shoppingcart',
      label: '购物车',
      multiple: true,
      items: [
        {
          name: 'name',
          label: '商品名称',
          type: 'input-text'
        },
        {
          name: 'count',
          label: '购买数量',
          type: 'input-text'
        }
      ]
    }
  ]
};

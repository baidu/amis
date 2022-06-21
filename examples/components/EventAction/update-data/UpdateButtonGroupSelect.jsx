export default {
  type: 'page',
  id: 'mypage',
  data: {
    btnData: 'c'
  },
  body: [
    {
      type: 'alert',
      body: '直接更新指定点选按钮的选中值。',
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
              componentId: 'button-group-select_setvalue',
              args: {
                value: '${btnData}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button-group-select',
      id: 'button-group-select_setvalue',
      label: '选项',
      name: 'type',
      options: [
        {
          label: 'Option A',
          value: 'a'
        },
        {
          label: 'Option B',
          value: 'b'
        },
        {
          label: 'Option C',
          value: 'c'
        }
      ]
    }
  ]
};

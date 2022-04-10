export default {
  title: '显隐切换示例',
  body: [
    {
      name: 'hiddenOn',
      type: 'form',
      mode: 'horizontal',
      api: '/api/mock2/saveForm?waitSeconds=2',
      title: 'Hide On 和 disabledOn 示例',
      body: [
        {
          type: 'radios',
          name: 'type',
          label: '类型选择',
          inline: true,
          value: '1',
          options: [
            {
              label: '类型 1',
              value: '1'
            },
            {
              label: '类型 2',
              value: '2'
            },
            {
              label: '类型 3',
              value: '3'
            }
          ],
          description: '<span class="text-danger">请切换类型来看效果</span>'
        },
        {
          type: 'input-text',
          label: '所有可见',
          name: 'text1'
        },
        {
          type: 'input-text',
          label: '类型2 可见',
          hiddenOn: 'data.type != 2',
          name: 'text2'
        },
        {
          type: 'input-text',
          label: '类型3 不可点',
          disabledOn: 'data.type == 3',
          name: 'text3'
        },
        {
          type: 'input-text',
          required: true,
          label: '必填字段',
          name: 'test4'
        },
        {
          type: 'button-toolbar',
          buttons: [
            {
              type: 'submit',
              disabledOn: 'data.type == 1',
              label: '类型1不可点'
            },
            {
              type: 'reset',
              label: '类型3出现且不可点',
              visibleOn: 'data.type == 3',
              disabledOn: 'data.type == 3'
            },
            {
              type: 'button',
              label: 'Baidu',
              actionType: 'url',
              url: 'http://www.baidu.com?a=1&b=$test4'
            },
            {
              type: 'button',
              actionType: 'ajax',
              label: 'No Submit',
              api: '/api/mock2/saveForm?waitSeconds=5'
            },
            {
              type: 'submit',
              actionType: 'ajax',
              label: 'Submit',
              api: '/api/mock2/saveForm?waitSeconds=5'
            }
          ]
        }
      ]
    }
  ]
};

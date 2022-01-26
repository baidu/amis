export default {
  type: 'page',
  title: '触发其他组件动作',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'button',
      id: 'b_001',
      label: '触发表单1的刷新动作',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'reload',
              args: {
                name: 'lvxj',
                age: 18
              },
              preventDefault: true,
              stopPropagation: false,
              componentId: 'form_001'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_002',
      label: '触发表单1的子表单1的输入框【名字】的清空动作',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'clear',
              preventDefault: true,
              stopPropagation: false,
              componentId: 'form_001_form_01_text_01'
            }
          ]
        }
      }
    },
    {
      type: 'form',
      id: 'form_001',
      title: '表单1',
      name: 'form1',
      debug: true,
      data: {
        selfname: 'selfname' // 测下数据链
      },
      body: [
        {
          type: 'form',
          id: 'form_001_form_01',
          title: '表单1的子表单01',
          name: 'sub-form1',
          debug: true,
          body: [
            {
              type: 'input-text',
              id: 'form_001_form_01_text_01',
              label: '名称',
              name: 'name',
              disabled: false,
              mode: 'horizontal'
            },
            {
              type: 'input-text',
              id: 'form_001_form_01_text_02',
              label: '等级',
              name: 'level',
              disabled: false,
              mode: 'horizontal'
            },
            {
              type: 'input-text',
              id: 'form_001_form_01_text_03',
              label: '昵称',
              name: 'myname',
              disabled: false,
              mode: 'horizontal'
            }
          ]
        }
      ]
    }
  ]
};

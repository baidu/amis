export default {
  type: 'page',
  title: '事件/动作干预',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'button',
      id: 'b_001',
      label: '联动表单1(事件干预)',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'broadcast',
              eventName: 'broadcast_1',
              args: {
                name: 'lvxj',
                age: 18
              },
              description: '一个按钮的点击事件'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      id: 'b_002',
      label: '联动表单2(动作干预)',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'broadcast',
              eventName: 'broadcast_1',
              args: {
                name: 'lvxj',
                age: 18
              },
              description: '一个按钮的点击事件'
            }
          ]
        }
      }
    },

    {
      type: 'form',
      name: 'form1',
      id: 'form_001',
      title: '表单1-刷新（刷新后，按钮的弹窗动作因为被干预，不会执行）',
      debug: true,
      body: [
        {
          type: 'input-text',
          id: 'form_001_text_01',
          label: '年龄',
          name: 'age',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      data: {
        expression: 'kkk',
        param: '1'
      },
      onEvent: {
        broadcast_1: {
          actions: [
            {
              actionType: 'reload',
              args: {
                age: '${event.data.age}'
              },
              preventDefault: true, // 阻止按钮的弹窗
              expression: 'expression === "kkk"' // or this.xxx
            }
          ]
        }
      }
    },
    {
      type: 'form',
      name: 'form2',
      id: 'form_002',
      title: '表单2-刷新+发Ajax（只执行刷新，Ajax请求被干预，不会执行）',
      debug: true,
      body: [
        {
          type: 'input-text',
          id: 'form_001_text_01',
          label: '年龄',
          name: 'age',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      data: {
        expression: 'kkk',
        param: '1'
      },
      onEvent: {
        broadcast_1: {
          actions: [
            {
              actionType: 'reload',
              args: {
                age: '${event.data.age}'
              },
              preventDefault: false, // 阻止按钮的弹窗
              stopPropagation: true,
              expression: 'expression === "kkk"' // or this.xxx
            },
            {
              actionType: 'ajax',
              args: {
                param: '2'
              },
              api: 'https://api/form/ajax?param=${param}', // param=2，如果想要拿到当前域的数据需要通过args数据映射
              expression: 'expression === "kkk"',
              preventDefault: false,
              stopPropagation: false
            }
          ]
        }
      }
    }
  ]
};

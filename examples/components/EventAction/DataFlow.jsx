export default {
  type: 'page',
  title: '数据传递',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'tpl',
      tpl: '<p>从事件触发开始，整个数据流包含事件本身产生的事件数据和动作产生的动作数据，事件源头产生的数据在AMIS事件动作机制底层已经自动加入渲染器数据域，可以通过"event.data.xxx"直接获取，而部分动作产生的数据如何流动需要交互设计者进行介入，对于数据流动可以通过数据映射，将上一个动作产生的数据作为动作参数写入下一个动作。通过outputVar指定输出的变量名，通过args指定输入的参数数据</p>'
    },
    {
      type: 'button',
      id: 'b_001',
      label: '发一个广播，携带args参数',
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
      id: 'b_001',
      label: '发送Ajax请求，并把返回数据传给弹窗',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'ajax',
              api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm',
              messages: {
                success: '成功了！欧耶',
                failed: '失败了呢。。'
              },
              outputVar: 'ajax1'
            },
            {
              actionType: 'dialog',
              args: {
                id: '${event.data.ajax1.id}'
              },
              dialog: {
                type: 'dialog',
                id: 'dialog_1',
                title: '弹框标题1',
                data: {
                  id: '${id}'
                },
                body: [
                  {
                    type: 'form',
                    debug: true,
                    body: [
                      {
                        type: 'tpl',
                        tpl: '<p>Ajax请求返回的id=${id}</p>',
                        inline: false
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      }
    },
    {
      type: 'form',
      name: 'form1',
      id: 'form_001',
      title: '表单1-监听广播并获取携带的参数',
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
        name: 'amis'
      },
      onEvent: {
        broadcast_1: {
          actions: [
            {
              actionType: 'reload',
              args: {
                age: '${event.data.age}'
              }
            }
          ]
        }
      }
    }
  ]
};

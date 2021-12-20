export default {
  type: 'page',
  title: '广播事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'button',
      label: '发送广播事件1',
      actionType: 'reload',
      dialog: {
        title: '系统提示',
        body: '对你点击了'
      },
      // target: 'form?name=lvxj',
      triggerEvents: {
        click: {
          eventName: 'broadcast_1',
          context: {
            name: 'lvxj',
            age: 18
          },
          description: '一个按钮的点击事件'
        }
      }
    },
    {
      type: 'button',
      label: '发送广播事件2',
      className: 'ml-2',
      actionType: 'reload',
      dialog: {
        title: '系统提示',
        body: '对你点击了'
      },
      // target: 'form?name=lvxj',
      triggerEvents: {
        click: {
          eventName: 'broadcast_2',
          context: {
            name: 'lvxj',
            age: 18
          },
          description: '一个按钮的点击事件'
        }
      }
    },
    {
      type: 'form',
      title: '表单1-刷新',
      name: 'form1',
      body: [
        {
          type: 'input-text',
          label: '名称',
          name: 'name',
          disabled: false,
          mode: 'horizontal'
        },
        {
          type: 'input-text',
          label: '等级',
          name: 'level',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      eventListeners: {
        broadcast_1: {
          weight: 3,
          actions: [
            {
              actionType: 'reload',
              args: {
                level: 1,
                abc: '${name}'
              },
              script: null, // 自己编排
              preventDefault: false,
              stopPropagation: false
            }
          ]
        }
      }
    },
    {
      type: 'form',
      name: 'form2',
      title: '表单2-发Ajax',
      body: [
        {
          type: 'input-text',
          label: '年龄',
          name: 'age',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      data: {
        myData: 'kkk'
      },
      eventListeners: {
        broadcast_1: {
          weight: 2,
          actions: [
            {
              actionType: 'ajax',
              api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm',
              args: {
                level: 2
              },
              script: null, // 自己编排
              preventDefault: false,
              stopPropagation: false,
              execOn: 'this.myData === "kkk"'
            }
          ]
        }
      }
    },
    {
      type: 'form',
      name: 'form3',
      title: '表单3-发Ajax',
      body: [
        {
          type: 'input-text',
          label: '职业',
          name: 'job',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm',
      eventListeners: {
        broadcast_1: {
          actions: [
            {
              actionType: 'reset-and-submit',
              args: {
                level: 3
              },
              script: null, // 自己编排
              preventDefault: false,
              stopPropagation: false
            }
          ]
        },
        broadcast_2: {
          actions: [
            {
              actionType: 'ajax',
              api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm',
              args: {
                level: 33
              },
              script: null, // 自己编排
              preventDefault: true,
              stopPropagation: false,
              children: [
                {
                  actionType: 'reload',
                  args: {},
                  script: null, // 自己编排
                  preventDefault: true,
                  stopPropagation: false
                }
              ]
            }
          ]
        }
      }
    }
  ]
};

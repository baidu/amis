export default {
  type: 'page',
  title: '广播事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'button',
      label: '发送广播事件1-表单1/2/3都在监听',
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
      label: '发送广播事件2-表单3在监听',
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
            job: '拯救世界'
          },
          description: '一个按钮的点击事件'
        }
      }
    },
    {
      type: 'form',
      title: '表单1(我的权重最低)-刷新',
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
          actions: [
            {
              actionType: 'reload',
              args: {
                level: 1,
                abc: '${name}'
              },
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
      title: '表单2(权重2)-刷新+发Ajax',
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
        execOn: 'kkk'
      },
      eventListeners: {
        broadcast_1: {
          weight: 2,
          actions: [
            {
              actionType: 'reload',
              preventDefault: false,
              stopPropagation: false,
              execOn: 'this.execOn === "kkk"'
            },
            {
              actionType: 'ajax',
              api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form2-ajax',
              preventDefault: false,
              stopPropagation: false
            }
          ]
        }
      }
    },
    {
      type: 'form',
      name: 'form3',
      title: '表单3(权重3)-逻辑编排',
      body: [
        {
          type: 'input-text',
          label: '职业',
          name: 'job',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      data: {
        loopData: [
          {
            aname: 'lv',
            aage: '19'
          },
          {
            aname: 'xj',
            aage: '21'
          }
        ],
        branchCont: 20
      },
      api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3',
      eventListeners: {
        broadcast_1: {
          weight: 3,
          actions: [
            {
              actionType: 'custom',
              script:
                "this.doAction({actionType: 'ajax',api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3-custom-ajax-1'});\n //broadcast.stopPropagation();"
            },
            {
              actionType: 'parallel',
              args: {
                level: 3
              },
              children: [
                {
                  actionType: 'ajax',
                  api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3-parallel-ajax-1'
                },
                {
                  actionType: 'ajax',
                  api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3-parallel-ajax-2'
                }
              ]
            },
            {
              actionType: 'branch',
              runAllMatch: true,
              preventDefault: false,
              stopPropagation: false,
              children: [
                {
                  actionType: 'ajax',
                  api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3-branch-ajax-1',
                  expression: 'this.branchCont > 19'
                },
                {
                  actionType: 'ajax',
                  api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3-branch-ajax-2',
                  expression: 'this.branchCont > 17'
                },
                {
                  actionType: 'ajax',
                  api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3-branch-ajax-3',
                  expression: 'this.branchCont > 16'
                }
              ]
            },
            {
              actionType: 'loop',
              loopName: 'loopData',
              args: {
                level: 3
              },
              children: [
                {
                  actionType: 'ajax',
                  api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3-loop-ajax-1'
                },
                {
                  actionType: 'ajax',
                  api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3-loop-ajax-2'
                },
                // {
                //   actionType: 'break'
                // },
                {
                  actionType: 'loop',
                  loopName: 'loopData',
                  args: {
                    level: 3
                  },
                  children: [
                    {
                      actionType: 'ajax',
                      api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3-loop-loop-ajax-1'
                    },
                    {
                      actionType: 'ajax',
                      api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3-loop-loop-ajax-2'
                    },
                    {
                      actionType: 'continue'
                    },
                    {
                      actionType: 'ajax',
                      api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/form3-loop-loop-ajax-3'
                    }
                  ]
                }
              ]
            }
          ]
        },
        broadcast_2: {
          actions: [
            {
              actionType: 'reset-and-submit',
              api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm',
              args: {
                level: 33
              },
              script: null, // 自己编排
              preventDefault: true,
              stopPropagation: false
            },
            {
              actionType: 'reload',
              args: {},
              preventDefault: true,
              stopPropagation: false
            }
          ]
        }
      }
    }
  ]
};

export default {
  type: 'page',
  title: '广播（自定义事件）',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'button',
      id: 'b_001',
      label: '发送广播事件1-表单1/2/3都在监听',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'broadcast',
              eventName: 'broadcast_1',
              args: {
                name: 'lvxj',
                age: 18,
                ld: [
                  {
                    name: 'ld-lv',
                    age: 'ld-19'
                  },
                  {
                    name: 'ld-xj',
                    age: 'ld-21'
                  }
                ]
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
      label: '发送广播事件2-表单3在监听',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'broadcast',
              eventName: 'broadcast_2',
              args: {
                job: '拯救世界'
              },
              description: '一个按钮的点击事件'
            }
          ]
        }
      }
    },
    {
      type: 'form',
      id: 'form_001',
      title: '表单1(我的权重最低)-刷新',
      name: 'form1',
      debug: true,
      data: {
        selfname: 'selfname' // 测下数据链
      },
      body: [
        {
          type: 'form',
          id: 'form_001_form_01',
          title: '表单1(我的权重最低)-刷新',
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
          ],
          onEvent: {
            broadcast_1: {
              actions: [
                {
                  actionType: 'reload',
                  args: {
                    level: 1,
                    myname: '${event.data.name}', // 从事件数据中取
                    name: '${selfname}' // 从当前渲染器上下文数据中取
                  },
                  preventDefault: true,
                  stopPropagation: false
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'form',
      name: 'form2',
      id: 'form_002',
      title: '表单2(权重2)-刷新+发Ajax',
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
        execOn: 'kkk',
        param: '1'
      },
      onEvent: {
        broadcast_1: {
          weight: 2,
          actions: [
            {
              actionType: 'reload',
              args: {
                age: '${event.data.age}'
              },
              preventDefault: false,
              stopPropagation: false,
              execOn: 'execOn === "kkk"' // or this.xxx
            },
            {
              actionType: 'ajax',
              args: {
                param: '2'
              },
              api: 'https://api/form/form2-ajax?param=${param}', // param=2，如果想要拿到当前域的数据需要通过args数据映射
              // api: 'https://api/form/form2-ajax?param=${name}', // param=lvxj 事件数据最终会丢给执行动作，所以这里可以拿到事件数据
              execOn: 'execOn === "kkk"',
              preventDefault: false,
              stopPropagation: false
            },
            {
              actionType: 'broadcast',
              eventName: 'broadcast_2',
              args: {
                job: '打怪兽'
              },
              description: '一个按钮的点击事件'
            }
          ]
        }
      }
    },
    {
      type: 'form',
      name: 'form3',
      id: 'form_003',
      title: '表单3(权重3)-逻辑编排',
      debug: true,
      body: [
        {
          type: 'input-text',
          id: 'form_003_text_01',
          label: '职业',
          name: 'job',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      data: {
        loopData: [
          {
            name: 'lv',
            age: '19'
          },
          {
            name: 'xj',
            age: '21'
          }
        ],
        branchCont: 18
      },
      api: 'https://api/form/form3',
      onEvent: {
        broadcast_1: {
          weight: 3,
          actions: [
            {
              actionType: 'custom',
              script:
                "doAction({actionType: 'ajax',api: 'https://api/form/form3-custom-ajax-1'});\n //event.stopPropagation();"
            }
          ]
        },
        broadcast_2: {
          actions: [
            {
              actionType: 'reset-and-submit',
              api: 'https://api/form/form3-reset-and-submit',
              script: null, // 自己编排
              preventDefault: false,
              stopPropagation: false
            },
            {
              actionType: 'reload',
              args: {
                job: '${event.data.job}'
              },
              preventDefault: false,
              stopPropagation: false
            }
          ]
        }
      }
    }
  ]
};

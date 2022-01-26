export default {
  type: 'page',
  title: '逻辑编排',
  regions: ['body', 'toolbar', 'header'],
  body: {
    type: 'form',
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
      branchCont: 18,
      execOn: 'kkk'
    },
    body: [
      {
        type: 'button',
        id: 'b_001',
        label: '条件',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'ajax',
                args: {
                  param: '0'
                },
                api: 'https://api/form/ajax?param=${param}', // param=2，如果想要拿到当前域的数据需要通过args数据映射
                execOn: 'execOn === "kkk"'
              },
              {
                actionType: 'ajax',
                args: {
                  param: '1'
                },
                api: 'https://api/form/ajax?param=${param}', // param=2，如果想要拿到当前域的数据需要通过args数据映射
                execOn: 'execOn === "jjj"'
              },
              {
                actionType: 'ajax',
                args: {
                  param: '2'
                },
                api: 'https://api/form/ajax?param=${param}', // param=2，如果想要拿到当前域的数据需要通过args数据映射
                execOn: 'execOn === "kkk"'
              }
            ]
          }
        }
      },
      {
        type: 'button',
        id: 'b_002',
        label: '并行',
        className: 'ml-2',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'parallel',
                children: [
                  {
                    actionType: 'ajax',
                    api: 'https://api/form/parallel-ajax-1',
                    preventDefault: false
                    // stopPropagation: true
                  },
                  {
                    actionType: 'ajax',
                    api: 'https://api/form/parallel-ajax-2'
                  }
                ]
              }
            ]
          }
        }
      },
      {
        type: 'button',
        id: 'b_003',
        label: '循环',
        className: 'ml-2',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'loop',
                loopName: 'loopData',
                preventDefault: false,
                stopPropagation: false,
                args: {
                  level: 3
                },
                children: [
                  {
                    actionType: 'reload',
                    preventDefault: false,
                    stopPropagation: false
                  },
                  {
                    actionType: 'ajax',
                    api: 'https://api/form/loop-ajax-1?name=${name}',
                    preventDefault: false,
                    stopPropagation: false
                  },
                  // {
                  //   actionType: 'break'
                  // },
                  {
                    actionType: 'ajax',
                    api: 'https://api/form/loop-ajax-2?age=${age}'
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
                        api: 'https://api/form/loop-loop-ajax-1'
                      },
                      {
                        actionType: 'ajax',
                        api: 'https://api/form/loop-loop-ajax-2?age=${age}',
                        preventDefault: false,
                        stopPropagation: false
                      },
                      {
                        actionType: 'continue'
                      },
                      {
                        actionType: 'ajax',
                        api: 'https://api/form/loop-loop-ajax-3'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      {
        type: 'button',
        id: 'b_004',
        label: 'switch排他',
        className: 'ml-2',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'switch',
                preventDefault: false,
                stopPropagation: false,
                children: [
                  {
                    actionType: 'ajax',
                    api: 'https://api/form/branch-ajax-1',
                    expression: 'this.branchCont > 19',
                    preventDefault: false,
                    stopPropagation: true // 这里无效，因为条件不成立
                  },
                  {
                    actionType: 'ajax',
                    api: 'https://api/form/branch-ajax-2',
                    expression: 'this.branchCont > 17',
                    preventDefault: false,
                    stopPropagation: false
                  },
                  {
                    actionType: 'ajax',
                    api: 'https://api/form/branch-ajax-3',
                    expression: 'this.branchCont > 16'
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
};

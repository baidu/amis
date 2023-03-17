export default {
  type: 'page',
  initApi: '/api/mock2/page/initData?keywords=${keywords}',
  body: [
    {
      type: 'form',
      debug: true,
      body: [
        {
          type: 'search-box',
          name: 'keywords',
          id: 'searchbox01',
          onEvent: {
            search: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msg: '${keywords}'
                  }
                }
              ]
            },
            change: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msg: '${keywords}'
                  }
                }
              ]
            },
            focus: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msg: '${keywords}'
                  }
                }
              ]
            },
            blur: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msg: '${keywords}'
                  }
                }
              ]
            }
          }
        }
      ]
    },

    {
      type: 'button',
      label: '清空',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'clear',
              componentId: 'searchbox01'
            }
          ]
        }
      }
    },

    {
      type: 'button',
      label: '更新值',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'searchbox01',
              args: {
                value: 'Jerry'
              }
            }
          ]
        }
      }
    },

    {
      type: 'tpl',
      tpl: '<p>关键字：${keywords}</p><p>返回结果：${&|json}</p>'
    }
  ]
};

export default {
  type: 'page',
  title: '列表类组件事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'flex',
      direction: 'row',
      justify: 'flex-start',
      items: [
        {
          type: 'html',
          html: '<h2>List组件单行点击事件 - itemClick</h2>',
          className: 'mr-4'
        },
        {
          type: 'tag',
          label: '2.4.0',
          closable: false
        }
      ]
    },
    {
      type: 'service',
      api: '/api/mock2/sample?perPage=5',
      body: [
        {
          type: 'panel',
          title: '',
          body: {
            type: 'list',
            source: '$rows',
            listItem: {
              body: [
                {
                  type: 'hbox',
                  columns: [
                    {
                      label: 'Engine',
                      name: 'engine'
                    },

                    {
                      name: 'version',
                      label: 'Version'
                    }
                  ]
                }
              ],
              actions: [
                {
                  type: 'button',
                  level: 'link',
                  label: '查看详情',
                  actionType: 'dialog',
                  dialog: {
                    title: '查看详情',
                    body: {
                      type: 'form',
                      body: [
                        {
                          label: 'Engine',
                          name: 'engine',
                          type: 'static'
                        },
                        {
                          name: 'version',
                          label: 'Version',
                          type: 'static'
                        }
                      ]
                    }
                  }
                }
              ]
            },
            onEvent: {
              itemClick: {
                actions: [
                  {
                    actionType: 'dialog',
                    dialog: {
                      title: 'Event触发的Dialog',
                      closeOnEsc: true,
                      body: '当前行的数据engine: ${item.data.engine}, version: ${item.data.version}'
                    }
                  },
                  {
                    actionType: 'custom',
                    script:
                      "console.log('点击行的索引值', event.data.item.index)"
                  }
                ]
              }
            }
          }
        }
      ]
    }
  ]
};

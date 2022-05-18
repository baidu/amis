export default {
  type: 'page',
  title: '表格组件事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'tpl',
      tpl: '事件',
      inline: false,
      wrapperComponent: 'h1'
    },
    {
      type: 'tpl',
      tpl: '选择表格项事件',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'service',
      api: '/api/mock2/sample?perPage=10',
      body: [
        {
          type: 'table',
          source: '$rows',
          selectable: true,
          multiple: true,
          columns: [
            {
              name: 'id',
              label: 'ID'
            },

            {
              name: 'browser',
              label: 'Browser'
            },

            {
              name: 'version',
              label: 'Version'
            }
          ],
          onEvent: {
            selectedChange: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '选中${event.data.selectedItems.length}项数据；未选中${event.data.unSelectedItems.length}项数据'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'tpl',
      tpl: '列排序、列搜索、列筛选事件',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'service',
      api: '/api/mock2/sample?perPage=10',
      body: [
        {
          type: 'table',
          source: '$rows',
          columns: [
            {
              name: 'id',
              label: 'ID',
              searchable: true
            },

            {
              name: 'browser',
              label: 'Browser',
              filterable: {
                options: [
                  'Internet Explorer 4.0',
                  'Internet Explorer 5.0'
                ]
              }
            },

            {
              name: 'version',
              label: 'Version',
              sortable: true
            }
          ],
          onEvent: {
            columnSort: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '列排序数据：${event.data|json}'
                  }
                }
              ]
            },
            columnFilter: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '列筛选数据：${event.data|json}'
                  }
                }
              ]
            },
            columnSearch: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '列搜索数据：${event.data|json}'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'tpl',
      tpl: '行排序事件',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'service',
      api: '/api/mock2/sample?perPage=10',
      body: [
        {
          type: 'table',
          source: '$rows',
          draggable: true,
          columns: [
            {
              name: 'id',
              label: 'ID'
            },

            {
              name: 'browser',
              label: 'Browser'
            },

            {
              name: 'version',
              label: 'Version'
            }
          ],
          onEvent: {
            orderChange: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '${event.data.movedItems.length}行发生移动'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'tpl',
      tpl: '列显示变化事件',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'service',
      api: '/api/mock2/sample?perPage=10',
      body: [
        {
          type: 'table',
          source: '$rows',
          columnsTogglable: true,
          columns: [
            {
              name: 'id',
              label: 'ID'
            },

            {
              name: 'browser',
              label: 'Browser'
            },

            {
              name: 'version',
              label: 'Version'
            }
          ],
          onEvent: {
            columnToggled: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '当前显示${event.data.columns.length}列'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'tpl',
      tpl: '行单击事件',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'service',
      api: '/api/mock2/sample?perPage=10',
      body: [
        {
          type: 'table',
          source: '$rows',
          columns: [
            {
              name: 'id',
              label: 'ID'
            },

            {
              name: 'browser',
              label: 'Browser'
            },

            {
              name: 'version',
              label: 'Version'
            }
          ],
          onEvent: {
            rowClick: {
              actions: [
                {
                  actionType: 'toast',
                  args: {
                    msgType: 'info',
                    msg: '行单击数据：${event.data|json}'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'divider'
    },
    {
      type: 'tpl',
      tpl: '动作',
      inline: false,
      wrapperComponent: 'h1'
    },
    {
      type: 'tpl',
      tpl: '设置表格选中项',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'button-toolbar',
      className: 'm-b',
      buttons: [
        {
          name: 'trigger1',
          id: 'trigger1',
          type: 'action',
          label: '设置表格第一项选中',
          level: 'primary',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'select',
                  componentId: 'table-select',
                  description: '点击设置指定表格第一项内容选中',
                  args: {
                    selected: 'data.rowIndex === 0'
                  }
                }
              ]
            }
          }
        },
        {
          name: 'trigger2',
          id: 'trigger2',
          type: 'action',
          label: '设置表格全部项选中',
          level: 'primary',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'selectAll',
                  componentId: 'table-select',
                  description: '点击设置指定表格全部内容选中'
                }
              ]
            }
          }
        },
        {
          name: 'trigger3',
          id: 'trigger3',
          type: 'action',
          label: '清空表格全部选中项',
          level: 'primary',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clearAll',
                  componentId: 'table-select',
                  description: '点击设置指定表格全部选中项清空'
                }
              ]
            }
          }
        },
        {
          name: 'trigger4',
          id: 'trigger4',
          type: 'action',
          label: '开启表格行排序',
          level: 'primary',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'initDrag',
                  componentId: 'table-select',
                  description: '点击开启表格行排序功能'
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'service',
      api: '/api/mock2/sample?perPage=10',
      body: [
        {
          id: 'table-select',
          type: 'table',
          source: '$rows',
          selectable: true,
          multiple: true,
          columns: [
            {
              name: 'id',
              label: 'ID'
            },

            {
              name: 'browser',
              label: 'Browser'
            },

            {
              name: 'version',
              label: 'Version'
            }
          ]
        }
      ]
    }
  ]
};

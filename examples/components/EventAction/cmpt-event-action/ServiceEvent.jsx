export default {
  type: 'page',
  title: 'Service功能型容器',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'tpl',
      tpl: '事件',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'tpl',
      tpl: '<code>fetchInited</code> 事件',
      inline: false,
      wrapperComponent: 'h3'
    },
    {
      type: 'action',
      level: 'success',
      label: 'fetchInited',
      actionType: 'dialog',
      dialog: {
        title: 'fetchInited',
        body: [
          {
            type: 'service',
            name: 'service-api',
            api: '/api/mock2/page/initData',
            body: {
              type: 'panel',
              title: '$title',
              body: '现在是：${date}'
            },
            onEvent: {
              fetchInited: {
                actions: [
                  {
                    actionType: 'toast',
                    expression: '${!__response.error}',
                    args: {
                      msgType: 'success',
                      msg: 'API inited: <b>${date}</b>'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'tpl',
      tpl: '对于amis的接口标准来说, status不为0, 则视为请求失败. 该事件额外提供了<code>__response</code>参数用于区分接口状态码实际是200成功, 但接口中的status字段不为0的情况(接口状态码如果为非200, 则不会触发该事件)',
      inline: false
    },
    {
      type: 'action',
      level: 'danger',
      label: 'fetchInited(failed)',
      actionType: 'dialog',
      dialog: {
        title: 'fetchInited(failed)',
        body: [
          {
            type: 'service',
            name: 'service-api',
            id: 'service-failed',
            api: '/api/mock2/service/fail',
            body: {
              type: 'panel',
              title: '$title',
              body: [
                {
                  type: 'tpl',
                  tpl: '<strong>toast消息提示设置了触发条件, 当接口失败时不显示toast, 所以结果只会有1个全局默认的toast, 如果不设置条件则会弹出2个toast.</strong>',
                  inline: false
                },
                {
                  type: 'tpl',
                  tpl: '错误信息是: ${__response.msg}',
                  inline: false
                }
              ]
            },
            onEvent: {
              fetchInited: {
                actions: [
                  {
                    actionType: 'setValue',
                    args: {
                      value: '${event.data}'
                    }
                  },
                  {
                    actionType: 'toast',
                    expression: '${!__response.error}',
                    args: {
                      msgType: 'success',
                      msg: 'API inited: <b>${date}</b>'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'tpl',
      tpl: '<code>fetchSchemaInited</code> 事件',
      inline: false,
      wrapperComponent: 'h3'
    },
    {
      type: 'action',
      level: 'info',
      label: 'fetchSchemaInited',
      actionType: 'dialog',
      dialog: {
        title: 'fetchSchemaInited',
        body: [
          {
            type: 'service',
            name: 'service-schema-api',
            schemaApi: '/api/mock2/service/schema?type=form',
            onEvent: {
              fetchSchemaInited: {
                actions: [
                  {
                    actionType: 'toast',
                    args: {
                      msgType: 'info',
                      msg: 'SchemaAPI inited: <b>title: ${title}</b>'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'tpl',
      tpl: '动作',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'tpl',
      tpl: '<code>reload</code> 动作',
      inline: false,
      wrapperComponent: 'h3'
    },
    {
      type: 'action',
      label: 'reload触发器',
      level: 'primary',
      className: 'mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'reload',
              componentId: 'service-reload'
            }
          ]
        }
      }
    },
    {
      type: 'service',
      id: 'service-reload',
      name: 'service-reload',
      api: '/api/mock2/number/random',
      body: {
        type: 'panel',
        title: 'reload动作',
        body: '现在是：${random}'
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'tpl',
      tpl: '<code>rebuild</code> 动作',
      inline: false,
      wrapperComponent: 'h3'
    },
    {
      type: 'alert',
      body: '请选择一种构建方式生成组件',
      level: 'info',
      showIcon: true,
      className: 'mb-3',
      visibleOn: 'this.schemaType == null'
    },
    {
      type: 'button-group',
      tiled: true,
      className: 'mb-3',
      buttons: ['form', 'tabs', 'crud'].map(schema => ({
        type: 'action',
        label: `构建${schema}`,
        icon: 'fa fa-hammer',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'rebuild',
                componentId: 'service-rebuild',
                args: {
                  schemaType: `${schema}`
                }
              }
            ]
          }
        }
      }))
    },
    {
      type: 'service',
      id: 'service-rebuild',
      name: 'service-rebuild',
      schemaApi: {
        url: '/api/mock2/service/schema?type=${schemaType}',
        method: 'post',
        sendOn: 'this.schemaType != null'
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'tpl',
      tpl: '<code>setValue</code> 动作',
      inline: false,
      wrapperComponent: 'h3'
    },
    {
      type: 'action',
      label: 'setValue触发器',
      level: 'primary',
      className: 'mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'service-setvalue',
              args: {
                value: {language: ['🇨🇳 中国']}
              }
            }
          ]
        }
      }
    },
    {
      type: 'service',
      id: 'service-setvalue',
      name: 'service-setvalue',
      data: {
        language: ['🇺🇸 美国']
      },
      body: {
        type: 'panel',
        title: 'setValue动作',
        body: [
          {
            type: 'each',
            name: 'language',
            items: {
              type: 'tpl',
              tpl: "<span class='label label-default m-l-sm'><%= data.item %></span> "
            }
          }
        ]
      }
    }
  ]
};

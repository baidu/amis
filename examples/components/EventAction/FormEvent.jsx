export default {
  type: 'page',
  title: 'form组件支持动作示例',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      type: 'action',
      label: '清空表单',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              componentId: 'form-action-receiver',
              actionType: 'clear'
            }
          ]
        }
      }
    },
    {
      type: 'action',
      label: '重置表单',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
           {
              actionType: 'reset',
              componentId: 'form-action-receiver'
            }
          ]
        }
      }
    },
    {
      type: 'action',
      label: '校验表单',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'validate',
              componentId: 'form-action-receiver'
            }
          ]
        }
      }
    },
    {
      type: 'action',
      label: '重新加载表单组件',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'reload',
              componentId: 'form-action-receiver'
            }
          ]
        }
      }
    },
    {
      type: 'action',
      label: '提交表单',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'submit',
              componentId: 'form-action-receiver'
            }
          ]
        }
      }
    },
    {
      name: 'form-action-receiver',
      id: 'form-action-receiver',
      type: 'form',
      debug: true,
      api: '/api/mock2/form/saveForm',
      initApi:
        'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData',
      body: [
        {
          type: 'input-text',
          name: 'name',
          label: '姓名',
          required: true
        },
        {
          type: 'input-text',
          name: 'email',
          label: '邮箱',
          required: true,
          validations: {
            isEmail: true
          }
        }
      ],
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'dialog',
              args: {
                val: '${event.data}'
              },
              dialog: {
                title: '触发表单change事件',
                data: {
                  val: '${val}'
                },
                body: [
                  {
                    type: 'tpl',
                    tpl: '值更新：${val|json}'
                  }
                ]
              }
            }
          ]
        },
        inited: {
          actions: [
            {
              actionType: 'dialog',
              args: {
                val: '${event.data}'
              },
              dialog: {
                title: '触发表单init事件',
                data: {
                  val: '${val}'
                },
                body: [
                  {
                    type: 'tpl',
                    tpl: '表单初始化数据：${val|json}'
                  }
                ]
              }
            }
          ]
        },
        validateSucc: {
          weight: 1,
          actions: [
            {
              actionType: 'toast',
              msg: '触发表单校验成功事件, 无数据',
              msgType: 'info'
            }
          ]
        },
        validateFail: {
          actions: [
            {
              actionType: 'toast',
              msg: '触发表单校验失败事件, 无数据',
              msgType: 'info'
            }
          ]
        },
        submitSucc: {
          weight: 3,
          actions: [
            {
              actionType: 'dialog',
              args: {
                val: '${event.data}'
              },
              dialog: {
                title: '触发表单提交成功事件',
                data: {
                  val: '${val}'
                },
                body: [
                  {
                    type: 'tpl',
                    tpl: '保存接口返回内容：${val|json}'
                  }
                ]
              }
            }
          ]
        },
        submitFail: {
          actions: [
            {
              actionType: 'dialog',
              args: {
                val: '${event.data}'
              },
              dialog: {
                title: '触发表单校验失败事件',
                data: {
                  val: '${val}'
                },
                body: [
                  {
                    type: 'tpl',
                    tpl: '保存接口返回内容：${val|json}'
                  }
                ]
              }
            }
          ]
        }
      }
    }
  ]
};

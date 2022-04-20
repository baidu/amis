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
      title: '表单：用于接收上面按钮的动作，派发form本身的事件',
      type: 'form',
      debug: true,
      api: '/api/mock2/form/saveForm',
      data: {
        data1: '初始化数据1',
        data2: '初始化数据2'
      },
      initApi:
        'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData',
      body: [
        {
          type: 'input-text',
          name: 'name',
          label: '姓名',
          required: true,
          validateOnChange: true
        },
        {
          type: 'input-text',
          name: 'email',
          label: '邮箱',
          required: true,
          validateOnChange: true,
          validations: {
            isEmail: true
          }
        }
      ],
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msg: '${event.data|json}'
              }
            }
          ]
        },
        inited: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msg: '${event.data|json}'
              }
            }
          ]
        },
        formItemValidateSucc: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msg: '${event.data|json}'
              }
            }
          ]
        },
        formItemValidateError: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msg: '${event.data|json}'
              }
            }
          ]
        },
        validateSucc: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msg: '${event.data|json}'
              }
            }
          ]
        },
        validateFail: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msg: '${event.data|json}'
              }
            }
          ]
        },
        submitSucc: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msg: '${event.data|json}'
              }
            }
          ]
        },
        submitFail: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msg: '${event.data|json}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'form',
      debug: true,
      api: '/api/mock2/form/saveForm',
      title: '表单：派发formItem的校验事件',
      data: {
        data1: '初始化数据1',
        data2: '初始化数据2'
      },
      initApi:
        'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData',
      body: [
        {
          type: 'input-text',
          name: 'name',
          label: '姓名',
          required: true,
          validateOnChange: true
        },
        {
          type: 'input-text',
          name: 'email',
          label: '邮箱',
          required: true,
          validateOnChange: true,
          validations: {
            isEmail: true
          }
        }
      ],
      onEvent: {
        formItemValidateSucc: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msg: '${event.data|json}'
              }
            }
          ]
        },
        formItemValidateError: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msg: '${event.data|json}'
              }
            }
          ]
        }
      }
    }
  ]
};

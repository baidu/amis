export default {
  type: 'page',
  data: {
    globalData: {
      website: 'http://www.baidu.com',
      email: 'amis!@baidu.com'
    }
  },
  body: [
    {
      type: 'alert',
      body: '远程请求后、表单提交后，将数据回填给另一个组件。请求返回的数据可以指定存储在`outputVar`变量里，其他动作可以通过`event.data.{{outputVar}}`直接获取该数据。',
      level: 'info',
      className: 'mb-1'
    },
    {
      type: 'alert',
      body: 'http请求后的数据回填给表单',
      level: 'info',
      className: 'mt-2 mb-1'
    },
    {
      type: 'form',
      id: 'form_data_001',
      title: '用户信息',
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
          label: '作者',
          name: 'author',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      actions: [
        {
          type: 'button',
          label: '去获取表单数据',
          primary: true,
          wrapWithPanel: false,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'ajax',
                  args: {
                    api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData'
                  },
                  outputVar: 'myResult'
                },
                {
                  actionType: 'setValue',
                  componentId: 'form_data_001',
                  args: {
                    value: '${event.data.myResult}'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      type: 'alert',
      body: '弹窗提交后的数据回填给表单',
      level: 'info',
      className: 'mt-2 mb-1'
    },
    {
      type: 'form',
      id: 'form_data_002',
      title: '用户信息',
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
          label: '作者',
          name: 'author',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      actions: [
        {
          type: 'button',
          label: '去获取表单数据',
          primary: true,
          wrapWithPanel: false,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'dialog',
                  dialog: {
                    title: '登录',
                    id: 'dialog_004',
                    data: {
                      username: 'amis'
                    },
                    body: {
                      type: 'form',
                      api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2',
                      body: [
                        {
                          type: 'input-text',
                          name: 'username',
                          required: true,
                          placeholder: '请输入用户名',
                          label: '用户名'
                        },
                        {
                          type: 'input-password',
                          name: 'password',
                          label: '密码',
                          required: true,
                          placeholder: '请输入密码'
                        },
                        {
                          type: 'checkbox',
                          name: 'rememberMe',
                          label: '记住登录'
                        }
                      ]
                    },
                    actions: [
                      {
                        type: 'button',
                        label: '提交',
                        className: 'm',
                        primary: true,
                        onEvent: {
                          click: {
                            actions: [
                              {
                                actionType: 'ajax',
                                args: {
                                  api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData'
                                },
                                outputVar: 'myResult'
                              },
                              {
                                actionType: 'setValue',
                                componentId: 'form_data_002',
                                args: {
                                  value: '${event.data.myResult}'
                                }
                              },
                              {
                                actionType: 'closeDialog'
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      ]
    }
  ]
};

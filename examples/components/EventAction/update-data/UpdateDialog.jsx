export default {
  type: 'page',
  data: {
    globalData: {
      website: 'http://www.baidu.com',
      email: 'amis!@baidu.com',
      rememberMe: true
    }
  },
  body: [
    {
      type: 'alert',
      body: '这种场景一般用在弹窗内某个异步操作后，数据的回填。请求返回的数据可以指定存储在`outputVar`变量里，其他动作可以通过event.data.{{outputVar}}直接获取该数据。',
      level: 'info',
      className: 'mb-1'
    },
    {
      type: 'button',
      label: '打开弹窗',
      level: 'primary',
      className: 'mt-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'dialog',
              dialog: {
                title: '在弹框中的表单',
                id: 'dialog_003',
                data: {
                  username: 'amis',
                  rememberMe: '${globalData.rememberMe}'
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
                    label: '确认',
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
                            componentId: 'dialog_003',
                            args: {
                              value: {
                                username: '${event.data.myResult.name}'
                              }
                            }
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
};

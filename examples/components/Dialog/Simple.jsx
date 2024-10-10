export default {
  type: 'page',
  title: 'Dialog',
  body: [
    {
      type: 'button-toolbar',
      className: 'm-b',
      buttons: [
        {
          type: 'button',
          label: '打开弹框',
          actionType: 'dialog',
          dialog: {
            title: '提示',
            closeOnEsc: true,
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '多级弹框',
          actionType: 'dialog',
          dialog: {
            title: '提示',
            closeOnEsc: true,
            body: '这是个简单的弹框',
            actions: [
              {
                type: 'button',
                actionType: 'confirm',
                label: '确认',
                primary: true
              },

              {
                type: 'button',
                actionType: 'dialog',
                label: '再弹一个',
                dialog: {
                  title: '弹框中的弹框',
                  closeOnEsc: true,
                  body: '如果你想，可以无限弹下去',
                  actions: [
                    {
                      type: 'button',
                      actionType: 'close',
                      label: '算了'
                    },
                    {
                      type: 'button',
                      actionType: 'dialog',
                      label: '来吧',
                      level: 'info',
                      dialog: {
                        title: '弹框中的弹框',
                        closeOnEsc: true,
                        body: [
                          {
                            type: 'tpl',
                            tpl: '如果你想，可以无限弹下去',
                            inline: false
                          },
                          {
                            type: 'button',
                            actionType: 'submit',
                            label: '算了，不弹了',
                            close: true
                          }
                        ],
                        actions: [
                          {
                            type: 'button',
                            actionType: 'confirm',
                            label: '不弹了',
                            primary: true
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        },

        {
          type: 'button',
          label: '弹个表单',
          actionType: 'dialog',
          dialog: {
            size: 'lg',
            title: '在弹框中的表单',
            closeOnEsc: true,
            actions: [
              {
                label: '取消',
                actionType: 'close',
                type: 'button'
              },

              {
                label: '确认',
                actionType: 'confirm',
                type: 'button',
                level: 'primary'
              },

              {
                label: '提交不关闭',
                actionType: 'submit',
                close: false,
                type: 'button',
                api: '/api/mock2/form/saveForm?waitSeconds=2',
                level: 'primary'
              },

              {
                label: '保存不关闭',
                actionType: 'ajax',
                type: 'button',
                api: '/api/mock2/form/saveForm?waitSeconds=4',
                level: 'info'
              },

              {
                type: 'button',
                label: 'Feedback',
                close: true,
                actionType: 'ajax',
                api: '/api/mock2/form/initData?waitSeconds=2',
                tooltip: '点击我后会发送一个请求，请求回来后，弹出一个框。',
                feedback: {
                  title: '操作成功',
                  body: 'xxx 已操作成功'
                }
              }
            ],
            body: {
              type: 'form',
              api: '/api/mock2/form/saveForm?waitSeconds=2',
              title: '常规模式',
              mode: 'normal',
              body: [
                {
                  type: 'input-email',
                  name: 'email',
                  required: true,
                  placeholder: '请输入邮箱',
                  label: '邮箱'
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
            }
          }
        },

        {
          type: 'button',
          label: '再弹个表单',
          actionType: 'dialog',
          dialog: {
            title: '在弹框中的表单',
            actions: [
              {
                label: '取消',
                actionType: 'close',
                type: 'button'
              },

              {
                label: '确认',
                actionType: 'confirm',
                type: 'button',
                level: 'primary',
                disabledOn: '!data.rememberMe'
              }
            ],
            body: {
              type: 'form',
              api: '/api/mock2/form/saveForm?waitSeconds=2',
              title: '常规模式',
              mode: 'normal',
              body: [
                {
                  type: 'checkbox',
                  name: 'rememberMe',
                  label: '勾上我才可以确认'
                }
              ]
            }
          }
        },

        {
          type: 'button',
          label: 'Feedback',
          actionType: 'ajax',
          api: '/api/mock2/form/initData?waitSeconds=2',
          tooltip: '点击我后会发送一个请求，请求回来后，弹出一个框。',
          feedback: {
            title: '操作成功',
            closeOnEsc: true,
            body: 'xxx 已操作成功'
          }
        },

        {
          type: 'button',
          label: 'Feedback2',
          actionType: 'ajax',
          api: '/api/mock2/form/initData?waitSeconds=2',
          tooltip: '可以根据条件弹出，比如这个例子，看当前时间戳是否可以整除3',
          feedback: {
            visibleOn: '!(this.date % 3)',
            title: '操作成功',
            body: '当前时间戳: <code>${date}</code>'
          }
        }
      ]
    },

    {
      type: 'button-toolbar',
      className: 'm-l-none',
      buttons: [
        {
          type: 'button',
          label: 'sm 弹框',
          actionType: 'dialog',
          dialog: {
            size: 'sm',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '标准 弹框',
          actionType: 'dialog',
          dialog: {
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: 'lg 弹框',
          actionType: 'dialog',
          dialog: {
            size: 'lg',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: 'xl 弹框',
          actionType: 'dialog',
          dialog: {
            size: 'xl',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: 'full 弹框',
          actionType: 'dialog',
          dialog: {
            size: 'full',
            title: '全屏弹框',
            body: '弹框尽可能占满，内容部分滚动。'
          }
        }
      ]
    }
  ]
};

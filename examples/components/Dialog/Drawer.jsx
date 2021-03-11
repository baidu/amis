export default {
  type: 'page',
  title: 'Drawer',
  body: [
    {
      type: 'button-toolbar',
      className: 'block',
      buttons: [
        {
          type: 'button',
          label: '左侧弹出-极小框',
          actionType: 'drawer',
          drawer: {
            position: 'left',
            size: 'xs',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '左侧弹出-小框',
          actionType: 'drawer',
          drawer: {
            position: 'left',
            size: 'sm',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '左侧弹出-中框',
          actionType: 'drawer',
          drawer: {
            position: 'left',
            size: 'md',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '左侧弹出-大框',
          actionType: 'drawer',
          drawer: {
            position: 'left',
            size: 'lg',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '左侧弹出-超大',
          actionType: 'drawer',
          level: 'danger',
          drawer: {
            position: 'left',
            size: 'xl',
            title: '提示',
            body: '这是个简单的弹框'
          }
        }
      ]
    },

    {
      type: 'button-toolbar',
      className: 'block m-t',
      buttons: [
        {
          type: 'button',
          label: '右侧弹出-极小框',
          level: 'success',
          actionType: 'drawer',
          drawer: {
            position: 'right',
            size: 'xs',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '右侧弹出-小框',
          level: 'success',
          actionType: 'drawer',
          drawer: {
            position: 'right',
            size: 'sm',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '右侧弹出-中框',
          level: 'success',
          actionType: 'drawer',
          drawer: {
            position: 'right',
            size: 'md',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '右侧弹出-大框',
          level: 'success',
          actionType: 'drawer',
          drawer: {
            position: 'right',
            size: 'lg',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '右侧弹出-超大',
          level: 'danger',
          actionType: 'drawer',
          drawer: {
            size: 'xl',
            position: 'right',
            title: '提示',
            body: '这是个简单的弹框'
          }
        }
      ]
    },

    {
      type: 'button-toolbar',
      className: 'block m-t',
      buttons: [
        {
          type: 'button',
          label: '顶部弹出-极小框',
          actionType: 'drawer',
          level: 'info',
          drawer: {
            position: 'top',
            size: 'xs',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '顶部弹出-小框',
          level: 'info',
          actionType: 'drawer',
          drawer: {
            position: 'top',
            size: 'sm',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '顶部弹出-中框',
          actionType: 'drawer',
          level: 'info',
          drawer: {
            position: 'top',
            size: 'md',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '顶部弹出-大框',
          actionType: 'drawer',
          level: 'info',
          drawer: {
            position: 'top',
            size: 'lg',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '顶部弹出 - 超大',
          level: 'danger',
          actionType: 'drawer',
          drawer: {
            position: 'top',
            size: 'xl',
            title: '提示',
            body: '这是个简单的弹框'
          }
        }
      ]
    },

    {
      type: 'button-toolbar',
      className: 'block m-t',
      buttons: [
        {
          type: 'button',
          label: '底部弹出-极小框',
          actionType: 'drawer',
          level: 'primary',
          drawer: {
            position: 'bottom',
            size: 'xs',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '底部弹出-小框',
          level: 'primary',
          actionType: 'drawer',
          drawer: {
            position: 'bottom',
            size: 'sm',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '底部弹出-中框',
          actionType: 'drawer',
          level: 'primary',
          drawer: {
            position: 'bottom',
            size: 'md',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '底部弹出-大框',
          actionType: 'drawer',
          level: 'primary',
          drawer: {
            position: 'bottom',
            size: 'lg',
            title: '提示',
            body: '这是个简单的弹框'
          }
        },

        {
          type: 'button',
          label: '底部弹出-超大',
          level: 'danger',
          actionType: 'drawer',
          drawer: {
            position: 'bottom',
            size: 'xl',
            title: '提示',
            body: '这是个简单的弹框'
          }
        }
      ]
    },

    {
      type: 'button-toolbar',
      className: 'block m-t',
      buttons: [
        {
          type: 'button',
          label: '多级弹框',
          actionType: 'drawer',
          level: 'danger',
          drawer: {
            title: '提示',
            body: '这是个简单的弹框',
            closeOnEsc: true,
            actions: [
              {
                type: 'button',
                actionType: 'confirm',
                label: '确认',
                primary: true
              },

              {
                type: 'button',
                actionType: 'drawer',
                label: '再弹一个',
                drawer: {
                  position: 'left',
                  title: '弹框中的弹框',
                  closeOnEsc: true,
                  body: '如果你想，可以无限弹下去',
                  actions: [
                    {
                      type: 'button',
                      actionType: 'drawer',
                      label: '来吧',
                      level: 'info',
                      drawer: {
                        position: 'right',
                        title: '弹框中的弹框',
                        closeOnEsc: true,
                        body: '如果你想，可以无限弹下去',
                        actions: [
                          {
                            type: 'button',
                            actionType: 'confirm',
                            label: '可以了',
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
          label: '交叉测试',
          actionType: 'drawer',
          className: 'm-l-xs',
          level: 'danger',
          drawer: {
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
                closeOnEsc: true,
                label: '再弹一个',
                dialog: {
                  position: 'left',
                  title: '弹框中的弹框',
                  closeOnEsc: true,
                  body: '如果你想，可以无限弹下去',
                  actions: [
                    {
                      type: 'button',
                      actionType: 'drawer',
                      label: '来吧',
                      level: 'info',
                      drawer: {
                        position: 'right',
                        title: '弹框中的弹框',
                        body: '如果你想，可以无限弹下去',
                        closeOnEsc: true,
                        actions: [
                          {
                            type: 'button',
                            actionType: 'confirm',
                            label: '可以了',
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
          label: '可拉拽调整大小',
          actionType: 'drawer',
          level: 'danger',
          drawer: {
            title: '提示',
            closeOnEsc: true,
            resizable: true,
            body: '这是个简单的弹框'
          }
        }
      ]
    }
  ]
};

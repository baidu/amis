---
title: 事件动作
description: 事件动作
type: 0
group: 💡 概念
menuName: 事件动作
icon:
order: 9
---

> 1.7.0 及以上版本

上一节我们介绍了如何实现联动，是比较基础和局限的，而事件动作是更简单、更灵活、更高级的用法，可以解决复杂的 UI 交互场景，支持渲染器事件监听和响应设计，无需关心组件层级关系。例如：

- 传递数据
  - 点击「按钮」，发送一个远程请求，返回的数据回填给一个表单
  - 弹窗提交后，将弹窗内表单数据回填给另一个表单
- 联动刷新
  - 下拉选择不同项，联动刷新表单数据
- 状态控制
  - 勾选不同按钮，控制相应组件的显示/隐藏
  - 勾选不同按钮，控制相应组件的启用/禁用
- 多个组件监听同一个事件做出不同响应
  - 下拉选择不同项，组件 A 监听后发送一个远程请求，组件 B 监听后进行刷新
- 逻辑编排
  - 针对监听到的事件，循环执行一些动作作为响应，还可以控制循环跳出或跳过
  - 针对监听到的事件，根据条件选择性的执行动作响应
  - 针对监听到的事件，并行执行多个动作作为响应
  - 执行完当前动作后，可以选择是否继续执行后续动作，是否关闭事件默认行为的执行

## 基本使用

通过`onEvent`属性实现渲染器事件与响应动作的绑定。`onEvent`内配置事件和动作映射关系，`actions`是事件对应的响应动作的集合。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '尝试点击、鼠标移入/移出',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '派发点击事件'
              }
            }
          ]
        },
        mouseenter: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '派发鼠标移入事件'
              }
            }
          ]
        },
        mouseleave: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '派发鼠标移出事件'
              }
            }
          ]
        }
      }
    }
  ]
}
```

## 事件与动作

事件包含`渲染器事件`和`广播事件`。

- 渲染器事件，由具体的渲染器组件提供，每个渲染器组件暴露的事件可以查看具体的[组件文档](./components/page)；
- 广播事件，即自定义事件，可以自定义派发的事件名称`eventName`，其他渲染器可以监听该自定义事件并配置响应动作。

动作包含`通用动作`、`组件动作`、`广播动作`、`自定义动作`，可以通过配置`actionType`来指定具体执行什么动作。

## 触发通用动作

通用动作包含发送 http 请求、跳转链接、浏览器回退、浏览器刷新、打开/关闭弹窗、打开/关闭抽屉、打开对话框、弹出 Toast 提示、复制、发送邮件、刷新、控制显示隐藏、控制启用禁用状态、更新数据。

### 发送 http 请求

通过配置`actionType: 'ajax'`和`api`实现 http 请求发送。如果是`post`请求，args 中的附加参数将作为请求参数。

```schema
{
  type: 'page',
  data: {
    name: 'lll'
  },
  body: [
    {
      type: 'button',
      id: 'b_001',
      label: '发送 Ajax 请求',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'ajax',
              args: {
                api: {
                  url: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?name=${name}',
                  method: 'get'
                },
                messages: {
                  success: '成功了！欧耶',
                  failed: '失败了呢。。'
                },
                age: 18
              }
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名                               | 类型                                | 默认值 | 说明                      |
| ------------------------------------ | ----------------------------------- | ------ | ------------------------- |
| actionType                           | `string`                            | `ajax` | ajax 请求                 |
| api / args.api`(>=v1.9.0)`           | [API](../../../docs/types/api)      | -      | 接口配置                  |
| options / args.options`(>=v1.9.0)`   | `object`                            | -      | 其他配置                  |
| messages / args.messages`(>=v1.9.0)` | `{success: string, failed: string}` | -      | 请求成功/失败后的提示信息 |

### 打开弹窗（模态）

通过配置`actionType: 'dialog'`和`dialog`实现 Dialog 弹窗。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      className: 'ml-2',
      label: '打开弹窗（模态）',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'dialog',
              dialog: {
                type: 'dialog',
                title: '模态弹窗',
                id: 'dialog_001',
                data: {
                   myage: '22'
                },
                body: [
                  {
                    type: 'tpl',
                    tpl: '<p>对，你打开了模态弹窗</p>',
                    inline: false
                  },
                  {
                    type: 'input-text',
                    name: 'myname',
                    mode: 'horizontal',
                    onEvent: {
                      change: {
                        actions: [
                          {
                            actionType: 'confirm',
                            componentId: 'dialog_001'
                          }
                        ]
                      }
                    }
                  }
                ],
                onEvent: {
                  confirm: {
                    actions: [
                      {
                        actionType: 'toast',
                        msg: 'confirm'
                      }
                    ]
                  },
                  cancel: {
                    actions: [
                      {
                        actionType: 'toast',
                        msg: 'cancel'
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名     | 类型                    | 默认值   | 说明                                       |
| ---------- | ----------------------- | -------- | ------------------------------------------ |
| actionType | `string`                | `dialog` | 点击后显示一个弹出框                       |
| dialog     | `string`/`DialogObject` | -        | 指定弹框内容，格式可参考[Dialog](./dialog) |

### 关闭弹窗（模态）

通过配置`actionType: 'closeDialog'`实现关闭当前弹窗；附加配置`componentId`可以实现关闭指定弹窗。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      id: 'b_003',
      label: '打开弹窗（模态）',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'dialog',
              dialog: {
                type: 'dialog',
                id: 'dialog_002',
                title: '模态弹窗',
                body: [
                  {
                    type: 'button',
                    label: '打开子弹窗，然后关闭它的父亲',
                    onEvent: {
                      click: {
                        actions: [
                          {
                            actionType: 'dialog',
                            dialog: {
                              type: 'dialog',
                              title: '模态子弹窗',
                              body: [
                                {
                                  type: 'button',
                                  label: '关闭指定弹窗（关闭父弹窗）',
                                  onEvent: {
                                    click: {
                                      actions: [
                                        {
                                          actionType: 'closeDialog',
                                          componentId: 'dialog_002'
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
                  },
                  {
                    type: 'button',
                    label: '关闭当前弹窗',
                    className: 'ml-2',
                    onEvent: {
                      click: {
                        actions: [
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
```

**动作属性**

| 属性名      | 类型     | 默认值        | 说明            |
| ----------- | -------- | ------------- | --------------- |
| actionType  | `string` | `closeDialog` | 关闭弹窗        |
| componentId | `string` | -             | 指定弹框组件 id |

### 打开抽屉（模态）

通过配置`actionType: 'drawer'`和`drawer`实现 Drawer 抽屉打开。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      id: 'b_004',
      level: 'primary',
      label: '打开抽屉（模态）',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'drawer',
              drawer: {
                type: 'drawer',
                title: '模态抽屉',
                body: [
                  {
                    type: 'tpl',
                    tpl: '<p>对，你打开了模态抽屉</p>',
                    inline: false
                  }
                ],
                onEvent: {
                  confirm: {
                    actions: [
                      {
                        actionType: 'toast',
                        msg: 'confirm'
                      }
                    ]
                  },
                  cancel: {
                    actions: [
                      {
                        actionType: 'toast',
                        msg: 'cancel'
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名     | 类型                    | 默认值   | 说明                                       |
| ---------- | ----------------------- | -------- | ------------------------------------------ |
| actionType | `string`                | `drawer` | 点击后显示一个侧边栏                       |
| drawer     | `string`/`DrawerObject` | -        | 指定弹框内容，格式可参考[Drawer](./drawer) |

### 关闭抽屉（模态）

通过配置`actionType: 'closeDrawer'`实现关闭当前抽屉；附加配置`componentId`可以实现关闭指定抽屉。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '打开抽屉（模态）',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'drawer',
              drawer: {
                type: 'drawer',
                id: 'drawer_1',
                title: '模态抽屉',
                body: [
                  {
                    type: 'button',
                    label: '打开子抽屉，然后关闭它的父亲',
                    onEvent: {
                      click: {
                        actions: [
                          {
                            actionType: 'drawer',
                            drawer: {
                              type: 'drawer',
                              title: '模态子抽屉',
                              body: [
                                {
                                  type: 'button',
                                  label: '关闭指定抽屉(关闭父抽屉)',
                                  onEvent: {
                                    click: {
                                      actions: [
                                        {
                                          actionType: 'closeDrawer',
                                          componentId: 'drawer_1'
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
                  },
                  {
                    type: 'button',
                    label: '关闭当前抽屉',
                    className: 'ml-2',
                    onEvent: {
                      click: {
                        actions: [
                          {
                            actionType: 'closeDrawer'
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
```

**动作属性**

| 属性名      | 类型     | 默认值        | 说明            |
| ----------- | -------- | ------------- | --------------- |
| actionType  | `string` | `closeDrawer` | 关闭抽屉        |
| componentId | `string` | -             | 指定抽屉组件 id |

### 打开对话框

通过配置`actionType: 'alert'`或`actionType: 'confirm'`打开不同对话框。

#### 提示对话框

```schema
{
  type: 'page',
  data: {
    msg: '去吃饭了'
  },
  body: [
    {
      type: 'button',
      label: '提示对话框（模态）',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'alert',
              args: {
                msg: '<a href="http://www.baidu.com" target="_blank">${msg}~</a>'
              }
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名                      | 类型     | 默认值  | 说明           |
| --------------------------- | -------- | ------- | -------------- |
| actionType                  | `string` | `alert` | 打开提示对话框 |
| msg / args.msg`(>=v1.9.0) ` | `string` | -       | 对话框提示内容 |

#### 确认对话框

```schema
{
  type: 'page',
  data: {
    title: '操作确认',
    msg: '要删除它吗？'
  },
  body: [
    {
      type: 'button',
      label: '确认对话框（模态）',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'confirmDialog',
              args: {
                title: '${title}',
                msg: '<span style="color:red">${msg}</span>'
              }
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名                         | 类型     | 默认值          | 说明           |
| ------------------------------ | -------- | --------------- | -------------- |
| actionType                     | `string` | `confirmDialog` | 打开确认对话框 |
| title / args.title`(>=v1.9.0)` | `string` | -               | 对话框标题     |
| msg / args.msg `(>=v1.9.0)`    | `string` | -               | 对话框提示内容 |

### 跳转链接

通过配置`actionType: 'url'`或`actionType: 'link'`实现链接跳转。

**打开页面链接**

```schema
{
  type: 'page',
  data: {
    myname: 'lvxj',
    myjon: 'player'
  },
  body: [
    {
      type: 'button',
      label: '百度一下',
      level: 'primary',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'url',
              args: {
                url: 'http://www.baidu.com',
                blank: true,
                params: {
                  name: 'jack',
                  jon: '${myjon}'
                },
                name: '${myname}',
                age: 18
              }
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名                         | 类型      | 默认值  | 说明                                             |
| ------------------------------ | --------- | ------- | ------------------------------------------------ |
| actionType                     | `string`  | `url`   | 页面跳转                                         |
| url / args.url`(>=v1.9.0)`     | `string`  | -       | 按钮点击后，会打开指定页面。可用 `${xxx}` 取值。 |
| blank / args.blank`(>=v1.9.0)` | `boolean` | `false` | 如果为 `true` 将在新 tab 页面打开。              |
| args.params`(>=v1.9.0)`        | `object`  | -       | 页面参数`{key:value}`，支持数据映射。            |

**打开单页链接**

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '跳转至「表达式」',
      level: 'primary',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'link',
              link: './expression'
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**
| 属性名 | 类型 | 默认值 | 说明 |
| ---------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| actionType | `string` | `link` | 单页跳转 |
| link / args.link`(>=v1.9.0)` | `string` | `link` | 用来指定跳转地址，跟 url 不同的是，这是单页跳转方式，不会渲染浏览器，请指定 amis 平台内的页面。可用 `${xxx}` 取值。 |
| args.params`(>=v1.9.0)` | `object` | - | 页面参数`{key:value}`，支持数据映射。 |

### 浏览器回退

通过配置`actionType: 'goBack'`实现页面回退。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '回退',
      level: 'primary',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'goBack'
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名     | 类型     | 默认值   | 说明         |
| ---------- | -------- | -------- | ------------ |
| actionType | `string` | `goBack` | 返回上个页面 |

### 前进/后退到指定页面

通过配置`actionType: 'goPage'`实现浏览器页面的前进/后退。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '后退到上上个页面',
      level: 'primary',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'goPage',
              delta: -2
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名                         | 类型     | 默认值   | 说明            |
| ------------------------------ | -------- | -------- | --------------- |
| actionType                     | `string` | `goPage` | 前进/后退到页面 |
| delta / args.delta`(>=v1.9.0)` | `string` | `0`      | 位置            |

### 浏览器刷新

通过配置`actionType: 'refresh'`实现浏览器刷新。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '刷新页面',
      level: 'primary',
      className: 'ml-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'refresh'
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名     | 类型     | 默认值    | 说明         |
| ---------- | -------- | --------- | ------------ |
| actionType | `string` | `refresh` | 返回上个页面 |

### toast 提示

通过配置`actionType: 'toast'`和`msg`实现弹出 toast

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '警告',
      level: 'warning',
      className: 'mr-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'warning',
                msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
                position: 'top-right'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '成功',
      level: 'success',
      className: 'mr-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'success',
                msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
                position: 'top-right'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '错误',
      level: 'danger',
      className: 'mr-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'error',
                msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
                position: 'top-right'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '提示',
      level: 'info',
      className: 'mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
                position: 'top-right'
              }
            }
          ]
        }
      }
    },
    {
      type: 'tpl',
      tpl: '<br>',
    },
    {
      type: 'button',
      label: '左上',
      className: 'mr-2 mt-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
                position: 'top-left'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '中上',
      className: 'mr-2 mt-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
                position: 'top-center'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '右上',
      className: 'mt-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
                position: 'top-right'
              }
            }
          ]
        }
      }
    },
    {
      type: 'tpl',
      tpl: '<br>',
    },
    {
      type: 'button',
      label: '屏幕的中央',
      className: 'ml-10 mt-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
                position: 'center'
              }
            }
          ]
        }
      }
    },
    {
      type: 'tpl',
      tpl: '<br>',
    },
    {
      type: 'button',
      label: '左下',
      className: 'mr-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
                position: 'bottom-left'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '中下',
      className: 'mr-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
                position: 'bottom-center'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '右下',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msgType: 'info',
                msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
                position: 'bottom-right'
              }
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名                                     | 类型      | 默认值                                  | 说明                                                                                                              |
| ------------------------------------------ | --------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| actionType                                 | `string`  | `"toast"`                               | 指定 toast 动作                                                                                                   |
| msgType / args.msgType`(>=v1.9.0)`         | `string`  | `"info"`                                | 消息类型 `"info"、"success"、"error"、"warning"`                                                                  |
| msg / args.msg`(>=v1.9.0)`                 | `string`  | -                                       | 消息内容                                                                                                          |
| position / args.position`(>=v1.9.0)`       | `string`  | `top-center（移动端为center）`          | 提示显示位置，可用'top-right'、'top-center'、'top-left'、'bottom-center'、'bottom-left'、'bottom-right'、'center' |
| closeButton / args.closeButton`(>=v1.9.0)` | `boolean` | `false`                                 | 是否展示关闭按钮                                                                                                  |
| showIcon / args.showIcon`(>=v1.9.0)`       | `boolean` | `true`                                  | 是否展示图标                                                                                                      |
| timeout / args.timeout`(>=v1.9.0)`         | `number`  | `5000（error类型为6000，移动端为3000）` | 持续时间                                                                                                          |

### 复制

通过配置`actionType: 'copy'`和复制属性实现文本的复制操作，该动作需实现 env.copy(contents: string, options?: any) => void 方法。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '复制一段文本',
      level: 'primary',
      className: 'mr-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'copy',
              args: {
                content: 'http://www.baidu.com'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '复制一段富文本',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'copy',
              args: {
                ormat: 'text/html',
                content: "<a href='http://www.baidu.com'>link</a> <b>bold</b>"
              }
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名                                   | 类型                                 | 默认值      | 说明                                 |
| ---------------------------------------- | ------------------------------------ | ----------- | ------------------------------------ |
| actionType                               | `string`                             | `copy`      | 复制一段内容到粘贴板                 |
| copyFormat / args.copyFormat`(>=v1.9.0)` | `string`                             | `text/html` | 复制格式                             |
| content / args.content`(>=v1.9.0)`       | [模板](../../docs/concepts/template) | -           | 指定复制的内容。可用 `${xxx}` 取值。 |

### 发送邮件

通过配置`actionType: 'email'`和邮件属性实现发送邮件操作。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '发送邮件',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'email',
              args: {
                to: 'amis@baidu.com',
                cc: 'baidu@baidu.com',
                subject: '这是邮件主题',
                body: '这是邮件正文'
              }
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名                             | 类型     | 默认值  | 说明                             |
| ---------------------------------- | -------- | ------- | -------------------------------- |
| actionType                         | `string` | `email` | 点击后显示一个弹出框             |
| to / args.to`(>=v1.9.0)`           | `string` | -       | 收件人邮箱，可用 ${xxx} 取值。   |
| cc / args.cc`(>=v1.9.0)`           | `string` | -       | 抄送邮箱，可用 ${xxx} 取值。     |
| bcc / args.bcc`(>=v1.9.0)`         | `string` | -       | 匿名抄送邮箱，可用 ${xxx} 取值。 |
| subject / args.subject`(>=v1.9.0)` | `string` | -       | 邮件主题，可用 ${xxx} 取值。     |
| body / args.body`(>=v1.9.0)`       | `string` | -       | 邮件正文，可用 ${xxx} 取值。     |

### 刷新

通过配置`actionType: 'reload'`实现对指定组件的刷新（重新加载）操作，仅支持`form`、`wizard`、`service`、`page`、`app`、`chart`、`crud`，以及支持动态数据的`输入类`组件，详见组件的`动作表`。

#### 刷新 表单

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '刷新',
      className: 'mb-2',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'reload',
              componentId: 'form-reload'
            }
          ]
        }
      }
    },
    {
      type: 'form',
      id: 'form-reload',
      name: 'form-reload',
      initApi:
        'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData',
      title: '表单',
      body: [
        {
          type: 'input-text',
          id: 'date-input-01',
          name: 'date',
          label: '时间戳'
        }
      ]
    }
  ]
}
```

#### 刷新 图表

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '刷新',
      level: 'primary',
      className: 'mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'reload',
              componentId: 'chart_reload'
            }
          ]
        }
      }
    },
    {
    "type": "chart",
    id: 'chart_reload',
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/chart/chartData",
    "config": {
      "xAxis": {
        "type": "category",
        "data": [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat"
        ]
      },
      "yAxis": {
        "type": "value"
      },
      "series": [
        {
          "data": "${line}",
          "type": "line"
        }
      ]
    }
  }
  ]
}
```

#### 刷新 下拉框

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '刷新',
      className: 'mb-2',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'reload',
              componentId: 'select-reload'
            }
          ]
        }
      }
    },
    {
      label: '下拉框',
      type: 'select',
      id: 'select-reload',
      mode: 'horizontal',
      className: 'mt-2',
      name: 'select',
      source:
        'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1'
    }
  ]
}
```

**刷新 输入框**

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '刷新',
      className: 'mb-2',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'reload',
              componentId: 'input-text-reload'
            }
          ]
        }
      }
    },
    {
      "name": "input-text-reload",
      "id": "input-text-reload",
      "type": "input-text",
      "label": "text",
      "creatable": false,
      "source": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1"
    }
  ]
}
```

**动作属性**

| 属性名      | 类型     | 默认值   | 说明                  |
| ----------- | -------- | -------- | --------------------- |
| actionType  | `string` | `reload` | 刷新组件              |
| componentId | `string` | -        | 指定刷新的目标组件 id |

### 显示与隐藏

通过配置`actionType: 'show'`或`'hidden'`实现对指定组件的显示和隐藏，且显隐动作的控制高于组件显隐属性的设置。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '显示',
      level: 'primary',
      className: 'mr-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'show',
              componentId: 'input-text_001'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '隐藏',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'hidden',
              componentId: 'input-text_001'
            }
          ]
        }
      }
    },
    {
      type: 'input-text',
      label: '愿望',
      className: 'mt-2',
      id: 'input-text_001',
      mode: 'horizontal',
      hidden: true
    }
  ]
}
```

**动作属性**

| 属性名      | 类型     | 默认值             | 说明                        |
| ----------- | -------- | ------------------ | --------------------------- |
| actionType  | `string` | `show` or `hidden` | 显示或隐藏组件              |
| componentId | `string` | -                  | 指定显示或隐藏的目标组件 id |

### 控制状态

通过配置`actionType: 'enabled'`或`actionType: 'disabled'`实现对指定组件的启用和禁用，仅支持实现了状态控制功能的数据`输入类`组件。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      id: 'b_dis',
      label: '禁用',
      level: 'primary',
      className: 'mr-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'disabled',
              componentId: 'form_disable'
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '启用',
      level: 'primary',
      className: 'mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'enabled',
              componentId: 'form_disable'
            }
          ]
        }
      }
    },
    {
      type: 'form',
      id: 'form_disable',
      title: '表单',
      body: [
        {
          type: 'group',
          body: [
            {
              type: 'button',
              className: 'ml-2',
              label: '我的状态变了'
            },
            {
              type: 'button',
              className: 'ml-2',
              label: '禁用上面的按钮',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'disabled',
                      componentId: 'b_dis'
                    }
                  ]
                }
              }
            },
            {
              type: 'button',
              className: 'ml-2',
              label: '启用用上面的按钮',
              level: 'primary',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'enabled',
                      componentId: 'b_dis'
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

**动作属性**

| 属性名      | 类型     | 默认值                  | 说明                        |
| ----------- | -------- | ----------------------- | --------------------------- |
| actionType  | `string` | `enabled` or `disabled` | 启用或禁用组件              |
| componentId | `string` | -                       | 指定启用或禁用的目标组件 id |

### 更新数据

更新数据即变量赋值，通过配置`actionType: 'setValue'`实现组件数据域变量的更新，支持`基础类型`、`对象类型`、`数组类型`，数据类型取决于目标组件所需数据值类型，仅支持`form`、`dialog`、`drawer`、`wizard`、`service`、`page`、`app`、`chart`，以及数据`输入类`组件。

#### 更新 表单 数据

直接更新指定的表单组件的数据。

```schema
{
  type: 'page',
  data: {
    globalData: {
      myrole: '法官',
      mymsg: '该吃饭了!'
    }
  },
  body: [
    {
      type: 'button',
      label: '更新',
      level: 'primary',
      className: 'mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'form_data',
              args: {
                value: '${globalData}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'form',
      id: 'form_data',
      title: '表单',
      debug: true,
      data: {
        myrole: '预言家',
        age: '18'
      },
      "initApi": "/api/mock2/form/initData",
      body: [
        {
          type: 'input-text',
          label: '角色',
          name: 'myrole',
          disabled: false,
          mode: 'horizontal'
        },
        {
          type: 'input-text',
          label: '年龄',
          name: 'age',
          disabled: false,
          mode: 'horizontal'
        }
      ]
    }
  ]
}
```

#### 更新 弹窗 数据

这种场景一般用在弹窗内某个异步操作后，数据的回填。请求返回的数据可以指定存储在`outputVar`变量里，其他动作可以通过`event.data.{{outputVar}}`直接获取该数据。

```schema
{
  type: 'page',
  data: {
    globalData: {
      website: "http://www.baidu.com",
      email: "amis!@baidu.com",
      rememberMe: true
    }
  },
  body: [
    {
      type: 'button',
      label: '打开弹窗',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'dialog',
              "dialog": {
                "title": "在弹框中的表单",
                "id": "dialog_003",
                "data": {
                  username: 'amis',
                  rememberMe: '${globalData.rememberMe}'
                },
                "body": {
                  "type": "form",
                  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
                  "body": [
                    {
                      "type": "input-text",
                      "name": "username",
                      "required": true,
                      "placeholder": "请输入用户名",
                      "label": "用户名"
                    },
                    {
                      "type": "input-password",
                      "name": "password",
                      "label": "密码",
                      "required": true,
                      "placeholder": "请输入密码"
                    },
                    {
                      "type": "checkbox",
                      "name": "rememberMe",
                      "label": "记住登录"
                    }
                  ]
                },
                "actions": [
                  {
                    type: 'button',
                    label: '请求后更新',
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
}
```

#### 更新 向导 数据

直接更新指定的向导组件的数据。

```schema
{
  type: 'page',
  data: {
    globalData: {
      website: "http://www.baidu.com",
      email: "amis!@baidu.com"
    }
  },
  body: [
    {
      type: 'button',
      label: '更新',
      level: 'primary',
      className: 'mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'wizard_data',
              args: {
                value: '${globalData}'
              }
            }
          ]
        }
      }
    },
    {
      "type": "wizard",
      "id": "wizard_data",
      "mode": "vertical",
      "data": {
        "website": "test",
        "email": "test"
      },
      "steps": [
        {
          "title": "第一步",
          "body": [
            {
              "name": "website",
              "label": "网址",
              "type": "input-url"
            }
          ]
        },
        {
          "title": "Step 2",
          "body": [
            {
              "name": "email",
              "label": "邮箱",
              "type": "input-email",
              "required": true
            }
          ]
        }
      ]
    }
  ]
}
```

#### 更新 图表 数据

直接更新图表的数据等于更新图表所依赖数据域中的变量，例如下面的例子，`setValue`等于更新绑定的变量`${line}`。

```schema
{
  type: 'page',
  data: {
    lineData: {
      line: [65, 63, 10, 73, 42, 21]
    }
  },
  body: [
    {
      type: 'button',
      label: '更新',
      level: 'primary',
      className: 'mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'chart_setvalue',
              args: {
                value: '${lineData}'
              }
            }
          ]
        }
      }
    },
    {
    "type": "chart",
    id: 'chart_setvalue',
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/chart/chartData",
    "config": {
      "xAxis": {
        "type": "category",
        "data": [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat"
        ]
      },
      "yAxis": {
        "type": "value"
      },
      "series": [
        {
          "data": "${line}",
          "type": "line"
        }
      ]
    }
  }
  ]
}
```

#### 更新 输入类组件 数据

直接更新指定输入框、下拉框、输入组合等输入类组件的数据。

**更新 输入框 字段值**

```schema
{
  type: 'page',
  id: 'mypage',
  data: {
    globalData: {
      myrole: '法官',
      mymsg: '该吃饭了!',
      title: 'beijing time'
    }
  },
  body: [
    {
      type: 'button',
      label: '更新输入框',
      level: 'primary',
      className: 'mr-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'input_data_msg',
              args: {
                value: '我是amis!'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '更新表单内输入框',
      level: 'primary',
      className: 'mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'input_data_role',
              args: {
                value: '预言家'
              }
            }
          ]
        }
      }
    },
    {
      type: "input-text",
      label: "消息",
      id: "input_data_msg",
      mode: 'horizontal',
      name: "mymsg"
    },
    {
      type: 'form',
      title: '表单',
      data: {
        myrole: '杀手',
        age: '18'
      },
      "initApi": "/api/mock2/form/initData",
      body: [
        {
          type: 'input-text',
          id: "input_data_role",
          label: '角色',
          name: 'myrole',
          disabled: false,
          mode: 'horizontal'
        },
        {
          type: 'input-text',
          label: '年龄',
          name: 'age',
          disabled: false,
          mode: 'horizontal'
        }
      ]
    }
  ]
}
```

**更新 下拉框 选中值**

```schema
{
  type: 'page',
  id: 'mypage',
  data: {
    singleData: 'a',
    multipleData: 'caocao,libai'
  },
  body: [
    {
      type: 'button',
      label: '更新单选数据',
      level: 'primary',
      className: 'mr-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'single-select',
              args: {
                value: '${singleData}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '更新多选数据',
      level: 'primary',
      className: 'mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'multiple-select',
              args: {
                value: '${multipleData}'
              }
            }
          ]
        }
      }
    },
    {
        "label": "选项",
        "type": "select",
        "name": "single-select",
        id: 'single-select',
        "options": [
          {
            "label": "A",
            "value": "a"
          },
          {
            "label": "B",
            "value": "b"
          },
          {
            "label": "C",
            "value": "c"
          }
        ]
      },
    {
        "label": "分组",
        "type": "select",
        "name": "multiple-select",
        id: 'multiple-select',
        "multiple": true,
        "selectMode": "group",
        "options": [
          {
            "label": "法师",
            "children": [
              {
                "label": "诸葛亮",
                "value": "zhugeliang"
              }
            ]
          },
          {
            "label": "战士",
            "children": [
              {
                "label": "曹操",
                "value": "caocao"
              },
              {
                "label": "钟无艳",
                "value": "zhongwuyan"
              }
            ]
          },
          {
            "label": "打野",
            "children": [
              {
                "label": "李白",
                "value": "libai"
              },
              {
                "label": "韩信",
                "value": "hanxin"
              },
              {
                "label": "云中君",
                "value": "yunzhongjun"
              }
            ]
          }
        ]
      }
  ]
}
```

**更新 点选按钮 选中值**

```schema
{
  type: 'page',
  id: 'mypage',
  data: {
    btnData: 'c'
  },
  body: [
    {
      type: 'button',
      label: '更新',
      level: 'primary',
      className: 'mr-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'button-group-select_setvalue',
              args: {
                value: '${btnData}'
              }
            }
          ]
        }
      }
    },
    {
        "type": "button-group-select",
        id: 'button-group-select_setvalue',
        "label": "选项",
        "name": "type",
        "options": [
          {
            "label": "Option A",
            "value": "a"
          },
          {
            "label": "Option B",
            "value": "b"
          },
          {
            "label": "Option C",
            "value": "c"
          }
        ]
      }
  ]
}
```

**更新 输入组合(Combo) 字段值**

```schema
{
  type: 'page',
  id: 'mypage',
  data: {
    objData: {
      name: '路飞',
      role: '海贼王'
    },
    arrayData: [
      {
        name: '苹果',
        count: 10
      },
      {
        name: '黄瓜',
        count: 5
      }
    ]
  },
  body: [
    {
      type: 'button',
      label: '更新对象类型数据',
      level: 'primary',
      className: 'mr-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'userinfo',
              args: {
                value: '${objData}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '更新数组类型数据',
      level: 'primary',
      className: 'mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'shoppingcart',
              args: {
                value: '${arrayData}'
              }
            }
          ]
        }
      }
    },
    {
        "type": "combo",
        "name": "userinfo",
        "id": "userinfo",
        "label": "用户信息",
        "items": [
          {
            "name": "name",
            "label": "姓名",
            "type": "input-text"
          },
          {
            "name": "role",
            "label": "角色",
            "type": "input-text"
          }
        ]
      },
    {
        "type": "combo",
        "name": "shoppingcart",
        "id": "shoppingcart",
        "label": "购物车",
        "multiple": true,
        "items": [
          {
            "name": "name",
            "label": "商品名称",
            "type": "input-text"
          },
          {
            "name": "count",
            "label": "购买数量",
            "type": "input-text"
          }
        ]
      }
  ]
}
```

#### 联动更新

当某组件的值发生变化时，联动去更新另一个组件的数据，可以通过`${事件参数}`来获取事件产生的数据，例如输入框`change`事件的参数是`value: string | string[]`d，则可以通过`${event.data.value}`来获取输入的值。

```schema
{
  type: 'page',
  body: [
    {
      type: 'input-text',
      label: '输入角色',
      mode: 'horizontal',
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'form_data_2',
              args: {
                value: {
                  myrole: '${event.data.value}'
                }
              }
            }
          ]
        }
      }
    },
    {
      type: 'input-text',
      label: '输入年龄',
      mode: 'horizontal',
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'form_data_2',
              args: {
                value: {
                  age: '${event.data.value}'
                }
              }
            }
          ]
        }
      }
    },
    {
      type: 'form',
      id: 'form_data_2',
      title: '表单',
      "initApi": "/api/mock2/form/initData",
      body: [
        {
          type: 'input-text',
          label: '角色',
          name: 'myrole',
          disabled: false,
          mode: 'horizontal'
        },
        {
          type: 'input-text',
          label: '年龄',
          name: 'age',
          disabled: false,
          mode: 'horizontal'
        }
      ]
    },
    {
      type: 'select',
      label: '选择消息',
      name: 'message',
      mode: 'horizontal',
      "options": [
        {
          "label": "Hi",
          "value": "Hi!"
        },
        {
          "label": "Hello",
          "value": "Hello!"
        },
        {
          "label": "Hey",
          "value": "Hey!"
        }
      ],
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'input_data_msg2',
              args: {
                value: '${event.data.value}'
              }
            }
          ]
        }
      }
    },
    {
      type: "input-text",
      label: "消息",
      id: "input_data_msg2",
      mode: 'horizontal',
      name: "mymsg"
    }
  ]
}
```

#### 数据回填

远程请求后、表单提交后，将数据回填给另一个组件。请求返回的数据可以指定存储在`outputVar`变量里，其他动作可以通过`event.data.{{outputVar}}`直接获取该数据。

```schema
{
  type: 'page',
  data: {
    globalData: {
      website: "http://www.baidu.com",
      email: "amis!@baidu.com"
    }
  },
  body: [
    {
      type: 'form',
      id: 'form_data_3',
      title: '表单',
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
                  "dialog": {
                    "title": "登录",
                    "id": "dialog_004",
                    "data": {
                      username: 'amis'
                    },
                    "body": {
                      "type": "form",
                      "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
                      "body": [
                        {
                          "type": "input-text",
                          "name": "username",
                          "required": true,
                          "placeholder": "请输入用户名",
                          "label": "用户名"
                        },
                        {
                          "type": "input-password",
                          "name": "password",
                          "label": "密码",
                          "required": true,
                          "placeholder": "请输入密码"
                        },
                        {
                          "type": "checkbox",
                          "name": "rememberMe",
                          "label": "记住登录"
                        }
                      ]
                    },
                    "actions": [
                      {
                        type: 'button',
                        label: '提交后回填表单',
                        className: 'm',
                        primary: true,
                        onEvent: {
                          click: {
                            actions: [
                              {
                                actionType: 'ajax',
                                args: {
                                  api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData',
                                },
                                outputVar: 'myResult'
                              },
                              {
                                actionType: 'setValue',
                                componentId: 'form_data_3',
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
}
```

**动作属性**

| 属性名                         | 类型     | 默认值     | 说明                         |
| ------------------------------ | -------- | ---------- | ---------------------------- |
| actionType                     | `string` | `setValue` | 变量赋值，即设置组件的数据值 |
| componentId                    | `string` | -          | 指定赋值的目标组件 id        |
| value / args.value`(>=v1.9.0)` | `any`    | -          | 值                           |

### 自定义 JS

通过配置`actionType: 'custom'`实现自定义 JS。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '发送一个 http 请求',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'custom',
              script:
                "doAction({actionType: 'ajax', args: {api: '/api/mock2/form/saveForm'}});\n //event.stopPropagation();"
            }
          ]
        }
      }
    }
  ]
}
```

如果是在 js 中也能直接写函数，这个函数可以接收到 3 个参数，分别是：

- context，上下文信息
- doAction 方法，用于调用其它动作
- event，事件传递的数据，以及可以禁止

**动作属性**

| 属性名     | 类型                | 默认值   | 说明                                                                                                                                            |
| ---------- | ------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| actionType | `string`            | `custom` | 自定义 JS                                                                                                                                       |
| script     | `string`/`function` | -        | 自定义 JS 脚本代码，代码内可以通过调用`doAction`执行任何[动作](../../docs/concepts/event-action#动作) ，通过事件对象`event`可以实现事件动作干预 |

## 触发其他组件的动作

通过配置`componentId`来触发指定组件的动作，组件动作参考通过`args`传入`(>=v1.9.0)`，动作参数请查看对应的组件文档。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '选中选项卡2',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'changeActiveKey',
              componentId: 'tabs-change-receiver',
              args: {
                activeKey: 1
              }
            }
          ]
        }
      }
    },
    {
      id: 'tabs-change-receiver',
      type: 'tabs',
      mode: 'line',
      tabs: [
        {
          title: '选项卡1',
          body: '选项卡内容1'
        },
        {
          title: '选项卡2',
          body: '选项卡内容2'
        },
        {
          title: '选项卡3',
          body: '选项卡内容3'
        }
      ]
    }
  ]
}
```

## 触发广播动作

通过配置`actionType: 'broadcast'`和`eventName`实现触发一个广播，可以通过配置动作执行优先级`weight`来控制所有监听者的动作执行顺序。

```schema
{
  type: 'page',
  body: [
    {
      "name": "role",
      "type": "select",
      "label": "广播一下",
      "mode": "row",
      "options": [
        {
          "label": "海贼王的男人",
          "value": "路飞"
        },
        {
          "label": "海上华佗",
          "value": "乔巴"
        },
        {
          "label": "海上食神",
          "value": "山治"
        }
      ],
      "onEvent": {
        "change": {
          "actions": [
            {
              actionType: 'broadcast',
              eventName: 'broadcast_1',
              args: {
                myrole: '${role}',
                age: 18
              }
            }
          ]
        }
      }
    },
    {
      type: 'form',
      id: 'form_001_form_01',
      title: '表单1（优先级低）',
      name: 'sub-form1',
      body: [
        {
          type: 'input-text',
          label: '昵称',
          name: 'myname',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      onEvent: {
        broadcast_1: {
          actions: [
            {
              actionType: 'reload',
              args: {
                myname: '${event.data.value}', // 从事件数据中取
              }
            },
            {
              "actionType": "toast",
              args: {
                "msgType": "info",
                "msg": "表单1刷新完成"
              }
            }
          ]
        }
      }
    },
    {
      type: 'form',
      name: 'form2',
      id: 'form_002',
      title: '表单2（优先级中）',
      body: [
        {
          type: 'input-text',
          label: '角色',
          name: 'myrole',
          disabled: false,
          mode: 'horizontal'
        },
        {
          type: 'input-text',
          label: '年龄',
          name: 'age',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      onEvent: {
        broadcast_1: {
          weight: 2,
          actions: [
            {
              actionType: 'reload',
              args: {
                myrole: '${event.data.value}',
                age: '${event.data.age}'
              }
            },
            {
              "actionType": "toast",
              args: {
                "msgType": "info",
                "msg": "表单2刷新完成"
              }
            }
          ]
        }
      }
    },
    {
      type: 'form',
      name: 'form3',
      id: 'form_003',
      title: '表单3（优先级高）',
      body: [
        {
          type: 'input-text',
          id: 'form_003_text_01',
          label: '职业',
          name: 'job',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      api: 'https://api/form/form3',
      onEvent: {
        broadcast_1: {
          weight: 3,
          actions: [
            {
              actionType: 'reload',
              args: {
                job: '${event.data.value}'
              }
            },
            {
              "actionType": "toast",
              args: {
                "msgType": "info",
                "msg": "表单3刷新完成"
              }
            }
          ]
        }
      }
    }
  ]
}
```

**动作属性**

| 属性名     | 类型     | 默认值      | 说明                                             |
| ---------- | -------- | ----------- | ------------------------------------------------ |
| actionType | `string` | `broadcast` | 广播动作                                         |
| eventName  | `string` | -           | 广播动作对应的自定义事件名称，用于广播事件的监听 |

## 自定义动作

补充中...

# 编排动作

通过配置`actionType: 'for'`或`actionType: 'break'`或`actionType: 'continue'`或`actionType: 'switch'`或`actionType: 'parallel'`实现动作的逻辑编排，支持嵌套。

## 条件

```schema
{
  type: 'page',
  body: {
    type: 'form',
    wrapWithPanel: false,
    data: {
      expression: 'okk'
    },
    body: [
      {
        type: 'button',
        label: '符合条件的执行',
        level: 'primary',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'toast',
                args: {
                  msgType: 'success',
                  msg: '我okk~'
                },
                expression: 'expression === "okk"'
              },
              {
                actionType: 'toast',
                args: {
                  msg: '1'
                },
                expression: 'expression === "nono"'
              },
              {
                actionType: 'toast',
                args: {
                  msgType: 'success',
                  msg: '我也okk~'
                },
                expression: 'expression === "okk"'
              }
            ]
          }
        }
      }
    ]
  }
}
```

**动作属性**

| 属性名     | 类型                             | 默认值 | 说明                         |
| ---------- | -------------------------------- | ------ | ---------------------------- |
| actionType | `string`                         | `for`  | 循环执行动作                 |
| expression | [表达式](../concepts/expression) | -      | 执行条件，不设置表示默认执行 |

## 循环

**单层循环**

```schema
{
  type: 'page',
  body: {
    type: 'form',
    wrapWithPanel: false,
    data: {
      loopName: 'loopData',
      loopData: [
        {
          name: 'lv',
          age: '19'
        },
        {
          name: 'xj',
          age: '21'
        }
      ]
    },
    body: [
      {
        type: 'button',
        label: '循环发送两次请求，且每次携带了循环的数据',
        level: 'primary',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'loop',
                args: {
                  level: 3,
                  loopName: '${loopName}'
                },
                children: [
                  {
                    actionType: 'ajax',
                    args: {
                      api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?name=${name}&age=${age}'
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}
```

**嵌套循环**

```schema
{
  type: 'page',
  body: {
    type: 'form',
    wrapWithPanel: false,
    data: {
      loopName: 'loopData',
      loopData: [
        {
          name: 'lv',
          age: '19'
        },
        {
          name: 'xj',
          age: '21'
        }
      ]
    },
    body: [
      {
        type: 'button',
        label: '循环',
        className: 'm-2',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'loop',
                preventDefault: false,
                stopPropagation: false,
                args: {
                  loopName: '${loopName}',
                  level: 3
                },
                children: [
                  {
                    actionType: 'toast',
                    args: {
                      msg: '第1层循环动作1${name}'
                    },
                    preventDefault: false,
                    stopPropagation: false
                  },
                  {
                    actionType: 'toast',
                    args: {
                      msg: '第1层循环动作2${name}'
                    }
                  },
                  {
                    actionType: 'loop',
                    args: {
                      loopName: '${loopName}',
                      level: 3
                    },
                    children: [
                      {
                        actionType: 'toast',
                        args: {
                          msg: '第2层循环动作1${name}'
                        }
                      },
                      {
                        actionType: 'toast',
                        args: {
                          msg: '第2层循环动作2${name}'
                        },
                        preventDefault: false,
                        stopPropagation: false
                      },
                      {
                        actionType: 'continue'
                      },
                      {
                        actionType: 'toast',
                        args: {
                          msg: '第2层循环动作3${name}'
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}
```

**动作属性**

| 属性名                               | 类型                                                 | 默认值 | 说明                                  |
| ------------------------------------ | ---------------------------------------------------- | ------ | ------------------------------------- |
| actionType                           | `string`                                             | `for`  | 循环执行动作                          |
| loopName / args.loopName`(>=v1.9.0)` | `string`                                             | -      | 循环变量名称                          |
| children                             | Array<[动作](../../docs/concepts/event-action#动作)> | -      | 子动作，可以通过`break动作`来跳出循环 |

## Break 动作

```schema
{
  type: 'page',
  body: {
    type: 'form',
    wrapWithPanel: false,
    data: {
      loopName: 'loopData',
      loopData: [
        {
          name: 'lv',
          age: '19'
        },
        {
          name: 'xj',
          age: '21'
        }
      ]
    },
    body: [
      {
        type: 'button',
        label: '只执行了第一个动作就跳出了循环',
        level: 'primary',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'loop',
                args: {
                  loopName: '${loopName}'
                },
                children: [
                  {
                    actionType: "toast",
                    args: {
                      msgType: 'success',
                      msg: '第 1 个动作',
                      position: 'top-right'
                    }
                  },
                  {
                    actionType: 'break'
                  },
                  {
                    actionType: "toast",
                    args: {
                      msgType: 'success',
                      msg: '第 2 个动作',
                      position: 'top-right'
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}
```

**动作属性**

| 属性名     | 类型     | 默认值  | 说明         |
| ---------- | -------- | ------- | ------------ |
| actionType | `string` | `break` | 跳出循环动作 |

## Continue 动作

```schema
{
  type: 'page',
  body: {
    type: 'form',
    wrapWithPanel: false,
    data: {
      loopName: 'loopData',
      loopData: [
        {
          name: 'lv',
          age: '19'
        },
        {
          name: 'xj',
          age: '21'
        }
      ]
    },
    body: [
      {
        type: 'button',
        label: '只循环执行第一个动作',
        level: 'primary',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'loop',
                args: {
                  loopName: '${loopName}',
                  level: 3
                },
                children: [
                  {
                    actionType: "toast",
                    args: {
                      msgType: 'success',
                      msg: '第 1 个动作',
                      position: 'top-right'
                    }
                  },
                  {
                    actionType: 'continue'
                  },
                  {
                    actionType: "toast",
                    args: {
                      msgType: 'success',
                      msg: '最后的动作',
                      position: 'top-right'
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}
```

**动作属性**

| 属性名     | 类型     | 默认值     | 说明     |
| ---------- | -------- | ---------- | -------- |
| actionType | `string` | `continue` | 跳出当前 |

## 排他（switch）

```schema
{
  type: 'page',
  body: {
    type: 'form',
    wrapWithPanel: false,
    data: {
      branchCont: 18
    },
    body: [
      {
        type: 'button',
        label: '只执行动作2',
        level: 'primary',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'switch',
                children: [
                  {
                    actionType: "toast",
                    args: {
                      msgType: 'info',
                      msg: '动作1',
                      position: 'top-right'
                    },
                    expression: 'this.branchCont > 19',
                    stopPropagation: true // 这里无效，因为条件不成立
                  },
                  {
                    actionType: "toast",
                    args: {
                      msgType: 'info',
                      msg: '动作2',
                      position: 'top-right'
                    },
                    expression: 'this.branchCont > 17'
                  },
                  {
                    actionType: "toast",
                    args: {
                      msgType: 'info',
                      msg: '动作3',
                      position: 'top-right'
                    },
                    expression: 'this.branchCont > 16'
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}
```

**动作属性**

| 属性名     | 类型                                                 | 默认值   | 说明                                                   |
| ---------- | ---------------------------------------------------- | -------- | ------------------------------------------------------ |
| actionType | `string`                                             | `switch` | 只执行第一个符合条件的动作                             |
| children   | Array<[动作](../../docs/concepts/event-action#动作)> | -        | 子动作，每个子动作可以通过配置`expression`来匹配的条件 |

## 并行

```schema
{
  type: 'page',
  body: {
    type: 'form',
    wrapWithPanel: false,
    body: [
      {
        type: 'button',
        label: '同时执行动作1、2',
        level: 'primary',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'parallel',
                children: [
                  {
                    actionType: "alert",
                    args: {
                      msg: '动作1'
                    }
                  },
                  {
                    actionType: "toast",
                    args: {
                      msgType: 'success',
                      msg: '动作2',
                      position: 'top-right'
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}
```

**动作属性**

| 属性名     | 类型                                                 | 默认值     | 说明                                       |
| ---------- | ---------------------------------------------------- | ---------- | ------------------------------------------ |
| actionType | `string`                                             | `parallel` | 点击后显示一个弹出框                       |
| children   | Array<[动作](../../docs/concepts/event-action#动作)> | -          | 指定弹框内容，格式可参考[Dialog](./dialog) |

# 动作间数据传递

从事件触发开始，整个数据流包含事件本身产生的事件数据和动作产生的动作数据，事件源头产生的数据在 AMIS 事件动作机制底层已经自动加入渲染器数据域，可以通过`event.data.xxx`直接获取，而部分动作产生的数据如何流动需要交互设计者进行介入，对于数据流动可以通过数据映射，将上一个动作产生的数据作为动作参数写入下一个动作。

**传递数据**

通过 `args` 指定输入的参数数据，它是一个键值对。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      id: 'b_001',
      label: '发一个广播，携带动作参数',
      className: 'mb-2',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'broadcast',
              eventName: 'broadcast_1',
              args: {
                name: 'lvxj',
                age: 18
              },
              description: '一个按钮的点击事件'
            }
          ]
        }
      }
    },
    {
      type: 'form',
      name: 'form1',
      id: 'form_001',
      title: '接收广播事件的参数',
      debug: true,
      body: [
        {
          type: 'input-text',
          id: 'form_001_text_01',
          label: '年龄',
          name: 'age',
          disabled: false,
          mode: 'horizontal'
        }
      ],
      data: {
        name: 'amis'
      },
      onEvent: {
        broadcast_1: {
          actions: [
            {
              actionType: 'reload',
              args: {
                age: '${event.data.age}'
              }
            }
          ]
        }
      }
    }
  ]
}
```

**存储异步请求返回的数据**

通过 `outputVar` 指定输出的变量名，其他动作可以通过`${event.data.{{outputVar}}}`来获取变量值，如果未指定 `outputVar` ，则直接存储到`event.data`。

```schema
{
  type: 'page',
  body: [
    {
      type: 'button',
      label: '发送Ajax请求，并把返回数据传给弹窗',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'ajax',
              args: {
                api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm',
                messages: {
                  success: '成功了！欧耶',
                  failed: '失败了呢。。'
                }
              },
              outputVar: 'ajax1'
            },
            {
              actionType: 'dialog',
              args: {
                id: '${event.data.ajax1.id}'
              },
              dialog: {
                type: 'dialog',
                id: 'dialog_005',
                title: '弹框标题1',
                data: {
                  id: '${id}'
                },
                body: [
                  {
                    type: 'form',
                    body: [
                      {
                        type: 'tpl',
                        tpl: '<p>请求返回的数据：id=${id}</p>',
                        inline: false
                      }
                    ]
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
```

# 事件动作干预

事件动作干预是指执行完当前动作后，干预所监听事件默认处理逻辑和后续其他动作的执行。通过`preventDefault`、`stopPropagation`分别阻止监听事件默认行为和停止下一个动作执行。

**阻止事件默认行为**

```schema
{
  "type": "page",
  "title": "事件/动作干预",
  "regions": [
    "body",
    "toolbar",
    "header"
  ],
  "body": [
    {
      "type": "button",
      "label": "阻止弹窗",
      level: 'primary',
      "actionType": "dialog",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "toast",
              args: {
                "msgType": 'info',
                "msg": '动作1',
                "preventDefault": true
              }
            }
          ]
        }
      }
    }
  ]
}
```

**停止后续动作执行**

```schema
{
  "type": "page",
  "title": "事件/动作干预",
  "regions": [
    "body",
    "toolbar",
    "header"
  ],
  "body": [
    {
      "type": "button",
      "label": "停止执行动作3",
      level: 'primary',
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "toast",
              args: {
                "msgType": 'info',
                "msg": '动作1'
              }
            },
            {
              "actionType": "toast",
              args: {
                "msgType": 'info',
                "msg": '动作2'
              },
              "stopPropagation": true
            },
            {
              "actionType": "toast",
              args: {
                "msgType": 'info',
                "msg": '动作3'
              }
            }
          ]
        }
      }
    }
  ]
}
```

# 典型场景

补充中...

# 属性表

| 属性名          | 类型                             | 默认值 | 说明                                |
| --------------- | -------------------------------- | ------ | ----------------------------------- |
| actionType      | `string`                         | -      | 动作名称                            |
| args            | `object`                         | -      | 动作参数`{key:value}`，支持数据映射 |
| preventDefault  | `boolean`                        | false  | 阻止事件默认行为                    |
| stopPropagation | `boolean`                        | false  | 停止后续动作执行                    |
| expression      | [表达式](../concepts/expression) | -      | 执行条件，不设置表示默认执行        |
| outputVar       | `string`                         | -      | 输出数据变量名                      |

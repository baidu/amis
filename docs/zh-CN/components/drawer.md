---
title: Drawer 抽屉
description:
type: 0
group: ⚙ 组件
menuName: Drawer 抽屉
icon:
order: 43
---

## 基本用法

```schema: scope="body"
{
    "label": "弹出",
    "type": "button",
    "actionType": "drawer",
    "drawer": {
        "title": "抽屉标题",
        "body": "这是一个抽屉"
    }
}
```

## 多级弹框

可以嵌套使用。

```schema: scope="body"
{
    "type": "button",
    "label": "多级抽屉",
    "actionType": "drawer",
    "drawer": {
        "title": "提示",
        "body": "这是个简单的抽屉",
        "actions": [
            {
                "type": "button",
                "actionType": "confirm",
                "label": "确认",
                "primary": true
            },
            {
                "type": "button",
                "actionType": "drawer",
                "label": "再弹一个",
                "drawer": {
                    "title": "抽屉中的抽屉",
                    "body": "如果你想，可以继续弹下去",
                    "actions": [
                        {
                            "type": "button",
                            "actionType": "drawer",
                            "label": "来吧",
                            "level": "info",
                            "drawer": {
                                "title": "抽屉中的抽屉",
                                "body": "如果你想，可以无限弹下去",
                                "actions": [
                                    {
                                        "type": "button",
                                        "actionType": "confirm",
                                        "label": "不弹了",
                                        "primary": true
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

## 指定弹出方向

通过配置 `position`，可以指定抽屉弹出的方向，可选 `left`、`right`、`top` 和 `bottom`。默认为 `right`。

```schema: scope="body"
{
    "type": "button-toolbar",
    "buttons": [
        {
            "type": "button",
            "label": "左侧弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "left",
                "title": "提示",
                "body": "这是一个从左侧弹出的抽屉"
            }
        },
        {
            "type": "button",
            "label": "右侧弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "title": "提示",
                "body": "这是一个从右侧弹出的抽屉"
            }
        },
        {
            "type": "button",
            "label": "顶部弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "top",
                "title": "提示",
                "body": "这是一个从顶部弹出的抽屉"
            }
        },
        {
            "type": "button",
            "label": "底部弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "bottom",
                "title": "提示",
                "body": "这是一个从底部弹出的抽屉"
            }
        }
    ]
}
```

## 抽屉尺寸

通过设置 `size` 来控制抽屉的大小，可选值：`xs`、`sm`、`md`、`lg` 和 `xl`。

```schema: scope="body"
{
    "type": "button-toolbar",
    "buttons": [
        {
            "type": "button",
            "label": "极小框",
            "actionType": "drawer",
            "drawer": {
                "size": "xs",
                "title": "提示",
                "body": "这是一个极小的抽屉"
            }
        },
        {
            "type": "button",
            "label": "小框",
            "actionType": "drawer",
            "drawer": {
                "size": "sm",
                "title": "提示",
                "body": "这是一个小抽屉"
            }
        },
        {
            "type": "button",
            "label": "中框",
            "actionType": "drawer",
            "drawer": {
                "size": "md",
                "title": "提示",
                "body": "这是一个标准的抽屉"
            }
        },
        {
            "type": "button",
            "label": "大框",
            "actionType": "drawer",
            "drawer": {
                "size": "lg",
                "title": "提示",
                "body": "这是一个大抽屉"
            }
        },
        {
            "type": "button",
            "label": "超大框",
            "actionType": "drawer",
            "drawer": {
                "size": "xl",
                "title": "提示",
                "body": "这是一个超大的抽屉"
            }
        },
    ]
}
```

## 自定义抽屉尺寸

通过设置 `width`（`position` 为 `left` 或 `right` 时生效）和 `height`（`position` 为 `top` 或 `bottom` 时生效）来控制抽屉的尺寸。

值如果是数字类型，单位默认使用 `px`, 如果是字符串类型，可以使用自定义 css 宽度变量，如：`%`、`vw`、`px` 等。

```schema: scope="body"
{
    "type": "button-toolbar",
    "buttons": [
        {
            "type": "button",
            "label": "自定义宽度",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "width": 300,
                "title": "提示",
                "body": "这是一个自定义 300px 宽度的抽屉"
            }
        },
        {
            "type": "button",
            "label": "自定义高度",
            "actionType": "drawer",
            "drawer": {
                "position": "bottom",
                "height": 300,
                "title": "提示",
                "body": "这是一个自定义 300px 高度的抽屉"
            }
        }
    ]
}
```

## 可拖拽抽屉大小

配置 `"resizable": true`，可以拖拽调整 `drawer` 大小。

```schema: scope="body"
{
    "type": "button",
    "label": "可拖拽调整大小",
    "actionType": "drawer",
    "drawer": {
        "resizable": true,
        "title": "提示",
        "body": "这是一个可拖拽的抽屉"
    }
}
```

## 是否展示关闭按钮

配置 `"showCloseButton": false`，可以隐藏关闭按钮。

```schema: scope="body"
{
    "type": "button",
    "label": "无关闭按钮",
    "actionType": "drawer",
    "drawer": {
        "title": "提示",
        "body": "这是一个没有关闭按钮的抽屉",
        "showCloseButton": false
    }
}
```

## 蒙层显示

通过配置 `overlay`，来控制是否显示蒙层。默认为 `true`。

```schema: scope="body"
{
    "type": "button-toolbar",
    "buttons": [
        {
            "type": "button",
            "label": "默认",
            "actionType": "drawer",
            "drawer": {
                "overlay": true,
                "title": "提示",
                "body": "这是一个有蒙层的抽屉"
            }
        },
        {
            "type": "button",
            "label": "不显示",
            "actionType": "drawer",
            "drawer": {
                "overlay": false,
                "title": "提示",
                "body": "这是一个没有蒙层的抽屉"
            }
        }
    ]
}
```

## 关闭方式

通过配置 `closeOnOutside`，即可在点击抽屉外部时，直接关闭抽屉。

同时可以配置 `closeOnEsc`，让抽屉支持 <kbd>Esc</kbd> 键关闭。

```schema: scope="body"
{
    "type": "button-toolbar",
    "buttons": [
        {
            "type": "button",
            "label": "点击抽屉外自动关闭（有蒙层）",
            "actionType": "drawer",
            "drawer": {
                "closeOnOutside": true,
                "title": "提示",
                "body": "这是一个简单的抽屉"
            }
        },
        {
            "type": "button",
            "label": "点击抽屉外自动关闭（无蒙层）",
            "actionType": "drawer",
            "drawer": {
                "overlay": false,
                "closeOnOutside": true,
                "title": "提示",
                "body": "这是一个简单的抽屉"
            }
        },
        {
            "type": "button",
            "label": "按键关闭",
            "actionType": "drawer",
            "drawer": {
                "closeOnEsc": true,
                "title": "提示",
                "body": "试试按下 Esc"
            }
        }
    ]
}
```

## 动作后关闭抽屉

在抽屉中配置行为按钮，可以在按钮上配置 `"close": true`，在行为完成后，关闭当前抽屉。

```schema: scope="body"
{
    "type": "button",
    "label": "打开",
    "actionType": "drawer",
    "drawer": {
        "title": "提示",
        "body": [
            {
                "type": "button-toolbar",
                "buttons": [
                    {
                        "type": "button",
                        "label": "默认的 ajax 请求",
                        "actionType": "ajax",
                        "api": "/api/mock2/form/saveForm?waitSeconds=1"
                    },
                    {
                        "type": "button",
                        "label": "ajax 请求成功后关闭抽屉",
                        "actionType": "ajax",
                        "api": "/api/mock2/form/saveForm?waitSeconds=1",
                        "close": true
                    }
                ]
            }
        ]
    }
}
```

以上例子是关闭当前抽屉，如果希望关闭上层抽屉，则需要给目标抽屉设置 `name` 属性，然后配置按钮 `close` 属性为目标 `name` 属性如：

```schema: scope="body"
{
    "type": "button",
    "label": "多级抽屉",
    "actionType": "drawer",
    "drawer": {
        "title": "提示",
        "body": "这是个简单的抽屉",
        "name": "drawer_1",
        "actions": [
            {
                "type": "button",
                "actionType": "confirm",
                "label": "确认",
                "primary": true
            },
            {
                "type": "button",
                "actionType": "drawer",
                "label": "再弹一个",
                "drawer": {
                    "title": "抽屉中的抽屉",
                    "body": "关闭当前抽屉时，将外层抽屉一并关闭",
                    "actions": [
                        {
                            "type": "button",
                            "label": "关闭所有",
                            "level": "info",
                            "close": "drawer_1"
                        }
                    ]
                }
            }
        ]
    }
}
```

> 3.3.0 及以上版本

如果是表单，可以在表单上配置 `close: false`。

```schema: scope="body"
{
    "type": "button",
    "label": "弹个框",
    "actionType": "drawer",
    "drawer": {
        "type": "form",
        "api": "/api/mock2/form/saveForm",
        "body": [
            {
                "type": "input-text",
                "name": "name",
                "label": "姓名"
            }
        ],
        "close": false
    }
}
```

## 配置抽屉的按钮

默认抽屉会自动生成两个按钮，一个取消，一个确认。如果通过 `actions` 来自定义配置，则以配置的为准。

```schema: scope="body"
{
    "type": "button-toolbar",
    "buttons": [
        {
            "type": "button",
            "label": "无按钮",
            "actionType": "drawer",
            "drawer": {
                "title": "提示",
                "body": "这是一个没有按钮的抽屉",
                "actions": []
            }
        },
        {
            "type": "button",
            "label": "一个按钮",
            "actionType": "drawer",
            "drawer": {
                "title": "提示",
                "body": "只有一个 OK 的抽屉",
                "actions": [
                    {
                        "type": "button",
                        "actionType": "confirm",
                        "label": "OK",
                        "primary": true
                    }
                ]
            }
        }
    ]
}
```

## 属性表

| 属性名          | 类型                                      | 默认值             | 说明                                                                                              |
| --------------- | ----------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------- |
| type            | `string`                                  |                    | `"drawer"` 指定为 Drawer 渲染器                                                                   |
| title           | [SchemaNode](../../docs/types/schemanode) |                    | 弹出层标题                                                                                        |
| body            | [SchemaNode](../../docs/types/schemanode) |                    | 往 Drawer 内容区加内容                                                                            |
| size            | `string`                                  |                    | 指定 Drawer 大小，支持: `xs`、`sm`、`md`、`lg`、`xl`                                              |
| position        | `string`                                  | `right`            | 指定 Drawer 方向，支持: `left`、`right`、`top`、`bottom`                                          |
| className       | `string`                                  |                    | Drawer 最外层容器的样式类名                                                                       |
| headerClassName | `string`                                  |                    | Drawer 头部 区域的样式类名                                                                        |
| bodyClassName   | `string`                                  | `modal-body`       | Drawer body 区域的样式类名                                                                        |
| footerClassName | `string`                                  |                    | Drawer 页脚 区域的样式类名                                                                        |
| showCloseButton | `boolean`                                 | `true`             | 是否展示关闭按钮，当值为 `false` 时，默认开启 closeOnOutside                                      |
| closeOnEsc      | `boolean`                                 | `false`            | 是否支持按 <kbd>Esc</kbd> 关闭 Drawer                                                             |
| closeOnOutside  | `boolean`                                 | `false`            | 点击内容区外是否关闭 Drawer                                                                       |
| overlay         | `boolean`                                 | `true`             | 是否显示蒙层                                                                                      |
| resizable       | `boolean`                                 | `false`            | 是否可通过拖拽改变 Drawer 大小                                                                    |
| width           | `string \| number`                        | `500px`            | 容器的宽度，在 `position` 为 `left` 或 `right` 时生效                                             |
| height          | `string \| number`                        | `500px`            | 容器的高度，在 `position` 为 `top` 或 `bottom` 时生效                                             |
| actions         | Array<[Action](./action)>                 | 【确认】和【取消】 | 可以不设置，默认只有两个按钮。                                                                    |
| data            | `object`                                  |                    | 支持 [数据映射](../../docs/concepts/data-mapping)，如果不设定将默认将触发按钮的上下文中继承数据。 |

## 事件表

当前组件会对外派发以下事件，可以通过 `onEvent` 来监听这些事件，并通过 `actions` 来配置执行的动作，在 `actions` 中可以通过 `${事件参数名}` 或 `${event.data.[事件参数名]}` 来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                                                                 | 说明               |
| -------- | ------------------------------------------------------------------------ | ------------------ |
| confirm  | `event.data: object` 抽屉数据<br/>`[name]: any` 当前数据域中指定字段的值 | 点击确认提交时触发 |
| cancel   | `event.data: object` 抽屉数据<br/>`[name]: any` 当前数据域中指定字段的值 | 点击取消时触发     |

### confirm

```schema: scope="body"
[
  {
    "label": "打开",
    "type": "button",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "drawer",
            "drawer": {
              "title": "标题",
              "body": "这是一个抽屉",
              "onEvent": {
                "confirm": {
                  "actions": [
                    {
                      "actionType": "toast",
                      "args": {
                        "msg": "confirm"
                      }
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
```

### cancel

```schema: scope="body"
[
  {
    "label": "打开",
    "type": "button",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "drawer",
            "drawer": {
              "title": "标题",
              "body": "这是一个抽屉",
              "onEvent": {
                "cancel": {
                  "actions": [
                    {
                      "actionType": "toast",
                      "args": {
                        "msg": "cancel"
                      }
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
```

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定 `actionType: 动作名称`、`componentId: 该组件id` 来触发这些动作，动作配置可以通过 `args: {动作配置项名称: xxx}` 来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                   | 说明         |
| -------- | -------------------------- | ------------ |
| confirm  | -                          | 确认（提交） |
| cancel   | -                          | 取消（关闭） |
| setValue | `value: object` 更新的数据 | 更新数据     |

### confirm 动作

```schema: scope="body"
{
  "type": "button",
  "label": "弹个表单",
  "actionType": "drawer",
  "drawer": {
    "title": "在抽屉中的表单",
    "id": "drawer_confirm",
    "body": {
      "type": "form",
      "api": "/api/mock2/form/saveForm?waitSeconds=2",
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
        "type": "button",
        "label": "触发确认",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "confirm",
                "componentId": "drawer_confirm"
              }
            ]
          }
        }
      }
    ]
  }
}
```

### cancel 动作

```schema: scope="body"
{
  "type": "button",
  "label": "弹个表单",
  "actionType": "drawer",
  "drawer": {
    "title": "在抽屉中的表单",
    "id": "drawer_cancel",
    "body": {
      "type": "form",
      "api": "/api/mock2/form/saveForm?waitSeconds=2",
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
        "type": "button",
        "label": "触发取消",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "cancel",
                "componentId": "drawer_cancel"
              }
            ]
          }
        }
      }
    ]
  }
}
```

### setValue 动作

通过 `setValue` 更新指定抽屉的数据。

#### 合并数据

默认 `setValue` 会将新数据与目标组件数据进行合并。

```schema: scope="body"
{
  "type": "button",
  "label": "弹个表单",
  "actionType": "drawer",
  "drawer": {
    "title": "在抽屉中的表单",
    "id": "drawer_setvalue",
    "data": {
      "username": "amis",
      "password": "amis@baidu.com"
    },
    "body": [
      {
        "type": "alert",
        "body": "初始化时，抽屉的数据 data 为 {username: 'amis', password: 'fex'}，表单内或者表单外都可以读取这些数据，当点击【更新抽屉数据】按钮后，抽屉的数据被更新为 {username: 'aisuda', password: 'aisuda@baidu.com'}"
      },
      {
        "type": "input-text",
        "label": "表单外的密码",
        "name": "password"
      },
      {
        "type": "form",
        "debug": true,
        "api": "/api/mock2/form/saveForm?waitSeconds=2",
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
            }
        ]
      }
    ],
    "actions": [
      {
        "type": "button",
        "label": "更新抽屉数据",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "setValue",
                "componentId": "drawer_setvalue",
                "args": {
                  "value": {
                    "username": "aisuda",
                    "password": "aisuda@baidu.com"
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
```

#### 覆盖数据

可以通过 `"dataMergeMode": "override"` 来覆盖目标组件数据。

```schema: scope="body"
{
  "type": "button",
  "label": "弹个表单",
  "actionType": "drawer",
  "drawer": {
    "title": "在抽屉中的表单",
    "id": "drawer_setvalue2",
    "data": {
      "username": "amis",
      "password": "amis@baidu.com"
    },
    "body": [
      {
        "type": "alert",
        "body": "初始化时，抽屉的数据 data 为 {username: 'amis', password: 'fex'}，表单内或者表单外都可以读取这些数据，当点击【更新抽屉数据】按钮后，抽屉的数据被更新为 {username: 'aisuda'}，即 password 将被删除"
      },
      {
        "type": "input-text",
        "label": "表单外的密码",
        "name": "password"
      },
      {
        "type": "form",
        "debug": true,
        "api": "/api/mock2/form/saveForm?waitSeconds=2",
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
          }
        ]
      }
    ],
    "actions": [
      {
        "type": "button",
        "label": "更新抽屉数据",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "setValue",
                "componentId": "drawer_setvalue2",
                "args": {
                  "value": {
                    "username": "aisuda"
                  }
                },
                "dataMergeMode": "override"
              }
            ]
          }
        }
      }
    ]
  }
}
```

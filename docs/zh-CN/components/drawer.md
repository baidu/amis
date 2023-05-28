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
      "body": {
            "label": "第二层",
            "type": "button",
            "actionType": "drawer",
            "drawer": {
                "title": "抽屉标题",
                "body": {
                    "label": "第三层",
                    "type": "button",
                    "actionType": "drawer",
                    "drawer": {
                        "title": "抽屉标题",
                        "body": "这是第三层抽屉"
                    }
                }
            }
      }
    }
}
```

## 抽屉尺寸

```schema: scope="body"
{
    "type": "button-toolbar",
    "className": "block m-t",
    "buttons": [
        {
            "type": "button",
            "label": "极小框",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "size": "xs",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "小框",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "size": "sm",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "中框",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "size": "md",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "大框",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "size": "lg",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "超大框",
            "actionType": "drawer",
            "drawer": {
                "size": "xl",
                "position": "right",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
    ]
}
```

## 自定义抽屉尺寸

值如果是数字类型单位默认使用`px`, 如果是字符串类型可以使用自定义 css 宽度变量，如：`%`、`vw`、`px`等

```schema: scope="body"
{
    "type": "button-toolbar",
    "className": "block m-t",
    "buttons": [
        {
            "type": "button",
            "label": "自定义宽度",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "width": 300,
                "title": "提示",
                "body": "这是个自定义300px宽度的弹框"
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
                "body": "这是个自定义300px高度的弹框"
            }
        },
    ]
}
```

## 指定弹出方向

```schema: scope="body"
{
    "type": "button-toolbar",
    "className": "block m-t",
    "buttons": [
        {
            "type": "button",
            "label": "左侧弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "left",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "右侧弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "顶部弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "top",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "底部弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "bottom",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        }
    ]
}
```

## 可拖拽抽屉大小

配置`"resizable": true`，可以拖拽调整`drawer`大小

```schema: scope="body"
{
    "type": "button",
    "label": "可拖拽调整大小",
    "actionType": "drawer",
    "drawer": {
        "position": "right",
        "resizable": true,
        "title": "提示",
        "body": "这是个简单的弹框"
    }
}
```

## 是否展示关闭按钮

配置`"showCloseButton": false`，可以隐藏关闭按钮

```schema: scope="body"
{
    "type": "button",
    "label": "无关闭按钮",
    "actionType": "drawer",
    "drawer": {
        "position": "right",
        "title": "提示",
        "body": "这是个简单的弹框",
        "showCloseButton": false
    }
}
```

## 不显示蒙层

```schema: scope="body"
{
    "type": "button",
    "label": "不显示蒙层",
    "actionType": "drawer",
    "drawer": {
        "position": "right",
        "overlay": false,
        "title": "提示",
        "body": "这是个简单的弹框"
    }
}
```

## 点击抽屉外自动关闭

配置`"closeOnOutside":true`

### 显示蒙层

```schema: scope="body"
{
    "type": "button",
    "label": "点击抽屉外自动关闭",
    "actionType": "drawer",
    "drawer": {
        "position": "right",
        "closeOnOutside": true,
        "title": "提示",
        "body": "这是个简单的弹框"
    }
}
```

### 不显示蒙层

```schema: scope="body"
{
    "type": "button",
    "label": "点击抽屉外自动关闭",
    "actionType": "drawer",
    "drawer": {
        "position": "right",
        "overlay": false,
        "closeOnOutside": true,
        "title": "提示",
        "body": "这是个简单的弹框"
    }
}
```

## 多级弹框

```schema: scope="body"
{
    "type": "button",
    "label": "多级弹框",
    "actionType": "drawer",
    "drawer": {
        "title": "提示",
        "body": "这是个简单的弹框",
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
                    "title": "弹框中的弹框",
                    "body": "如果你想，可以无限弹下去",
                    "actions": [
                        {
                            "type": "button",
                            "actionType": "drawer",
                            "label": "来吧",
                            "level": "info",
                            "drawer": {
                                "title": "弹框中的弹框",
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

## 动作后关闭弹框

在弹框中配置行为按钮，可以在按钮上配置`"close": true`，在行为完成后，关闭当前弹框。

```schema: scope="body"
{
    "type": "button",
    "label": "弹个框",
    "actionType": "drawer",
    "drawer": {
        "title": "弹框",
        "body": [
          {
            "type": "button",
            "label": "默认的 ajax 请求",
            "actionType": "ajax",
            "api": "/api/mock2/form/saveForm?waitSeconds=1"
          },
          {
            "type": "button",
            "label": "ajax 请求成功后关闭弹框",
            "actionType": "ajax",
            "api": "/api/mock2/form/saveForm?waitSeconds=1",
            "close": true
          }
        ]
    }
}
```

以上例子是关闭当前弹窗，如果希望关闭上层弹窗，则需要给目标弹窗设置 `name` 属性，然后配置按钮 `close` 属性为目标 `name` 属性如：

```schema: scope="body"
{
    "type": "button",
    "label": "多级弹框",
    "actionType": "drawer",
    "drawer": {
        "title": "提示",
        "body": "这是个简单的弹框",
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
                    "title": "弹框中的弹框",
                    "body": "关闭当前弹窗的时候把外层的弹窗一起关了",
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

## 配置弹窗的按钮

默认弹窗会自动生成两个按钮，一个取消，一个确认。如果通过 `actions` 来自定义配置，则以配置的为准。

```schema: scope="body"
{
    "type": "button-toolbar",
    "buttons": [
        {
            "type": "button",
            "label": "无按钮",
            "actionType": "dialog",
            "dialog": {
                "title": "提示",
                "actions": [],
                "body": "无按钮的弹框"
            }
        },
        {
            "type": "button",
            "label": "只有一个确认按钮",
            "actionType": "dialog",
            "dialog": {
                "title": "提示",
                "actions": [{
                  "type": "button",
                  "actionType": "confirm",
                  "label": "OK",
                  "primary": true
                }],
                "body": "只有一个 OK 的弹框"
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
| position        | `string`                                  |                    | 指定 Drawer 方向，支持: `left`、`right`、`top`、`bottom`                                          |
| className       | `string`                                  | ``                 | Drawer 最外层容器的样式类名                                                                       |
| headerClassName | `string`                                  |                    | Drawer 头部 区域的样式类名                                                                        |
| bodyClassName   | `string`                                  | `modal-body`       | Drawer body 区域的样式类名                                                                        |
| footerClassName | `string`                                  |                    | Drawer 页脚 区域的样式类名                                                                        |
| showCloseButton | `boolean`                                 | `true`             | 是否展示关闭按钮，当值为 false 时，默认开启 closeOnOutside                                        |
| closeOnEsc      | `boolean`                                 | `false`            | 是否支持按 `Esc` 关闭 Drawer                                                                      |
| closeOnOutside  | `boolean`                                 | `false`            | 点击内容区外是否关闭 Drawer                                                                       |
| overlay         | `boolean`                                 | `true`             | 是否显示蒙层                                                                                      |
| resizable       | `boolean`                                 | `false`            | 是否可通过拖拽改变 Drawer 大小                                                                    |
| width           | `string \| number`                        | `500px`            | 容器的宽度，在 position 为 `left` 或 `right` 时生效                                               |
| height          | `string \| number`                        | `500px`            | 容器的高度，在 position 为 `top` 或 `bottom` 时生效                                               |
| actions         | Array<[Action](./action)>                 | 【确认】和【取消】 | 可以不设置，默认只有两个按钮。                                                                    |
| data            | `object`                                  |                    | 支持 [数据映射](../../docs/concepts/data-mapping)，如果不设定将默认将触发按钮的上下文中继承数据。 |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                                                                 | 说明               |
| -------- | ------------------------------------------------------------------------ | ------------------ |
| confirm  | `event.data: object` 抽屉数据<br/>`[name]: any` 当前数据域中指定字段的值 | 点击确认提交时触发 |
| cancel   | `event.data: object` 抽屉数据<br/>`[name]: any` 当前数据域中指定字段的值 | 点击取消时触发     |

### confirm

```schema: scope="body"
[
  {
    "label": "点击弹框",
    "type": "button",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "drawer",
            "drawer": {
              "title": "弹框标题",
              "body": "这是一个弹框",
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
    "label": "点击弹框",
    "type": "button",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "drawer",
            "drawer": {
              "title": "弹框标题",
              "body": "这是一个弹框",
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

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                   | 说明         |
| -------- | -------------------------- | ------------ |
| confirm  | -                          | 确认（提交） |
| cancel   | -                          | 取消（关闭） |
| setValue | `value: object` 更新的数据 | 更新数据     |

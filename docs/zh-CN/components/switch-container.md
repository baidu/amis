---
title: switch-container 状态容器
description:
type: 0
group: ⚙ 组件
menuName: switch-container 容器
icon:
order: 50
---

switch-container 是一种特殊的容器组件，它可以根据动态数据显示条件渲染组件的某一状态。注意容器只会显示最多一种状态，只显示首个命中的状态。容器的不同状态是对应的展示配置，可通过组件搭配与嵌套设计任意展示样式。状态容器的外观与事件动作与容器组件类似，支持常见的外观设置与点击、移入、移出事件动作。

状态容器主要用于编辑器内统一管理复杂组件的多种状态，同时避免因为组件多状态显示而干扰设计。如果只使用 amis 引擎，也可以直接用容器加显示条件实现。

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "title": "",
  "mode": "horizontal",
  "dsType": "api",
  "feat": "Insert",
  "body": [
    {
      "type": "button-group-select",
      "name": "state",
      "label": "切换状态",
      "inline": false,
      "options": [
        {
          "label": "选项1",
          "value": "a"
        },
        {
          "label": "选项2",
          "value": "b"
        }
      ],
      "multiple": false,
      "value": ""
    },
    {
      "type": "switch-container",
      "items": [
        {
          "title": "状态1",
          "body": [
            {
              "type": "tpl",
              "tpl": "状态内容1",
              "wrapperComponent": "",
              "inline": false
            }
          ],
          "visibleOn": "${state == \"a\"}"
        },
        {
          "title": "状态2",
          "body": [
            {
              "type": "tpl",
              "tpl": "状态内容2",
              "wrapperComponent": "",
              "inline": false
            }
          ],
          "visibleOn": "${state == \"b\"}"
        }
      ],
      "style": {
        "position": "static",
        "display": "block"
      }
    }
  ],
  "actions": [],
  "resetAfterSubmit": true
}
```

### style

container 可以通过 style 来设置样式，比如背景色或背景图，注意这里的属性是使用驼峰写法，是 `backgroundColor` 而不是 `background-color`。

```schema: scope="body"
{
  "type": "switch-container",
  "style": {
      "backgroundColor": "#C4C4C4"
  },
  "items": [
    {
      "title": "状态1",
      "body": [
        {
          "type": "tpl",
          "tpl": "状态内容1",
          "wrapperComponent": "",
          "inline": false
        }
      ]
    }
  ],
}
```

## 属性表

| 属性名    | 类型                                      | 默认值        | 说明                    |
| --------- | ----------------------------------------- | ------------- | ----------------------- |
| type      | `string`                                  | `"container"` | 指定为 container 渲染器 |
| className | `string`                                  |               | 外层 Dom 的类名         |
| style     | `Object`                                  |               | 自定义样式              |
| items     | [SchemaNode](../../docs/types/schemanode) |               | 容器内容                |

## 事件表

> 3.3.0 及以上版本

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细查看[事件动作](../../docs/concepts/event-action)。

| 事件名称   | 事件参数 | 说明           |
| ---------- | -------- | -------------- |
| click      | -        | 点击时触发     |
| mouseenter | -        | 鼠标移入时触发 |
| mouseleave | -        | 鼠标移出时触发 |

### click

鼠标点击。可以尝试通过`${event.context.nativeEvent}`获取鼠标事件对象。

```schema: scope="body"
{
    "type": "switch-container",
    "items": [
      {
        "title": "状态1",
        "body": [
          {
            "type": "tpl",
            "tpl": "状态内容1",
            "wrapperComponent": "",
            "inline": false
          }
        ]
      }
    ],
    "onEvent": {
        "click": {
            "actions": [
                {
                    "actionType": "toast",
                    "args": {
                        "msgType": "info",
                        "msg": "${event.context.nativeEvent.type}"
                    }
                }
            ]
        }
    }
}
```

### mouseenter

鼠标移入。可以尝试通过`${event.context.nativeEvent}`获取鼠标事件对象。

```schema: scope="body"
{
    "type": "switch-container",
    "items": [
      {
        "title": "状态1",
        "body": [
          {
            "type": "tpl",
            "tpl": "状态内容1",
            "wrapperComponent": "",
            "inline": false
          }
        ]
      }
    ],
    "onEvent": {
        "mouseenter": {
            "actions": [
                {
                    "actionType": "toast",
                    "args": {
                        "msgType": "info",
                        "msg": "${event.context.nativeEvent.type}"
                    }
                }
            ]
        }
    }
}
```

### mouseleave

鼠标移出。可以尝试通过`${event.context.nativeEvent}`获取鼠标事件对象。

```schema: scope="body"
{
    "type": "switch-container",
    "items": [
      {
        "title": "状态1",
        "body": [
          {
            "type": "tpl",
            "tpl": "状态内容1",
            "wrapperComponent": "",
            "inline": false
          }
        ]
      }
    ],
    "onEvent": {
        "mouseleave": {
            "actions": [
                {
                    "actionType": "toast",
                    "args": {
                        "msgType": "info",
                        "msg": "${event.context.nativeEvent.type}"
                    }
                }
            ]
        }
    }
}
```

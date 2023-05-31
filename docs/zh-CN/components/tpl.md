---
title: Tpl 模板
description:
type: 0
group: ⚙ 组件
menuName: Tpl
icon:
order: 70
---

输出 [模板](../../docs/concepts/template) 的常用组件

## 基本用法

```schema
{
  "data": {
    "text": "World!"
  },
  "type": "page",
  "body": {
    "type": "tpl",
    "tpl": "Hello ${text}"
  }
}
```

更多模板相关配置请看[模板文档](../../docs/concepts/template)

## 快速编辑

通过 `quickEdit` 开启快速编辑功能，比如

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "static",
            "type": "static",
            "label": "静态展示",
            "value": "123",
            "quickEdit": {
                "type": "number"
            }
        }
    ]
}
```

其他配置项参考 [快速编辑](crud#快速编辑)

## 属性表

| 属性名          | 类型                                 | 默认值  | 说明                                         |
| --------------- | ------------------------------------ | ------- | -------------------------------------------- |
| type            | `string`                             | `"tpl"` | 指定为 Tpl 组件                              |
| className       | `string`                             |         | 外层 Dom 的类名                              |
| tpl             | [模板](../../docs/concepts/template) |         | 配置模板                                     |
| showNativeTitle | `boolean`                            |         | 是否设置外层 DOM 节点的 title 属性为文本内容 |

## 事件表

> 2.5.3 及以上版本

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
    "type": "tpl",
    "tpl": "Hello",
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
   "type": "tpl",
    "tpl": "Hello",
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
   "type": "tpl",
    "tpl": "Hello",
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

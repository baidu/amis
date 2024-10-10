---
title: Container 容器
description:
type: 0
group: ⚙ 组件
menuName: Container 容器
icon:
order: 38
---

Container 是一种容器组件，它可以渲染其他 amis 组件。

注意 Container 组件因为历史原因多了一层 div，推荐使用 [wrapper](wrapper) 来作为容器。

## 基本用法

```schema: scope="body"
{
    "type": "container",
    "body": "这里是容器内容区"
}
```

### style

container 可以通过 style 来设置样式，比如背景色或背景图，注意这里的属性是使用驼峰写法，是 `backgroundColor` 而不是 `background-color`。

```schema: scope="body"
{
    "type": "container",
    "style": {
        "backgroundColor": "#C4C4C4"
    },
    "body": "这里是容器内容区"
}
```

### wrapperComponent

修改标签名可以让容器使用其它标签渲染，比如 `pre`

```schema: scope="body"
{
    "type": "container",
    "wrapperComponent": "pre",
    "body": "var a = 1;"
}
```

## 属性表

| 属性名           | 类型                                      | 默认值        | 说明                    |
| ---------------- | ----------------------------------------- | ------------- | ----------------------- |
| type             | `string`                                  | `"container"` | 指定为 container 渲染器 |
| className        | `string`                                  |               | 外层 Dom 的类名         |
| bodyClassName    | `string`                                  |               | 容器内容区的类名        |
| wrapperComponent | `string`                                  | `"div"`       | 容器标签名              |
| style            | `Object`                                  |               | 自定义样式              |
| body             | [SchemaNode](../../docs/types/schemanode) |               | 容器内容                |

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
    "type": "container",
    "body": "这里是容器内容区",
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
    "type": "container",
    "body": "这里是容器内容区",
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
    "type": "container",
    "body": "这里是容器内容区",
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

---
title: Switch 开关
description:
type: 0
group: null
menuName: Switch
icon:
order: 51
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "switch",
            "type": "switch",
            "label": "开关",
            "option": "开关说明"
        }
    ]
}
```

## 配置真假值

默认情况：

- 开关打开时，表单项值为：true
- 开关关闭时，表单项值为：false

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "name": "switch",
            "type": "switch",
            "label": "开关"
        }
    ]
}
```

如果你想调整这个值，可以配置`trueValue`和`falseValue`

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "name": "switch",
            "type": "switch",
            "label": "开关",
            "trueValue": 1,
            "falseValue": 0
        }
    ]
}
```

调整开关，观察数据域变化，会发现打开后值为`1`，而关闭后为`0`

## 配置开启和关闭状态的文本

> 1.1.5 版本之后支持

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "switch",
            "type": "switch",
            "onText": "已开启飞行模式",
            "offText": "已关闭飞行模式"
        }
    ]
}
```

## 默认值

和其它表单项一样，如果要设置默认值，可以使用 value 属性

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "name": "switch",
            "type": "switch",
            "label": "开关",
            "value": false
        }
    ]
}
```

## 不同尺寸

> 2.0.0 及以上版本

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "switch",
            "type": "switch",
            "label": ""
        },
        {
            "name": "switch-sm",
            "type": "switch",
            "label": "",
            "size": "sm"
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名     | 类型                        | 默认值  | 说明                 |
| ---------- | --------------------------- | ------- | -------------------- |
| option     | `string`                    |         | 选项说明             |
| onText     | `string / IconSchema`       |         | 开启时开关显示的内容 |
| offText    | `string / IconSchema`       |         | 关闭时开关显示的内容 |
| trueValue  | `boolean / string / number` | `true`  | 标识真值             |
| falseValue | `boolean / string / number` | `false` | 标识假值             |
| size       | `"sm" \| "md"`              | `"md"`  | 开关大小             |

IconSchema 配置
| 属性名 | 类型 | 默认值 | 说明 |
| ---------- | -------- | --------- | ------------ |
| type | `string` | | `icon` |
| icon | `string` | | icon 的类型 |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.2.1 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                             | 说明             |
| -------- | ------------------------------------ | ---------------- |
| change   | `[name]: string \| boolean` 组件的值 | 开关值变化时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                              | 说明     |
| -------- | ------------------------------------- | -------- |
| setValue | `value: string \| boolean` 更新的数据 | 更新数据 |

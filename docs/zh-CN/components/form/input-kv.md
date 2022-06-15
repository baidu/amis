---
title: InputKV 键值对
description:
type: 0
group: null
menuName: InputKV
icon:
order: 14
---

## 基本用法

`input-kv` 是用来支持对象形式的数据编辑，比如类似这样的数据：

```json
{
  "css": {
    "width": 1,
    "height": 2
  }
}
```

`css` 中的 key 是不确定的，没法用 combo 来实现，这时可以使用 `input-kv`

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-kv",
            "name": "kv"
        }
    ]
}
```

最终发送的数据将会是

## 自定义 value 的格式

key 只能是字符串，因此输入格式是 `input-text`，但 value 格式可通过 `valueType` 自定义。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-kv",
            "name": "kv",
            "valueType": "input-number"
        }
    ]
}
```

## 自定义 value 的默认值

通过 `defaultValue` 设置默认值

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-kv",
            "name": "css",
            "defaultValue": "1.0"
        }
    ]
}
```

## 关闭可拖拽排序

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-kv",
            "name": "css",
            "draggable": false
        }
    ]
}
```

## 自定义提示信息

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-kv",
            "name": "css",
            "keyPlaceholder": "属性",
            "valuePlaceholder": "值"
        }
    ]
}
```

## 属性表

| 属性名           | 类型      | 默认值         | 说明               |
| ---------------- | --------- | -------------- | ------------------ |
| valueType        | `type`    | `"input-text"` | 值类型             |
| keyPlaceholder   | `string`  |                | key 的提示信息的   |
| valuePlaceholder | `string`  |                | value 的提示信息的 |
| draggable        | `boolean` | true           | 是否可拖拽排序     |
| defaultValue     |           | `''`           | 默认值             |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`event.data.xxx`事件参数变量来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                                                              | 说明             |
| -------- | --------------------------------------------------------------------- | ---------------- |
| add      | `event.data.value: string \| string[]` 当前数据集                     | 添加组合项时触发 |
| delete   | `event.data.key: number` 移除项的索引<br />`value: string` 当前数据集 | 删除组合项时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                 | 说明                                                   |
| -------- | ------------------------ | ------------------------------------------------------ |
| clear    | -                        | 清空                                                   |
| reset    | -                        | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: object` 更新的值 | 更新数据                                               |

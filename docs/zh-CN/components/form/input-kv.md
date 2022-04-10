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

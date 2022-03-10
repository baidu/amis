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

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名     | 类型                        | 默认值  | 说明                 |
| ---------- | --------------------------- | ------- | -------------------- |
| option     | `string`                    |         | 选项说明             |
| onText     | `string / IconSchema`       |         | 开启时开关显示的内容 |
| offText    | `string / IconSchema`       |         | 关闭时开关显示的内容 |
| trueValue  | `boolean / string / number` | `true`  | 标识真值             |
| falseValue | `boolean / string / number` | `false` | 标识假值             |

IconSchema 配置
| 属性名 | 类型 | 默认值 | 说明 |
| ---------- | -------- | --------- | ------------ |
| type | `string` | | `icon` |
| icon | `string` | | icon 的类型 |

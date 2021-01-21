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
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
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
    "controls": [
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
    "controls": [
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

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名     | 类型     | 默认值    | 说明     |
| ---------- | -------- | --------- | -------- |
| option     | `string` |           | 选项说明 |
| trueValue  | `any`    | `true`    | 标识真值 |
| falseValue | `any`    | `"false"` | 标识假值 |

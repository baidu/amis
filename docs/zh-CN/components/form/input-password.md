---
title: InputPassword 密码输入框
description:
type: 0
group: null
menuName: InputPassword
icon:
order: 35
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-password",
            "name": "password",
            "label": "密码"
        }
    ]
}
```

## 配置密码显/隐藏

`revealPassword`属性可以设置是否展示密码显/隐按钮，默认为`true`。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-password",
            "name": "password",
            "label": "密码",
            "revealPassword": false
        }
    ]
}
```

## 属性表

请参考[输入框](./input-text)

| 属性名         | 类型      | 默认值 | 说明                  |
| -------------- | --------- | ------ | --------------------- |
| revealPassword | `boolean` | `true` | 是否展示密码显/隐按钮 |

## 事件表

请参考[输入框](./input-text)

## 动作表

请参考[输入框](./input-text)

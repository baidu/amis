---
title: Textarea 多行文本输入框
description:
type: 0
group: null
menuName: Textarea 多行文本输入框
icon:
order: 57
---

## 基本使用

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "textarea",
            "type": "textarea",
            "label": "多行文本"
        }
    ]
}
```

## 清空输入框

带移除图标的输入框，点击图标删除所有内容。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "textarea",
            "type": "textarea",
            "label": "多行文本",
            "clearable": true
        }
    ]
}
```

设置`resetValue`，清空输入框后重置为指定值

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "textarea",
            "type": "textarea",
            "label": "多行文本",
            "clearable": true,
            "resetValue": "reset"
        }
    ]
}
```

## 显示计数器

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "a",
            "type": "textarea",
            "label": "A",
            "showCounter": true,
            "placeholder": "请输入",
            "clearable": true
        },
        {
            "name": "b",
            "type": "textarea",
            "label": "B",
            "showCounter": true,
            "maxLength": 100,
            "placeholder": "请输入"
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名       | 类型      | 默认值  | 说明                         |
| ------------ | --------- | ------- | ---------------------------- |
| minRows      | `number`  | `3`     | 最小行数                     |
| maxRows      | `number`  | `20`    | 最大行数                     |
| trimContents | `boolean` | `true`  | 是否去除首尾空白文本         |
| readOnly     | `boolean` | `false` | 是否只读                     |
| showCounter  | `boolean` | `false` | 是否显示计数器               |
| maxLength    | `number`  | -       | 限制最大字数                 |
| clearable    | `boolean` | `false` | 是否可清除                   |
| resetValue   | `string`  | `""`    | 清除后设置此配置项给定的值。 |

## 事件表

| 事件名称 | 事件参数         | 说明     |
| -------- | ---------------- | -------- |
| focus    | `value: string`  | 获取焦点 |
| blur     | `value: string ` | 失去焦点 |
| change   | `value: string`  | 值变化   |

## 动作表

| 动作名称 | 动作配置 | 说明     |
| -------- | -------- | -------- |
| clear    | -        | 清空     |
| focus    | -        | 获取焦点 |

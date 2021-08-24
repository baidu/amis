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
            "placeholder": "请输入"
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

| 属性名       | 类型      | 默认值 | 说明                 |
| ------------ | --------- | ------ | -------------------- |
| minRows      | `number`  |        | 最小行数             |
| maxRows      | `number`  |        | 最大行数             |
| trimContents | `boolean` |        | 是否去除首尾空白文本 |
| readOnly     | `boolean` |        | 是否只读             |
| showCounter  | `boolean` | ``     | 是否显示计数器       |
| minLength    | `number`  | ``     | 限制最小字数         |
| maxLength    | `number`  | ``     | 限制最大字数         |

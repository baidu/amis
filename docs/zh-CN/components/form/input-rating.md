---
title: InputRating 评分
description:
type: 0
group: null
menuName: InputRating 评分
icon:
order: 37
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-rating",
            "name": "rating",
            "label": "评分"
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名     | 类型      | 默认值  | 说明                   |
| ---------- | --------- | ------- | ---------------------- |
| half       | `boolean` | `false` | 是否使用半星选择       |
| count      | `number`  | `5`     | 共有多少星可供选择     |
| readOnly   | `boolean` | `false` | 只读                   |
| allowClear | `boolean` | `true`  | 是否允许再次点击后清除 |

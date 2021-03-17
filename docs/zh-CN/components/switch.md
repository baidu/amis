---
title: Switch 开关
description:
type: 0
group: ⚙ 组件
menuName: Switch
icon:
order: 66
---

## 基本用法

常见的用法是放 CRUD 中

```schema: scope="body"
{
    "type": "crud",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample",
    "quickSaveItemApi": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/$id",
    "syncLocation": false,
    "columns": [
        {
            "name": "id",
            "type": "switch",
            "label": "switch"
        }
    ]
}
```

## 属性表

| 属性名    | 类型     | 默认值 | 说明                            |
| --------- | -------- | ------ | ------------------------------- |
| type      | `string` |        | `"switch"` 指定为 Dialog 渲染器 |
| className | `string` |        | 外层 Dom 的类名                 |
| trueValue | any      |        | 真值，当值为该值时，开关开启    |
| option    | `string` |        | 右侧选项文本                    |

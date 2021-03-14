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

```schema
{
    "type": "page",
    "body": {
        "type": "switch",
        "value": true
    }
}
```

这仅用于查看，表单中的请参考[这里](form/switch)

## 属性表

| 属性名    | 类型     | 默认值 | 说明                            |
| --------- | -------- | ------ | ------------------------------- |
| type      | `string` |        | `"switch"` 指定为 Dialog 渲染器 |
| className | `string` |        | 外层 Dom 的类名                 |
| trueValue | any      |        | 真值，当值为该值时，开关开启    |
| option    | `string` |        | 右侧选项文本                    |

---
title: Status 状态
description:
type: 0
group: ⚙ 组件
menuName: Status
icon:
order: 65
---

## 基本用法

```schema: scope="body"
{
    "type": "status",
    "value": 1
}
```

## 属性表

| 属性名      | 类型     | 默认值 | 说明                            |
| ----------- | -------- | ------ | ------------------------------- |
| type        | `string` |        | `"status"` 指定为 Status 渲染器 |
| className   | `string` |        | 外层 Dom 的类名                 |
| placeholder | `string` | `-`    | 占位文本                        |

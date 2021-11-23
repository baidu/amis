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

它最适合的用法是放在 crud 的列中，用来表示状态

## 默认状态列表

```schema
{
  "type": "page",
  "body": [
    {
      "type": "status",
      "value": 0
    },
    {
      "type": "status",
      "value": 1
    },
    {
      "type": "status",
      "value": "success"
    },
    {
      "type": "status",
      "value": "pending"
    },
    {
      "type": "status",
      "value": "fail"
    },
    {
      "type": "status",
      "value": "fail"
    },
    {
      "type": "status",
      "value": "queue"
    },
    {
      "type": "status",
      "value": "schedule"
    }
  ]
}
```

## 自定义状态图标和文本

通过 `map` 和 `mapLabel`

```schema
{
  "type": "page",
  "body": [
    {
      "type": "status",
      "map": {
        "0": "fa fa-check-circle",
        "1": "fa fa-times-circle"
      },
      "labelMap": {
        "0": "正常",
        "1": "异常"
      },
      "value": 0
    },
    {
      "type": "status",
      "map": {
        "0": "fas fa-check-circle",
        "1": "fas fa-times-circle"
      },
      "labelMap": {
        "0": "正常",
        "1": "异常"
      },
      "value": 1
    }
  ]
}
```

## 属性表

| 属性名      | 类型     | 默认值 | 说明                            |
| ----------- | -------- | ------ | ------------------------------- |
| type        | `string` |        | `"status"` 指定为 Status 渲染器 |
| className   | `string` |        | 外层 Dom 的类名                 |
| placeholder | `string` | `-`    | 占位文本                        |
| map         | `object` |        | 映射图标                        |
| labelMap    | `object` |        | 映射文本                        |

---
title: Json
description: 
type: 0
group: ⚙ 组件
menuName: Json
icon: 
order: 54
---
JSON 展示组件

## 基本用法

```schema:height="300"
{
    "type": "page",
    "body": {
        "type": "json",
        "value": {
            "a": "a",
            "b": "b",
            "c": {
                "d": "d"
            }
        }
    }
}
```

## 主题

可配置`jsonTheme`，指定显示主题，可选`twilight`和`eighties`，默认为`twilight`。

```schema:height="300" scope="body"
[
{
    "type": "json",
    "value": {
        "a": "a",
        "b": "b",
        "c": {
            "d": "d"
        }
    }
},
{
    "type": "divider"
},
{
    "type": "json",
    "jsonTheme": "eighties",
    "value": {
        "a": "a",
        "b": "b",
        "c": {
            "d": "d"
        }
    }
}
]
```


## 配置默认展开层级

```schema:height="300"
{
    "type": "page",
    "body": {
        "type": "json",
        "levelExpand": 0,
        "value": {
            "a": "a",
            "b": "b",
            "c": {
                "d": "d"
            }
        }
    }
}
```

如上，`levelExpand`配置为`0`，则默认不展开。


## 属性表

| 属性名      | 类型     | 默认值     | 说明                                                                                 |
| ----------- | -------- | ---------- | ------------------------------------------------------------------------------------ |
| type        | `string` |            | 如果在 Table、Card 和 List 中，为`"json"`；在 Form 中用作静态展示，为`"static-json"` |
| className   | `string` |            | 外层 CSS 类名                                                                        |
| placeholder | `string` | `-`        | 占位文本                                                                             |
| levelExpand | `number` | `1`        | 默认展开的层级                                                                       |
| jsonTheme   | `string` | `twilight` | 主题，可选`twilight`和`eighties`                                                     |







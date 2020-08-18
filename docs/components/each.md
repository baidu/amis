---
title: Each 循环渲染器
description:
type: 0
group: ⚙ 组件
menuName: Each 循环渲染器
icon:
order: 45
---

## 基本用法

```schema:height="160" scope="body"
{
    "type": "each",
    "value": ["A", "B", "C"],
    "items": {
        "type": "tpl",
        "tpl": "<span class='label label-default'><%= data.item %></span> "
    }
}
```

## 属性表

| 属性名 | 类型     | 默认值   | 说明                                                        |
| ------ | -------- | -------- | ----------------------------------------------------------- |
| type   | `string` | `"each"` | 指定为 Each 组件                                            |
| value  | `array`  | `[]`     | 用于循环的值                                                |
| name   | `string` |          | 获取数据域中变量，支持 [数据映射](../concepts/data-mapping) |
| items  | `object` |          | 使用`value`中的数据，循环输出渲染器。                       |

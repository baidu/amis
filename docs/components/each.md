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
        "tpl": "<span class='label label-default m-l-sm'><%= data.item %></span> "
    }
}
```

## 用作 Field 时

当用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中时，可以设置`name`属性，映射同名变量，然后用可以通过 `item` 变量获取单项值

### Table 中的列类型

```schema:height="400" scope="body"
{
    "type": "table",
    "data": {
        "items": [
            {
                "id": "1",
                "each": ["A1", "B1", "C1"]
            },
            {
                "id": "2",
                "each": ["A2", "B2", "C2"]
            },
            {
                "id": "3",
                "each": ["A3", "B3", "C3"]
            }
        ]
    },
    "columns": [
        {
            "name": "id",
            "label": "Id"
        },

        {
            "name": "each",
            "label": "循环",
            "type": "each",
            "items": {
                "type": "tpl",
                "tpl": "<span class='label label-info m-l-sm'><%= data.item %></span>"
            }
        }
    ]
}
```

List 的内容、Card 卡片的内容配置同上

### Form 中静态展示

```schema:height="300" scope="body"
{
    "type": "form",
    "data": {
        "each": ["A", "B", "C"]
    },
    "controls": [
        {
            "type": "each",
            "label": "静态展示each",
            "name": "each",
            "items": {
                "type": "tpl",
                "tpl": "<span class='label label-info m-l-sm'><%= data.item %></span>"
            }
        }
    ]
}
```

## 属性表

| 属性名 | 类型     | 默认值   | 说明                                                        |
| ------ | -------- | -------- | ----------------------------------------------------------- |
| type   | `string` | `"each"` | 指定为 Each 组件                                            |
| value  | `array`  | `[]`     | 用于循环的值                                                |
| name   | `string` |          | 获取数据域中变量，支持 [数据映射](../concepts/data-mapping) |
| items  | `object` |          | 使用`value`中的数据，循环输出渲染器。                       |

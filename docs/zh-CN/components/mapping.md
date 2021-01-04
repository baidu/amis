---
title: Mapping 映射
description: 
type: 0
group: ⚙ 组件
menuName: Mapping 映射
icon: 
order: 57
---
## 基本用法

```schema:height="200"
{
    "type": "page",
    "body": {
        "type": "mapping",
        "value": "1",
        "map": {
            "1": "第一",
            "2": "第二",
            "3": "第三",
            "*": "其他"
        }
    }
}
```

## 渲染 HTML

```schema:height="200"
{
    "type": "page",
    "body": {
        "type": "mapping",
        "value": "2",
        "map": {
            "1": "<span class='label label-info'>漂亮</span>",
            "2": "<span class='label label-success'>开心</span>",
            "3": "<span class='label label-danger'>惊吓</span>",
            "4": "<span class='label label-warning'>紧张</span>",
            "*": "其他：${type}"
        }
    }
}
```

## 用作 Field 时

当用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的Static-XXX 中时，可以设置`name`属性，映射同名变量

### Table 中的列类型

```schema:height="300" scope="body"
{
    "type": "table",
    "data": {
        "items": [
            {
                "id": "1",
                "type": "1"
            },
            {
                "id": "2",
                "type": "2"
            },
            {
                "id": "3",
                "type": "3"
            }
        ]
    },
    "columns": [
        {
            "name": "id",
            "label": "Id"
        },

        {
            "name": "type",
            "label": "映射",
            "type": "mapping",
            "map": {
                "1": "<span class='label label-info'>漂亮</span>",
                "2": "<span class='label label-success'>开心</span>",
                "3": "<span class='label label-danger'>惊吓</span>",
                "4": "<span class='label label-warning'>紧张</span>",
                "*": "其他：${type}"
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
        "type": "2"
    },
    "controls": [
        {
            "type": "static-mapping",
            "name": "type",
            "label": "映射",
            "map": {
                "1": "<span class='label label-info'>漂亮</span>",
                "2": "<span class='label label-success'>开心</span>",
                "3": "<span class='label label-danger'>惊吓</span>",
                "4": "<span class='label label-warning'>紧张</span>",
                "*": "其他：${type}"
            }
        }
    ]
}
```

## 属性表

| 属性名      | 类型     | 默认值 | 说明                                                                                   |
| ----------- | -------- | ------ | -------------------------------------------------------------------------------------- |
| type        | `string` |        | 如果在 Table、Card 和 List 中，为`"color"`；在 Form 中用作静态展示，为`"static-color"` |
| className   | `string` |        | 外层 CSS 类名                                                                          |
| placeholder | `string` |        | 占位文本                                                                               |
| map         | `object` |        | 映射配置                                                                               |






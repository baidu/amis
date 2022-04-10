---
title: Color 颜色
description:
type: 0
group: ⚙ 组件
menuName: Color
icon:
order: 37
---

用于展示颜色

## 基本用法

```schema
{
    "type": "page",
    "body": {
        "type": "color",
        "value": "#108cee"
    }
}
```

## 用作 Field 时

当用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中时，可以设置`name`属性，映射同名变量

### Table 中的列类型

```schema: scope="body"
{
    "type": "table",
    "data": {
        "items": [
            {
                "id": "1",
                "color": "#108cee"
            },
            {
                "id": "2",
                "color": "#f38900"
            },
            {
                "id": "3",
                "color": "#04c1ba"
            }
        ]
    },
    "columns": [
        {
            "name": "id",
            "label": "Id"
        },

        {
            "name": "color",
            "label": "颜色",
            "type": "color"
        }
    ]
}
```

List 的内容、Card 卡片的内容配置同上

### Form 中静态展示

```schema: scope="body"
{
    "type": "form",
    "data": {
        "color": "#108cee"
    },
    "body": [
        {
            "type": "static-color",
            "name": "color",
            "label": "颜色"
        }
    ]
}
```

## 属性表

| 属性名       | 类型      | 默认值 | 说明                                                                                   |
| ------------ | --------- | ------ | -------------------------------------------------------------------------------------- |
| type         | `string`  |        | 如果在 Table、Card 和 List 中，为`"color"`；在 Form 中用作静态展示，为`"static-color"` |
| className    | `string`  |        | 外层 CSS 类名                                                                          |
| value        | `string`  |        | 显示的颜色值                                                                           |
| name         | `string`  |        | 在其他组件中，时，用作变量映射                                                         |
| defaultColor | `string`  | `#ccc` | 默认颜色值                                                                             |
| showValue    | `boolean` | `true` | 是否显示右边的颜色值                                                                   |

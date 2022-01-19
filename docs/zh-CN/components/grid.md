---
title: Grid 水平分栏
description:
type: 0
group: ⚙ 组件
menuName: Grid 组件
icon:
order: 46
---

## 基本用法

默认会水平均分宽度

```schema: scope="body"
[
    {
        "type": "grid",
        "columns": [
            {
                "columnClassName": "bg-green-300",
                "body": [
                    {
                        "type": "plain",
                        "text": "第一栏"
                    }
                ]
            },
            {
                "columnClassName": "bg-blue-300",
                "body": [
                    {
                        "type": "plain",
                        "text": "第二栏"
                    }
                ]
            }
        ]
    },
    {
        "type": "grid",
        "className": "m-t",
        "columns": [
            {
                "columnClassName": "bg-green-300",
                "body": [
                    {
                        "type": "plain",
                        "text": "第一栏"
                    }
                ]
            },
            {
                "columnClassName": "bg-blue-300",
                "body": [
                    {
                        "type": "plain",
                        "text": "第二栏"
                    }
                ]
            },
            {
                "columnClassName": "bg-red-300",
                "body": [
                    {
                        "type": "plain",
                        "text": "第三栏"
                    }
                ]
            }
        ]
    }
]
```

## 响应式

通过 `md` 设置屏幕中等宽度（768px）情况下的分栏

```schema: scope="body"
[
    {
        "type": "grid",
        "className": "b-a bg-dark lter",
        "columns": [
            {

                "md": 0,
                "body": [
                    {
                        "type": "plain",
                        "text": "md: 3",
                        "className": "b-r"
                    }
                ]
            },

            {
                "md": 9,
                "body": [
                    {
                        "type": "plain",
                        "text": "md: 9"
                    }
                ]
            }
        ]
    }
]
```

## 属性表

| 属性名                     | 类型                                               | 默认值   | 说明                 |
| -------------------------- | -------------------------------------------------- | -------- | -------------------- |
| type                       | `string`                                           | `"grid"` | 指定为 Grid 渲染器   |
| className                  | `string`                                           |          | 外层 Dom 的类名      |
| gap                        | `'xs' \| 'sm' \| 'base' \| 'none' \| 'md' \| 'lg'` |          | 水平间距             |
| valign                     | `'top' \| 'middle' \| 'bottom' \| 'between'`       |          | 垂直对齐方式         |
| align                      | `'left' \| 'right' \| 'between' \| 'center'`       |          | 水平对齐方式         |
| columns                    | `Array`                                            |          | 列集合               |
| columns[x]                 | [SchemaNode](../../docs/types/schemanode)          |          | 成员可以是其他渲染器 |
| columns[x].xs              | `int` or "auto"                                    |          | 宽度占比： 1 - 12    |
| columns[x].columnClassName |                                                    |          | 列类名               |
| columns[x].sm              | `int` or "auto"                                    |          | 宽度占比： 1 - 12    |
| columns[x].md              | `int` or "auto"                                    |          | 宽度占比： 1 - 12    |
| columns[x].lg              | `int` or "auto"                                    |          | 宽度占比： 1 - 12    |
| columns[x].valign          | `'top' \| 'middle' \| 'bottom' \| 'between'`       |          | 当前列内容的垂直对齐 |

更多使用说明，请参看 [Grid Props](https://react-bootstrap.github.io/layout/grid/#col-props)

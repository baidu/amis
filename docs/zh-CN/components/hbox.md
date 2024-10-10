---
title: HBox 布局
description:
type: 0
group: ⚙ 组件
menuName: HBox
icon:
order: 48
---

## 基本用法

```schema: scope="body"
[
    {
        "type": "hbox",
        "className": "b-a bg-dark lter",
        "columns": [
            {
                "type": "plain",
                "text": "Col A",
                "columnClassName": "wrapper-xs b-r"
            },

            "Col B"
        ]
    },

    {
        "type": "hbox",
        "className": "b-a m-t bg-dark lter",
        "columns": [
            {
                "type": "plain",
                "text": "w-md",
                "columnClassName": "w-md wrapper-xs bg-primary b-r"
            },
            "..."
        ]
    }
]
```

## 属性表

| 属性名                     | 类型                                               | 默认值         | 说明                 |
| -------------------------- | -------------------------------------------------- | -------------- | -------------------- |
| type                       | `string`                                           | `"hbox"`       | 指定为 HBox 渲染器   |
| className                  | `string`                                           |                | 外层 Dom 的类名      |
| gap                        | `'xs' \| 'sm' \| 'base' \| 'none' \| 'md' \| 'lg'` |                | 水平间距             |
| valign                     | `'top' \| 'middle' \| 'bottom' \| 'between'`       |                | 垂直对齐方式         |
| align                      | `'left' \| 'right' \| 'between' \| 'center'`       |                | 水平对齐方式         |
| columns                    | `Array`                                            |                | 列集合               |
| columns[x]                 | [SchemaNode](../../docs/types/schemanode)          |                | 成员可以是其他渲染器 |
| columns[x].columnClassName | `string`                                           | `"wrapper-xs"` | 列上类名             |
| columns[x].valign          | `'top' \| 'middle' \| 'bottom' \| 'between'`       |                | 当前列内容的垂直对齐 |

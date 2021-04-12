---
title: Grid 水平布局
description:
type: 0
group: ⚙ 组件
menuName: Grid 组件
icon:
order: 46
---

## 基本用法

```schema: scope="body"
[
    {
        "type": "grid",
        "className": "b-a bg-dark lter",
        "columns": [
            {
                "type": "plain",
                "text": "md: 3",
                "md": 3,
                "className": "b-r"
            },

            {
                "type": "plain",
                "text": "md: 9",
                "md": 9
            }
        ]
    },

    {
        "type": "grid",
        "className": "b-a m-t bg-dark lter",
        "columns": [
            {
                "type": "plain",
                "text": "mdOffset: 3",
                "mdOffset": 3
            }
        ]
    }
]
```

## 属性表

| 属性名                     | 类型                                      | 默认值   | 说明                    |
| -------------------------- | ----------------------------------------- | -------- | ----------------------- |
| type                       | `string`                                  | `"grid"` | 指定为 Grid 渲染器      |
| className                  | `string`                                  |          | 外层 Dom 的类名         |
| columns                    | `Array`                                   |          | 列集合                  |
| columns[x]                 | [SchemaNode](../../docs/types/schemanode) |          | 成员可以是其他渲染器    |
| columns[x].xs              | `int`                                     |          | 宽度占比： 1 - 12       |
| columns[x].columnClassName |                                           |          | 列类名                  |
| columns[x].xsHidden        | `boolean`                                 |          | 是否隐藏                |
| columns[x].xsOffset        | `int`                                     |          | 偏移量 1 - 12           |
| columns[x].xsPull          | `int`                                     |          | 靠左的距离占比：1 - 12  |
| columns[x].xsPush          | `int`                                     |          | 靠右的距离占比： 1 - 12 |
| columns[x].sm              | `int`                                     |          | 宽度占比： 1 - 12       |
| columns[x].smHidden        | `boolean`                                 |          | 是否隐藏                |
| columns[x].smOffset        | `int`                                     |          | 偏移量 1 - 12           |
| columns[x].smPull          | `int`                                     |          | 靠左的距离占比：1 - 12  |
| columns[x].smPush          | `int`                                     |          | 靠右的距离占比： 1 - 12 |
| columns[x].md              | `int`                                     |          | 宽度占比： 1 - 12       |
| columns[x].mdHidden        | `boolean`                                 |          | 是否隐藏                |
| columns[x].mdOffset        | `int`                                     |          | 偏移量 1 - 12           |
| columns[x].mdPull          | `int`                                     |          | 靠左的距离占比：1 - 12  |
| columns[x].mdPush          | `int`                                     |          | 靠右的距离占比： 1 - 12 |
| columns[x].lg              | `int`                                     |          | 宽度占比： 1 - 12       |
| columns[x].lgHidden        | `boolean`                                 |          | 是否隐藏                |
| columns[x].lgOffset        | `int`                                     |          | 偏移量 1 - 12           |
| columns[x].lgPull          | `int`                                     |          | 靠左的距离占比：1 - 12  |
| columns[x].lgPush          | `int`                                     |          | 靠右的距离占比： 1 - 12 |

更多使用说明，请参看 [Grid Props](https://react-bootstrap.github.io/layout/grid/#col-props)

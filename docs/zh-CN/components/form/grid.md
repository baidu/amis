---
title: Grid 水平布局
description:
type: 0
group: null
menuName: Grid
icon:
order: 23
---

支持 Form 内部再用 grid 布局进行渲染组件。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "type": "grid",
            "columns": [
                {
                    "md": 3,
                    "controls": [
                        {
                            "name": "text",
                            "type": "text",
                            "label": "text"
                        }
                    ]
                },

                {
                    "md": 9,
                    "controls": [
                        {
                            "name": "editor",
                            "type": "editor",
                            "label": "editor"
                        }
                    ]
                }
            ]
        }
    ]
}
```

## 属性表

| 属性名                     | 类型                              | 默认值   | 说明                                                           |
| -------------------------- | --------------------------------- | -------- | -------------------------------------------------------------- |
| type                       | `string`                          | `"grid"` | 指定为 Grid 渲染器                                             |
| className                  | `string`                          |          | 外层 Dom 的类名                                                |
| columns                    | `Array`                           |          | 列集合                                                         |
| columns[x]                 | [SchemaNode](../types/schemanode) |          | 成员可以是其他渲染器                                           |
| columns[x].controls        | Array<[表单项](./formitem)>       |          | 如果配置了表单集合，同时没有指定 type 类型，则优先展示表单集合 |
| columns[x].columnClassName | `int`                             |          | 配置列的 `className`                                           |
| columns[x].xs              | `int`                             |          | 宽度占比： 1 - 12                                              |
| columns[x].xsHidden        | `boolean`                         |          | 是否隐藏                                                       |
| columns[x].xsOffset        | `int`                             |          | 偏移量 1 - 12                                                  |
| columns[x].xsPull          | `int`                             |          | 靠左的距离占比：1 - 12                                         |
| columns[x].xsPush          | `int`                             |          | 靠右的距离占比： 1 - 12                                        |
| columns[x].sm              | `int`                             |          | 宽度占比： 1 - 12                                              |
| columns[x].smHidden        | `boolean`                         |          | 是否隐藏                                                       |
| columns[x].smOffset        | `int`                             |          | 偏移量 1 - 12                                                  |
| columns[x].smPull          | `int`                             |          | 靠左的距离占比：1 - 12                                         |
| columns[x].smPush          | `int`                             |          | 靠右的距离占比： 1 - 12                                        |
| columns[x].md              | `int`                             |          | 宽度占比： 1 - 12                                              |
| columns[x].mdHidden        | `boolean`                         |          | 是否隐藏                                                       |
| columns[x].mdOffset        | `int`                             |          | 偏移量 1 - 12                                                  |
| columns[x].mdPull          | `int`                             |          | 靠左的距离占比：1 - 12                                         |
| columns[x].mdPush          | `int`                             |          | 靠右的距离占比： 1 - 12                                        |
| columns[x].lg              | `int`                             |          | 宽度占比： 1 - 12                                              |
| columns[x].lgHidden        | `boolean`                         |          | 是否隐藏                                                       |
| columns[x].lgOffset        | `int`                             |          | 偏移量 1 - 12                                                  |
| columns[x].lgPull          | `int`                             |          | 靠左的距离占比：1 - 12                                         |
| columns[x].lgPush          | `int`                             |          | 靠右的距离占比： 1 - 12                                        |

更多使用说明，请参看 [Grid Props](https://react-bootstrap.github.io/layout/grid/#col-props)

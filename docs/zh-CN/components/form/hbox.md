---
title: HBox
description:
type: 0
group: null
menuName: HBox
icon:
order: 25
---

表单内部也可以使用 HBox 布局，实现左右排列。更推荐 [Group](./group)

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "hbox",
      "columns": [
        {
          "body": [
            {
              "name": "text",
              "type": "input-text",
              "label": false,
              "placeholder": "Text"
            }
          ]
        },

        {
          "type": "tpl",
          "tpl": "其他组件"
        }
      ]
    }
  ]
}
```

## 属性表

| 属性名  | 类型                     | 默认值 | 说明                                     |
| ------- | ------------------------ | ------ | ---------------------------------------- |
| columns | Array<[Column](columns)> |        | 列内容。每个 column 为一个独立的渲染器。 |

### Column 属性

除了 [SchemaNode](../../../docs/types/schemanode) 支持属性以外，还支持以下几种属性

| 属性名          | 类型                        | 默认值 | 说明                                                                         |
| --------------- | --------------------------- | ------ | ---------------------------------------------------------------------------- |
| columnClassName | `string`                    |        | 配置列的 CSS 类名                                                            |
| body            | Array<[表单项](./formitem)> |        | 表单项数组，如果配置了表单集合，同时没有指定 type 类型，则优先展示表单集合。 |

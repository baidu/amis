---
title: Tabs 选项卡
description:
type: 0
group: null
menuName: Tabs 选项卡
icon:
order: 53
---

有多组输入框时，也可以通过选项卡来分组。

## 基本用法

```schema:height="400" scope="body"
{
    "type": "form",
    "debug": true,
    "controls": [
        {
  "type": "tabs",
  "tabs": [
    {
      "title": "基本配置",
      "controls": [
        {
          "name": "text1",
          "type": "text",
          "label": "文本1"
        },

        {
          "name": "text2",
          "type": "text",
          "label": "文本2"
        }
      ]
    },

    {
      "title": "其他配置",
      "controls": [
        {
          "name": "text3",
          "type": "text",
          "label": "文本3"
        },

        {
          "name": "text4",
          "type": "text",
          "label": "文本4"
        }
      ]
    }
  ]
}
    ]
}
```

## 属性表

| 属性名           | 类型                                 | 默认值 | 说明                |
| ---------------- | ------------------------------------ | ------ | ------------------- |
| tabs             | `Array`                              |        | tabs 内容           |
| toolbar          | [SchemaNode](../../types/schemanode) |        | tabs 中的工具栏     |
| toolbarClassName | `string`                             |        | tabs 中工具栏的类名 |
| tabs[x].title    | `string`                             |        | Tab 标题            |
| tabs[x].body     | [SchemaNode](../../types/schemanode) |        | 内容容器            |
| tabs[x].controls | Array<[表单项](./formitem)>          |        | 表单项集合。        |

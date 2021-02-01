---
title: Collapse 折叠器
description:
type: 0
group: ⚙ 组件
menuName: Collapse 折叠器
icon:
order: 36
---

## 基本用法

```schema: scope="body"
{
    "type": "collapse",
    "title": "标题",
    "body": "这里是内容"
}
```

## 属性表

| 属性名           | 类型                                      | 默认值                                 | 说明                   |
| ---------------- | ----------------------------------------- | -------------------------------------- | ---------------------- |
| type             | `string`                                  | `"collapse"`                           | 指定为 Collapse 渲染器 |
| title            | [SchemaNode](../../docs/types/schemanode) |                                        | 标题                   |
| body             | [SchemaNode](../../docs/types/schemanode) |                                        | 内容                   |
| className        | `string`                                  | `bg-white wrapper`                     | CSS 类名               |
| headingClassName | `string`                                  | `font-thin b-b b-light text-lg p-b-xs` | 标题 CSS 类名          |
| bodyClassName    | `string`                                  |                                        | 内容 CSS 类名。        |
| collapsed        | `boolean`                                 | `false`                                | 默认是否要收起。       |

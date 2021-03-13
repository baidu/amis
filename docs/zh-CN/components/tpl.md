---
title: Tpl 模板
description:
type: 0
group: ⚙ 组件
menuName: Tpl
icon:
order: 70
---

输出 [模板](../../docs/concepts/template) 的常用组件

## 基本用法

```schema
{
  "data": {
    "text": "World!"
  },
  "type": "page",
  "body": {
    "type": "tpl",
    "tpl": "Hello ${text}"
  }
}
```

更多模板相关配置请看[模板文档](../../docs/concepts/template)

## 属性表

| 属性名    | 类型                                 | 默认值  | 说明            |
| --------- | ------------------------------------ | ------- | --------------- |
| type      | `string`                             | `"tpl"` | 指定为 Tpl 组件 |
| className | `string`                             |         | 外层 Dom 的类名 |
| tpl       | [模板](../../docs/concepts/template) |         | 配置模板        |

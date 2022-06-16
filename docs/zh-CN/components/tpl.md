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

## 快速编辑

通过 `quickEdit` 开启快速编辑功能，比如

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "static",
            "type": "static",
            "label": "静态展示",
            "value": "123",
            "quickEdit": {
                "type": "number"
            }
        }
    ]
}
```

其他配置项参考 [快速编辑](crud#快速编辑)

## 属性表

| 属性名          | 类型                                 | 默认值  | 说明                                         |
| --------------- | ------------------------------------ | ------- | -------------------------------------------- |
| type            | `string`                             | `"tpl"` | 指定为 Tpl 组件                              |
| className       | `string`                             |         | 外层 Dom 的类名                              |
| tpl             | [模板](../../docs/concepts/template) |         | 配置模板                                     |
| showNativeTitle | `boolean`                            |         | 是否设置外层 DOM 节点的 title 属性为文本内容 |

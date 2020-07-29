---
title: Wrapper 包裹容器
description:
type: 0
group: ⚙ 组件
menuName: Wrapper
icon:
order: 72
---

简单的一个包裹容器组件

## 基本用法

```schema:height="200" scope="body"
{
    "type": "wrapper",
    "body": "内容",
    "className": "b"
}
```

## 不同内边距

通过配置`size`属性，可以调整内边距

```schema:height="550" scope="body"
[
  {
    "type": "wrapper",
    "body": "默认内边距",
    "className": "b"
  },
  {
    "type": "divider"
  },
  {
    "type": "wrapper",
    "body": "极小的内边距",
    "size": "xs",
    "className": "b"
  },
  {
    "type": "divider"
  },
  {
    "type": "wrapper",
    "body": "小的内边距",
    "size": "sm",
    "className": "b"
  },
  {
    "type": "divider"
  },
  {
    "type": "wrapper",
    "body": "中等的内边距",
    "size": "md",
    "className": "b"
  },
  {
    "type": "divider"
  },
  {
    "type": "wrapper",
    "body": "大的内边距",
    "size": "lg",
    "className": "b"
  },
  {
    "type": "divider"
  },
  {
    "type": "wrapper",
    "body": "无内边距",
    "size": "none",
    "className": "b"
  }
]
```

## 属性表

| 属性名    | 类型                              | 默认值      | 说明                         |
| --------- | --------------------------------- | ----------- | ---------------------------- |
| type      | `string`                          | `"wrapper"` | 指定为 Wrapper 渲染器        |
| className | `string`                          |             | 外层 Dom 的类名              |
| size      | `string`                          |             | 支持: `xs`、`sm`、`md`和`lg` |
| body      | [SchemaNode](../types/schemanode) |             | 内容容器                     |

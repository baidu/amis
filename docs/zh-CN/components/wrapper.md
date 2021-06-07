---
title: Wrapper 包裹容器
description:
type: 0
group: ⚙ 组件
menuName: Wrapper
icon:
order: 72
---

简单的一个包裹容器组件，相当于用 div 包含起来，最大的用处是用来配合 css 进行布局。

## 基本用法

```schema: scope="body"
{
    "type": "wrapper",
    "body": "内容",
    "className": "b"
}
```

> 上面例子中的 `"className": "b"` 是为了增加边框，不然看不出来。

## 动态获取

直接返回一个对象

```schema: scope="body"
{
  "type": "page",
  "data": {
    "style": {
      "color": "#aaa"
    }
  },
  "body": [
    {
      "type": "wrapper",
      "body": "内容",
      "className": "b",
      "style": "${style}"
    }
  ]
}
```

返回变量

```schema: scope="body"
{
  "type": "page",
  "data": {
    "color": "#aaa"
  },
  "body": [
    {
      "type": "wrapper",
      "body": "内容",
      "className": "b",
      "style": {
        "color": "${color}",
        "fontSize": "30px"
      }
    }
  ]
}
```

## 不同内边距

通过配置`size`属性，可以调整内边距

```schema: scope="body"
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

## style

> 1.1.5 版本

wrapper 可以设置 style，当成一个 `div` 标签来用

## 属性表

| 属性名    | 类型                                      | 默认值      | 说明                         |
| --------- | ----------------------------------------- | ----------- | ---------------------------- |
| type      | `string`                                  | `"wrapper"` | 指定为 Wrapper 渲染器        |
| className | `string`                                  |             | 外层 Dom 的类名              |
| size      | `string`                                  |             | 支持: `xs`、`sm`、`md`和`lg` |
| style     | `Object` \| `string`                      |             | 自定义样式                   |
| body      | [SchemaNode](../../docs/types/schemanode) |             | 内容容器                     |

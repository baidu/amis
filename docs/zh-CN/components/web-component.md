---
title: Web Component
description:
type: 0
group: ⚙ 组件
menuName: WebComponent
icon:
order: 73
---

专门用来渲染 web component 的组件，可以通过这种方式来扩展 amis 组件，比如使用 Angular。

## 基本用法

比如下面这个 web component

```
<random-number prefix="hello" class="my-class"></random-number>
```

使用 amis 可以这样渲染出来

```schema: scope="body"
{
    "type": "web-component",
    "tag": "random-number",
    "props": {
      "prefix": "hello",
      "class": "my-class"
    }
}
```

其中 `tag` 指定标签，属性放在 `props` 对象里，props 里的值支持变量替换，比如：

```schema
{
  "data": {
    "text": "World"
  },
  "type": "page",
  "body": {
    "type": "web-component",
    "tag": "random-number",
    "props": {
      "prefix": "${text}"
    }
  }
}

```

## 属性表

| 属性名 | 类型                                      | 默认值            | 说明                          |
| ------ | ----------------------------------------- | ----------------- | ----------------------------- |
| type   | `string`                                  | `"web-component"` | 指定为 web-component 渲染器   |
| tag    | `string`                                  |                   | 具体使用的 web-component 标签 |
| props  | `object`                                  |                   | 标签上的属性                  |
| body   | [SchemaNode](../../docs/types/schemanode) |                   | 子节点                        |

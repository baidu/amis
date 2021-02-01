---
title: Container 容器
description:
type: 0
group: ⚙ 组件
menuName: Container 容器
icon:
order: 38
---

Container 是一种容器组件，它可以渲染其他 amis 组件

## 基本用法

```schema: scope="body"
{
    "type": "container",
    "body":"这里是容器内容区"
}
```

### style

container 可以通过 style 来设置样式，比如背景色或背景图，注意这里的属性是使用驼峰写法，是 `backgroundColor` 而不是 `background-color`。

```schema: scope="body"
{
    "type": "container",
    "style": {
        "backgroundColor": "#C4C4C4"
    },
    "body":"这里是容器内容区"
}
```

## 属性表

| 属性名        | 类型                                      | 默认值    | 说明                |
| ------------- | ----------------------------------------- | --------- | ------------------- |
| type          | `string`                                  | `"alert"` | 指定为 alert 渲染器 |
| className     | `string`                                  |           | 外层 Dom 的类名     |
| bodyClassName | `string`                                  |           | 容器内容区的类名    |
| style         | `Object`                                  |           | 自定义样式          |
| body          | [SchemaNode](../../docs/types/schemanode) |           | 容器内容            |

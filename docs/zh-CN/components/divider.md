---
title: Divider 分割线
description:
type: 0
group: ⚙ 组件
menuName: Divider 分割线
icon:
order: 42
---

## 基本用法

```schema: scope="body"
{
    "type": "divider"
}
```

## 不同样式

```schema: scope="body"
[
    {
        "type": "divider",
        "lineStyle": "solid"
    },
    {
        "type": "divider",
        "lineStyle": "dashed"
    }
]
```

## 带标题的分割线

> `3.5.0`及以上版本

```schema: scope="body"
[
    {
        "type": "divider",
        "title": "Text",
        "titlePosition": "left"
    },
    {
        "type": "divider",
        "title": "Text",
        "titlePosition": "center"
    },
    {
        "type": "divider",
        "title": "Text",
        "titlePosition": "right"
    }
]
```

## 属性表

| 属性名    | 类型     | 默认值       | 说明                                       |    版本    |
| --------- | -------- | ------------ | --------------------------------------- |---------- |
| type      | `string` |              | `"divider"` 指定为 分割线 渲染器           |
| className | `string` |              | 外层 Dom 的类名                            |
| lineStyle | `string` | `solid`      | 分割线的样式，支持`dashed`和`solid`        |
| direction | `string` | `horizontal` | 分割线的方向，支持`horizontal`和`vertical` |     `3.5.0` |
| color     | `string` |              | 分割线的颜色                               |     `3.5.0` |
| rotate    | `number` |              | 分割线的旋转角度                           |     `3.5.0` |
| title     | [SchemaNode](../../docs/types/schemanode) |    |    分割线的标题    |      `3.5.0` |
| titleClassName | `string` |         | 分割线的标题类名                           |      `3.5.0` |        
| titlePosition    | `string` | `center`| 分割线的标题位置，支持`left`、`center`和`right` | `3.5.0` |
   

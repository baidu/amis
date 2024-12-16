---
title: Shape 形状
description:
type: 0
group: ⚙ 组件
menuName: Tabs
icon:
---

用于展示形状

## 基本用法

```schema
{
    type: "page",
    body: [
      {
        type: 'shape',
        className: 'm-2',
        shapeType: 'triangle'
      },
      {
        type: 'shape',
        className: 'm-2',
        shapeType: 'square'
      },
      {
        type: 'shape',
        className: 'm-2',
        shapeType: 'pentagon'
      },
      {
        type: 'shape',
        className: 'm-2',
        shapeType: 'star'
      }
    ]
}
```

## 配置大小

```schema
{
    type: "page",
    body: [
      {
        type: 'shape',
        className: 'm-2',
        shapeType: 'triangle',
        size: 100
      },
      {
        type: 'shape',
        className: 'm-2',
        shapeType: 'square',
        size: 100
      },
      {
        type: 'shape',
        className: 'm-2',
        shapeType: 'pentagon',
        size: 100
      }
    ]
}
```

## 配置圆角

```schema
{
    type: "page",
    body: [
      {
        type: 'shape',
        className: 'm-2',
        shapeType: 'triangle',
        radius: 4
      },
      {
        type: 'shape',
        className: 'm-2',
        shapeType: 'square',
        radius: 4
      },
      {
        type: 'shape',
        className: 'm-2',
        shapeType: 'pentagon',
        radius: 4
      }
    ]
}
```

## 更多图形

```schema
{
  type: "page",
  body: [
    {
      type: 'shape',
      className: 'm-2',
      shapeType: 'triangle',
      size: 50
    },
    {
      type: 'shape',
      className: 'm-2',
      shapeType: 'square',
      size: 50
    },
    {
      type: 'shape',
      className: 'm-2',
      shapeType: 'convex-arc-rectangle',
      size: 50
    },
    {
      type: 'shape',
      className: 'm-2',
      shapeType: 'convex-arc-rectangle',
      size: 50,
      radius: 4
    },
    {
      type: 'shape',
      className: 'm-2',
      shapeType: 'concave-arc-rectangle',
      size: 50,
      radius: 4
    },
    {
      type: 'shape',
      className: 'm-2',
      shapeType: 'double-arc-rectangle',
      size: 50,
      radius: 4
    },
    {
      type: 'shape',
      className: 'm-2',
      size: 50,
      shapeType: 'pentagon'
    },
    {
      type: 'shape',
      className: 'm-2',
      size: 50,
      shapeType: 'hexagon'
    },
    {
      type: 'shape',
      className: 'm-2',
      size: 50,
      shapeType: 'star'
    },
    {
      type: 'shape',
      className: 'm-2',
      size: 50,
      shapeType: 'hexagon-star'
    },
    {
      type: 'shape',
      className: 'm-2',
      size: 50,
      shapeType: 'heart'
    },
    {
      type: 'shape',
      className: 'm-2',
      size: 50,
      shapeType: 'circle'
    }
  ]
}
```

## 属性表

| 属性名    | 类型         | 默认值    | 说明                |
| --------- | ------------ | --------- | ------------------- |
| type      | `string`     | `'shape'` | 指定为图形渲染器    |
| shapeType | `IShapeType` | `'-'`     | 图形类型            |
| className | `string`     |           | 自定义 CSS 样式类名 |
| size      | `number`     | `200`     | 图形大小            |
| radius    | `number`     | `0`       | 圆角大小（1-10）    |

### IShapeType 类型

| 类型                    | 说明     |
| ----------------------- | -------- |
| `square`                | 正方形   |
| `triangle`              | 三角形   |
| `rectangle`             | 矩形     |
| `convex-arc-rectangle`  | 上凸矩形 |
| `concave-arc-rectangle` | 上凹矩形 |
| `double-arc-rectangle`  | 双凸矩形 |
| `pentagon`              | 五边形   |
| `hexagon`               | 六边形   |
| `star`                  | 五角星   |
| `hexagon-star`          | 六角星   |
| `heart`                 | 心形     |
| `circle`                | 圆形     |

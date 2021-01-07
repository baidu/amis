---
title: Grid 2D 布局
description:
type: 0
group: ⚙ 组件
menuName: Grid 2D 组件
icon:
order: 47
---

## 基本用法

```schema: scoped="body"
{
  "type": "grid-2d",
  "grids": [
    {
      "x": 1,
      "y": 1,
      "h": 1,
      "w": 6,
      "className": "bg-green-300",
      "type": "tpl",
      "tpl": "grid 1"
    },
    {
      "x": 7,
      "y": 1,
      "h": 1,
      "w": 6,
      "className": "bg-blue-300",
      "type": "tpl",
      "tpl": "grid 2"
    },
    {
      "x": 1,
      "y": 2,
      "h": 2,
      "w": 4,
      "className": "bg-red-300",
      "type": "tpl",
      "tpl": "grid 3"
    },
    {
      "x": 5,
      "y": 2,
      "h": 1,
      "w": 8,
      "className": "bg-purple-300",
      "type": "tpl",
      "tpl": "grid 4"
    }
  ]
}
```

## grid 布局设置

grids 中可以是任意组件，这里为了简化使用 tpl 组件，通过 x/y/h/w 这四个属性来控制格子的位置和大小。

首先看下图示例，它就是前面基本用法的示例加上标注：

![grid](../../../examples/static/grid-2d.png)

默认水平方向会平分为 12 列，可以通过 `cols` 来调整，比如只分为 3 栏。

先看 `Grid 1` 的 `x/y/h/w` 值分别是 `1,1,1,6`：

- `x,y` 决定这个格子的位置，`1,1`，就是最左上角的位置
- `w` 代表宽度，因为水平方向一共 12 列，所以 6 就意味着占水平空间一半
- `h` 代表高度，这里是 1 代表占据一行，每行高度可以使用 `rowHeight` 来控制，默认是 `50px`，如果设置为 2 就意味着高度是 `100px + 行间距`

## 高宽自适应

## gap / rowGap

通过 grip 上的 gap 属性来控制间距，默认包含水平和垂直间距

```schema: scoped="body"
{
  "type": "grid-2d",
  "gap": 10,
  "gapRow": 5,
  "grids": [
    {
      "x": 1,
      "y": 1,
      "h": 1,
      "w": 6,
      "className": "bg-green-300",
      "type": "tpl",
      "tpl": "grid 1"
    },
    {
      "x": 7,
      "y": 1,
      "h": 1,
      "w": 6,
      "className": "bg-blue-300",
      "type": "tpl",
      "tpl": "grid 2"
    },
    {
      "x": 1,
      "y": 2,
      "h": 2,
      "w": 4,
      "className": "bg-red-300",
      "type": "tpl",
      "tpl": "grid 3"
    },
    {
      "x": 5,
      "y": 2,
      "h": 1,
      "w": 8,
      "className": "bg-purple-300",
      "type": "tpl",
      "tpl": "grid 4"
    }
  ]
}
```

如果设置 rowGap，则将单独设置行间距。

```schema: scoped="body"
{
  "type": "grid-2d",
  "grids": [
    {
      "x": 2,
      "y": 2,
      "h": 1,
      "w": 6,
      "type": "panel",
      "title": "面板标题",
      "body": "面板内容"
    }
  ]
}
```

## 属性表

| 属性名     | 类型                              | 默认值      | 说明                                      |
| ---------- | --------------------------------- | ----------- | ----------------------------------------- |
| type       | `string`                          | `"grid-2d"` | 指定为 Grid 2D 渲染器                     |
| className  | `string`                          |             | 外层 Dom 的类名                           |
| gap        | `int`/`string`                    | 0           | 格子间距，包括水平和垂直                  |
| cols       | `int`                             | 12          | 格子水平划分为几个区域                    |
| rowGap     | `int`/`string`                    |             | 格子垂直间距                              |
| grids      | `Array`                           |             | 格子集合                                  |
| grids[x]   | [SchemaNode](../types/schemanode) |             | 格子可以是其他渲染器                      |
| grids[x].x | `int`                             |             | 格子起始位置的横坐标                      |
| grids[x].y | `int`                             |             | 格子起始位置的纵坐标                      |
| grids[x].w | `int`/'auto'                      |             | 格子横跨几个宽度，auto 是自动根据内容撑开 |
| grids[x].h | `int`/'auto'                      |             | 格子横跨几个高度，auto 是自动根据内容撑开 |

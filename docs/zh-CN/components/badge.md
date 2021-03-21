---
title: Badge 角标
description:
type: 0
group: ⚙ 组件
menuName: Badge
icon:
order: 30
---

## 基本用法

Badge 一般配合其他组件使用，它可以包裹任意组件，比如按钮

```schema: scope="body"
{
  "type": "badge",
  "body": {
    "label": "按钮",
    "type": "button"
  }
}
```

## 显示文字或数值

设置 `mode` 为 `text`，通过 `text` 属性来显示文字或数字，数值为零的时候将不显示。

```schema: scope="body"
[
  {
    "type": "badge",
    "mode": "text",
    "text": 10,
    "body": {
      "label": "按钮",
      "type": "button"
    }
  },
  {
    "type": "badge",
    "mode": "text",
    "text": 0,
    "className": "m-l",
    "body": {
      "label": "按钮",
      "type": "button"
    }
  },
    {
    "type": "badge",
    "mode": "text",
    "text": "new",
    "className": "m-l",
    "body": {
      "label": "按钮",
      "type": "button"
    }
  }
]
```

## 显示位置

通过 `position` 来控制角标显示位置，默认 `top-right`，还可以设置为 `top-left`、`bottom-left`、`bottom-right`。

```schema: scope="body"
[
  {
    "type": "badge",
    "position": "top-left",
    "body": {
      "label": "按钮",
      "type": "button"
    }
  },
  {
    "type": "badge",
    "position": "bottom-left",
    "className": "m-l",
    "body": {
      "label": "按钮",
      "type": "button"
    }
  },
  {
    "type": "badge",
    "position": "bottom-right",
    "className": "m-l",
    "body": {
      "label": "按钮",
      "type": "button"
    }
  }
]
```

## 动态数字

`text` 可以取上下文变量。

```schema
{
  "data": {
    "myData": 10
  },
  "type": "page",
  "body": [
    {
      "type": "badge",
      "mode": "text",
      "displayOn": "this.myData > 1",
      "text": "${myData}",
      "body": {
        "label": "按钮 1",
        "type": "button"
      }
    }
  ]
}
```

## 动态控制是否显示角标

通过 `displayOn` 表达式来动态控制是否显示角标

```schema
{
  "data": {
    "myData": 10
  },
  "type": "page",
  "body": [
    {
      "type": "badge",
      "displayOn": "this.myData > 1",
      "body": {
        "label": "按钮 1",
        "type": "button"
      }
    },
    {
      "type": "badge",
      "displayOn": "this.myData > 10",
      "body": {
        "label": "按钮 2",
        "className": "m-l",
        "type": "button"
      }
    }
  ]
}
```

## 设置大小

通过 `size` 来控制大小

```schema: scope="body"
[
  {
    "type": "badge",
    "mode": "text",
    "text": 10,
    "size": 20,
    "body": {
      "label": "按钮 1",
      "type": "button"
    }
  },
  {
    "type": "badge",
    "mode": "text",
    "text": 10,
    "size": 12,
    "className": "m-l",
    "body": {
      "label": "按钮 2",
      "type": "button"
    }
  },
  {
    "type": "badge",
    "size": 12,
    "className": "m-l",
    "body": {
      "label": "按钮 3",
      "type": "button"
    }
  },
  {
    "type": "badge",
    "size": 4,
    "className": "m-l",
    "body": {
      "label": "按钮 3",
      "type": "button"
    }
  }
]
```

## 自定义样式

通过 `style` 来控制展现样式，比如背景及文字的颜色

```schema: scope="body"
[
  {
    "type": "badge",
    "mode": "text",
    "text": 10,
    "badgeStyle": {
      "background": "#46C93A"
    },
    "body": {
      "label": "按钮 1",
      "type": "button"
    }
  },
  {
    "type": "badge",
    "mode": "text",
    "text": 10,
    "badgeStyle": {
      "background": "#1A5CFF"
    },
    "className": "m-l",
    "body": {
      "label": "按钮 2",
      "type": "button"
    }
  }
]
```

## 属性表

| 属性名     | 类型                                   | 默认值 | 说明                      |
| ---------- | -------------------------------------- | ------ | ------------------------- |
| className  | `string`                               |        | 外层 Dom 的类名           |
| body       | [SchemaNode](../docs/types/schemanode) |        | 被包裹的节点              |
| text       | `text`                                 |        | 数字                      |
| mode       | `string`                               |        | 角标类型，可以是 dot/text |
| className  | `string`                               |        | 外层 dom 的类名           |
| style      | `object`                               |        | 外层 dom 的自定义样式     |
| badgeStyle | `object`                               |        | 角标的自定义样式          |

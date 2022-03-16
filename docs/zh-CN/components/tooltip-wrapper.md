---
title: TooltipWrapper 文字提示容器
description:
type: 0
group: ⚙ 功能
menuName: TooltipWrapper
icon:
order: 59
---

## 基本配置

当用户鼠标悬停或者点击元素时，显示文字提示浮层，`title`可以为浮层添加标题。

```schema: scope="body"
[
  {
    "type": "flex",
    "justify": "space-around",
    "alignItems": "center",
    "direction": "row",
    "style": {
      "width": 350,
      "height": 30
    },
    "items": [
      {
        "type": "tooltip-wrapper",
        "content": "提示文字",
        "body": "hover 激活文字提示",
        "className": "mb-1"
      },
      {
        "type": "tooltip-wrapper",
        "title": "标题",
        "content": "提示文字",
        "trigger": "click",
        "body": "click 激活文字提示",
        "className": "mb-1"
      }
    ]
  }
]
```

`body`支持传入多个子元素：

```schema: scope="body"
[
  {
    "type": "tooltip-wrapper",
    "content": "删除提示",
    "inline": true,
    "body": [
      {
        "type": "tpl",
        "tpl": "删除"
      },
      {
        "className": "ml-1",
        "type": "icon",
        "icon": "trash"
      }
    ]
  }
]
```

## 提示位置

提供四种不同方向的展示方式：`'top' | 'left' | 'right' | 'bottom'`。

```schema: scope="body"
{
  "type": "flex",
  "justify": "space-around",
  "alignItems": "center",
  "direction": "column",
  "items": [
    {
      type: "flex",
      "justify": "center",
      "alignItems": "center",
      "direction": "row",
      "style": {
        "width": 100,
        "height": 30
      },
      "items": [
        {
          "type": "tooltip-wrapper",
          "content": "提示文字",
          "body": [
            {
              "type": "icon",
              "icon": "arrow-circle-up",
              "className": "mr-1"
            },
            {
              type: "tpl",
              "tpl": "上"
            }
          ]
        }
      ]
    },
    {
      type: "flex",
      "justify": "space-around",
      "alignItems": "center",
      "direction": "row",
      "style": {
        "width": 200,
        "height": 30
      },
      "items": [
        {
          "type": "tooltip-wrapper",
          "content": "提示文字",
          "placement": "left",
          "body": [
            {
              "type": "icon",
              "icon": "arrow-circle-left",
              "className": "mr-1"
            },
            {
              type: "tpl",
              "tpl": "左"
            }
          ]
        },
        {
          "type": "tooltip-wrapper",
          "content": "提示文字",
          "placement": "right",
          "body": [
            {
              "type": "icon",
              "icon": "arrow-circle-right",
              "className": "mr-1"
            },
            {
              type: "tpl",
              "tpl": "右"
            }
          ]
        }
      ]
    },
    {
      type: "flex",
      "justify": "center",
      "alignItems": "center",
      "direction": "row",
      "style": {
        "width": 100,
        "height": 30
      },
      "items": [
        {
          "type": "tooltip-wrapper",
          "content": "提示文字",
          "placement": "bottom",
          "body": [
            {
              "type": "icon",
              "icon": "arrow-circle-down",
              "className": "mr-1"
            },
            {
              type: "tpl",
              "tpl": "下"
            }
          ]
        }
      ]
    }
  ]
}
```

## 位置偏移

组件提供了关于相对提示位置的垂直、水平位置上的偏移，默认[0, 0]。

```schema: scope="body"
[
  {
    "type": "tooltip-wrapper",
    "title": "标题",
    "content": "文案提示位置偏移 [10, -20]",
    "offset": [10, -20],
    "inline": true,
    "className": "mr-2",
    "body": [
      {
        "type": "tpl",
        "tpl": "向右偏移10px向上偏移20px"
      }
    ]
  }
]

```

## 展示箭头

`showArrow` 为 `false` 不展示箭头。

```schema: scope="body"
[
  {
    "type": "tooltip-wrapper",
    "title": "标题",
    "content": "提示内容",
    "showArrow": false,
    "inline": true,
    "className": "mr-2",
    "body": [
      {
        "type": "tpl",
        "tpl": "没有箭头"
      }
    ]
  }
]

```

## 主题色

组件提供了两个不同的主题：`dark` 和 `light`，默认使用`light`。

```schema: scope="body"
[
  {
    "type": "tooltip-wrapper",
    "title": "标题",
    "content": "文案提示",
    "inline": true,
    "className": "mr-2",
    "body": [
      {
        "type": "tpl",
        "tpl": "light主题提示"
      }
    ]
  },
  {
    "type": "tooltip-wrapper",
    "title": "标题",
    "content": "文案提示",
    "inline": true,
    "tooltipTheme": "dark",
    "body": [
      {
        "type": "tpl",
        "tpl": "dark主题提示"
      }
    ]
  }
]

```

## 延迟打开&关闭

`mouseEnterDelay` 为延迟展示, `mouseLeaveDelay` 为延迟隐藏，

```schema: scope="body"
[
  {
    "type": "tooltip-wrapper",
    "title": "标题",
    "content": "提示内容",
    "mouseEnterDelay": 1000,
    "mouseLeaveDelay": 2000,
    "inline": true,
    "className": "mr-2",
    "body": [
      {
        "type": "tpl",
        "tpl": "延迟1s展示，延迟2s隐藏"
      }
    ]
  }
]

```

## 动态文案

`content` 和 `title` 支持变量映射，可以从上下文中动态获取提示文案。

```schema
{
  "type": "page",
  "data": {
    "text": "The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis."
  },
  body: {
    "type": "tooltip-wrapper",
    "content": "${text}",
    "body": {
      "type": "html",
      "style": {
        "overflow": "hidden",
        "textOverflow": "ellipsis",
        "whiteSpace": "nowrap",
        "maxWidth": "300px",
        "display": "inline-block"
      },
      "html": "${text}"
    }
  }
}
```

## 内联展示

设置`"inline": true`使容器内联展示

```schema: scope="body"
[
  {
    "type": "tooltip-wrapper",
    "content": "文字提示",
    "inline": true,
    "className": "p-1 mr-3 border-2 border-solid border-indigo-400",
    "body": "内联容器1"
  },
  {
    "type": "tooltip-wrapper",
    "content": "文字提示",
    "inline": true,
    "className": "p-1 mr-3 border-2 border-solid border-indigo-400",
    "body": "内联容器2"
  },
  {
    "type": "tooltip-wrapper",
    "content": "文字提示",
    "className": "p-1 mt-3 border-2 border-solid border-green-400",
    "body": "非内联容器"
  }
]

```

## 自定义样式

使用`style`控制内容区样式，`tooltipStyle`控制浮层区样式

```schema: scope="body"
{
  "type": "tooltip-wrapper",
  "content": "文字提示(加粗)",
  "inline": true,
  "style": {
    fontStyle: "italic"
  },
  "tooltipStyle": {
    fontWeight: "bold"
  },
  "body": [
    {
      "type": "tpl",
      "tpl": "一段文案"
    }
  ]
}
```

## 自定义包裹标签

使用`wrapperComponent`修改标签名，可以让容器使用其他标签渲染：

```schema: scope="body"
{
  "type": "tooltip-wrapper",
  "content": "文字提示",
  "wrapperComponent": "pre",
  "body": "function HelloWorld() {\n    console.log('Hello World');\n}"
}
```

## 属性表

| 属性名           | 类型                                                                    | 默认值              | 说明                                           |
| ---------------- | ----------------------------------------------------------------------- | ------------------- | ---------------------------------------------- |
| type             | `string`                                                                | `"tooltip-wrapper"` | 指定为文字提示容器组件                         |
| title            | `string`                                                                | `""`                | 文字提示标题                                   |
| content          | `string`                                                                | `""`                | 文字提示内容, 兼容之前的 tooltip 属性          |
| placement        | `"top" \| "left" \| "right" \| "bottom" `                               | `"top"`             | 文字提示浮层出现位置                           |
| tooltipTheme     | `"light" \| "dark"`                                                     | `"light"`           | 主题样式， 默认为 light                        |
| offset           | `[number, number]`                                                      | `[0, 0]`            | 文字提示浮层位置相对偏移量，单位 px            |
| showArrow        | `boolean`                                                               | `true`              | 是否展示浮层指向箭头                           |
| disabled         | `boolean`                                                               | `false`             | 是否禁用浮层提示                               |
| trigger          | `"hover" \| "click" \| "focus" \| Array<"hover" \| "click" \| "focus">` | `"hover"`           | 浮层触发方式，支持数组写法`["hover", "click"]` |
| mouseEnterDelay  | `number`                                                                | `0`                 | 浮层延迟展示时间，单位 ms                      |
| mouseLeaveDelay  | `number`                                                                | `300`               | 浮层延迟隐藏时间，单位 ms                      |
| rootClose        | `boolean`                                                               | `true`              | 是否点击非内容区域关闭提示                     |
| inline           | `boolean`                                                               | `false`             | 内容区是否内联显示                             |
| wrapperComponent | `string`                                                                | `"div" \| "span"`   | 容器标签名                                     |
| body             | [SchemaNode](../../docs/types/schemanode)                               | -                   | 内容容器                                       |
| style            | `Object` \| `string`                                                    |                     | 内容区自定义样式                               |
| tooltipStyle     | `Object` \| `string`                                                    |                     | 浮层自定义样式                                 |
| className        | `string`                                                                |                     | 内容区类名                                     |
| tooltipClassName | `string`                                                                |                     | 文字提示浮层类名                               |

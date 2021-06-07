---
title: Group 表单项组
description:
type: 0
group: null
menuName: Group
icon:
order: 24
---

表单项，默认都是一行显示一个，Group 组件用于在一行展示多个表单项，会自动根据表单项数量均分宽度。

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "group",
      "body": [
        {
          "type": "input-text",
          "name": "text1",
          "label": "文本1"
        },
        {
          "type": "input-text",
          "name": "text2",
          "label": "文本2"
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "group",
      "body": [
        {
          "type": "input-text",
          "name": "text3",
          "label": "文本3"
        },
        {
          "type": "input-text",
          "name": "text4",
          "label": "文本4"
        },
        {
          "type": "input-text",
          "name": "text5",
          "label": "文本5"
        }
      ]
    }
  ]
}
```

## 展示

可以给`group`组件设置`mode`调整展示模式，用法同 [Form 展示](./index#%E8%A1%A8%E5%8D%95%E5%B1%95%E7%A4%BA)

下面`group`我们配置了`"mode": "horizontal"`，观察显示情况

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-text",
      "name": "text",
      "label": "文本"
    },
    {
      "type": "divider"
    },
    {
      "type": "group",
      "mode": "horizontal",
      "body": [
        {
          "type": "input-text",
          "name": "text1",
          "label": "文本1"
        },

        {
          "type": "input-text",
          "name": "text2",
          "label": "文本2"
        }
      ]
    }
  ]
}
```

当表单在水平模式下时，如果`group`内表单项设置`"label": false`，会导致布局错乱，如下

```schema: scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "body": [
    {
        "type": "input-text",
        "name": "text",
        "label": "文本"
    },
    {
        "type": "divider"
    },
    {
      "type": "group",
      "body": [
        {
          "type": "input-text",
          "name": "text1",
          "label": false
        },
        {
          "type": "input-text",
          "name": "text2",
          "label": false
        }
      ]
    }
  ]
}
```

这时可以给`group`配置`label`属性，保持和其他表单项布局统一

```schema: scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "body": [
    {
        "type": "input-text",
        "name": "text",
        "label": "文本"
    },
    {
        "type": "divider"
    },
    {
      "type": "group",
      "label": "文本组",
      "body": [
        {
          "type": "input-text",
          "name": "text1",
          "label": false
        },
        {
          "type": "input-text",
          "name": "text2",
          "label": false
        }
      ]
    }
  ]
}
```

## 属性表

| 属性名    | 类型                        | 默认值         | 说明                                                                       |
| --------- | --------------------------- | -------------- | -------------------------------------------------------------------------- |
| className | `string`                    |                | CSS 类名                                                                   |
| label     | `string`                    |                | group 的标签                                                               |
| body      | Array<[表单项](./formitem)> |                | 表单项集合                                                                 |
| mode      | `string`                    |                | 展示默认，同 [Form](./index#%E8%A1%A8%E5%8D%95%E5%B1%95%E7%A4%BA) 中的模式 |
| gap       | `string`                    |                | 表单项之间的间距，可选：`xs`、`sm`、`normal`                               |
| direction | `string`                    | `"horizontal"` | 可以配置水平展示还是垂直展示。对应的配置项分别是：`vertical`、`horizontal` |

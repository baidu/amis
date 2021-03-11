---
title: Tabs 选项卡
description:
type: 0
group: null
menuName: Tabs 选项卡
icon:
order: 53
---

有多组输入框时，也可以通过选项卡来分组。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "controls": [
      {
      "type": "tabs",
      "tabs": [
        {
          "title": "基本配置",
          "controls": [
            {
              "name": "text1",
              "type": "text",
              "label": "文本1"
            },

            {
              "name": "text2",
              "type": "text",
              "label": "文本2"
            }
          ]
        },

        {
          "title": "其他配置",
          "controls": [
            {
              "name": "text3",
              "type": "text",
              "label": "文本3"
            },

            {
              "name": "text4",
              "type": "text",
              "label": "文本4"
            }
          ]
        }
      ]
    }
  ]
}
```

## 更多功能

请参考[这里](../tabs)。

## 属性表

请参考[这里](../tabs#属性表)。

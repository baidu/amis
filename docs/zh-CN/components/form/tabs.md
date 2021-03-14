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

## 同步表单值

默认 Tabs 只是展示，如果希望把当前 tab 作为值提交给后端，则可以配置 `name` 来同步，意味着切换 tab 会写入值，如果外部修改了这个值，tabs 也会相应的切换到对应的 tab。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "controls": [
      {
      "type": "radios",
      "name": "tabs",
      "value": "tab2",
      "label": "Tabs值",
      "mode": "normal",
      "options": [
        {
          "label": "基本信息",
          "value": "tab1"
        },
        {
          "label": "其他信息",
          "value": "tab2"
        }
      ]
    },

    {
      "type": "tabs",
      "name": "tabs",
      "tabs": [
        {
          "title": "基本配置",
          "value": "tab1",
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
          "value": "tab2",
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

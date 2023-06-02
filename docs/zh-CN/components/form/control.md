---
title: Control 表单项包裹
description:
type: 0
group: null
menuName: Control
icon:
order: 24
---

展示类的组件，如果直接放在表单项里面，不会有 `label` 和 `description` 之类的信息展示。

```schema: scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "body": [
    {
        "type": "input-text",
        "label": "文本输入"
    },

    {
      "type": "image",
      "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
    },

    {
        "type": "qr-code",
        "codeSize": 128,
        "backgroundColor": "#108cee",
        "foregroundColor": "#000",
        "value": "https://www.baidu.com"
    }
  ]
}
```

如果想像文本输入框一样，可以配置 `label` 和 `description`，则可以通过这个组件包裹一下。

```schema: scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "body": [
    {
        "type": "input-text",
        "label": "文本输入"
    },

    {
        "type": "control",
        "label": "图片",
        body: [
          {
            "type": "image",
            "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
          }
        ]
    },

    {
        "type": "control",
        "label": "二维码",
        "description": "还可以来点描述",
        body: [
          {
              "type": "qr-code",
              "codeSize": 128,
              "backgroundColor": "#108cee",
              "foregroundColor": "#000",
              "value": "https://www.baidu.com"
          }
        ]
    }
  ]
}
```

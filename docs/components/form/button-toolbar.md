---
title: Button-Toolbar 按钮工具栏
description:
type: 0
group: null
menuName: Button-Toolbar
icon:
order: 5
---

默认按钮独立配置的时候，是独占一行的，如果想让多个按钮在一起放置，可以使用 `button-toolbar` 组件

## 基本使用

```schema:height="400" scope="body"
{
    "type": "form",
    "controls": [
        {
            "type": "text",
            "name": "test",
            "label": "Text"
        },

        {
            "type": "button-toolbar",
            "label": "按钮组",
            "buttons": [
                {
                    "type": "button",
                    "label": "按钮",
                    "actionType": "dialog",
                    "dialog": {
                        "title": "提示",
                        "body": "对，你刚点击了！"
                    }
                },

                {
                    "type": "submit",
                    "label": "提交"
                },

                {
                    "type": "reset",
                    "label": "重置"
                }
            ]
        }
    ]
}
```

## 属性表

| 属性名  | 类型                        | 默认值             | 说明                      |
| ------- | --------------------------- | ------------------ | ------------------------- |
| type    | `string`                    | `"button-toolbar"` | 指定为 ButtonToolbar 组件 |
| buttons | Array<[行为按钮](./action)> |                    | 按钮组                    |

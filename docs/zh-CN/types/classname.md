---
title: ClassName
description:
type: 0
menuName: ClassName
icon:
order: 40
---

amis 中大部分的组件都支持配置 className 和 xxxClassName，他可以用来配置组件 dom 上的 css 类名，可以结合帮助类 css 来定制一些样式。具体帮助类 css 请前往[这里](../../style/index#辅助-class)。

配置方式有两种：

1. 直接配置字符串如：`className: "text-danger"` 文字标红。
2. 采用对象配置，这个用法主要是方便写表达式如：`className: {"text-danger": "this.status == 1"}` 表示当数据 status 状态是 1 时，文字飘红。

```schema
{

    "type": "page",
    "title": "引用",
    "body": [
        {
            "type": "form",
            "actions": [],
            "debug": true,
            "mode": "horizontal",
            "body": [
                {
                    "type": "radios",
                    "name": "status",
                    "value": "1",
                    "label": "状态",
                    "options": {
                        "1": "离线",
                        "2": "在线"
                    }
                },

                {
                    "type": "mapping",
                    "name": "status",
                    "label": "状态展示",
                    "map": {
                        "1": "离线",
                        "2": "在线"
                    },
                    "className": {
                        "text-muted": "this.status == '1'",
                        "text-success": "this.status == '2'"
                    }
                }
            ]
        }
    ]
}
```

---
title: Remark 标记
description:
type: 0
group: ⚙ 组件
menuName: Remark
icon:
order: 62
---

用于展示提示文本，和表单项中的 remark 属性类型。

## 基本用法

```schema
{
    "type": "page",
    "body": {
        "type": "remark",
        "content": "这是一段提醒"
    }
}
```

## 可配置标题

```schema
{
    "type": "page",
    "body": {
        "type": "remark",
        "content": {
            "title": "标题",
            "body": "这是一段提醒"
        }
    }
}
```

## 支持变量

```schema
{
    "type": "page",
    "data": {
        "github": "https://github.com/"
    },
    "body": [
        {
            "type": "remark",
            "content": "${github}"
        },
        {
            "type": "remark",
            "content": {
                "title": "${github|raw}",
                "body": "${github}"
            }
        }
    ]
}
```

## 弹出位置

```schema: scope="body"
[
    {
        "type": "remark",
        "content": "向上",
        "placement": "top"
    },
    {
        "type": "remark",
        "content": "向下",
        "placement": "bottom"
    },
    {
        "type": "remark",
        "content": "向左",
        "placement": "left"
    },
    {
        "type": "remark",
        "content": "向右",
        "placement": "right"
    }
]
```

## 属性表

| 属性名    | 类型     | 默认值                  | 说明          |
| --------- | -------- | ----------------------- | ------------- |
| type      | `string` |                         | `remark`      |
| className | `string` |                         | 外层 CSS 类名 |
| content   | `string` |                         | 提示文本      |
| placement | `string` |                         | 弹出位置      |
| trigger   | `string` | `['hover', 'focus']`    | 触发条件      |
| icon      | `string` | `fa fa-question-circle` | 图标          |

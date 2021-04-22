---
title: Markdown 渲染
description:
type: 0
group: ⚙ 组件
menuName: Markdown 渲染
icon:
order: 58
---

> 1.1.6 版本开始

## 基本用法

```schema
{
    "type": "page",
    "body": {
        "type": "markdown",
        "value": "# title\n markdown **text**"
    }
}
```

## 动态数据

动态数据可以通过 name 来关联，类似 [static](form/static) 组件

## 基于 Editor 和数据联动来实现预览功能

```schema: scope="body"
{
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
        {
            "type": "group",
            "controls": [
                {
                    "type": "editor",
                    "name": "md",
                    "language": "markdown"
                },
                {
                    "type": "markdown",
                    "name": "md"
                }
            ]
        }

    ]
}
```

## 属性表

| 属性名    | 类型     | 默认值 | 说明   |
| --------- | -------- | ------ | ------ |
| name      | `string` |        | 名称   |
| value     | `string` |        | 静态值 |
| className | `string` |        | 类名   |

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
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "group",
            "body": [
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

## 视频

可以使用 `![text](video.mp4)` 语法来嵌入视频。

## 属性表

| 属性名    | 类型     | 默认值 | 说明   |
| --------- | -------- | ------ | ------ |
| name      | `string` |        | 名称   |
| value     | `string` |        | 静态值 |
| className | `string` |        | 类名   |

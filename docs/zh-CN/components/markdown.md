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

## 加载外部 markdown 文件

> 1.6.5 及以上版本

可以通过 `src` 属性来加载外部 markdown 文件，比如

```schema: scope="body"
{
    "type": "markdown",
    "src": "/api/mock2/sample/mirror?json=%7B%22status%22%3A0%2C%22data%22%3A%22%23%23%20title%20%5Cn%20content%22%7D"
}
```

这个接口的返回格式可以是两种，一种是 JSON，类似

```
{
    "status": 0,
    "msg": "",
    "data": "markdown"
}
```

另一种是返回 `content-type` 为 `text/markdown` 或 `text/x-markdown` 的纯文本。

## 视频

可以使用 `![text](video.mp4)` 语法来嵌入视频。

## 高级配置

> 1.8.1 及以上版本

有以下配置：

- html，是否支持 html 标签，默认 false
- linkify，是否自动识别链接，默认值是 true
- breaks，是否回车就是换行，默认 false

```schema
{
    "type": "page",
    "body": {
        "type": "markdown",
        "value": "# title\n <b>markdown</b>\n http://www.github.com/",
        "options": {
            linkify: false,
            html: true,
            breaks: true
        }
    }
}
```

## 属性表

| 属性名    | 类型     | 默认值 | 说明     |
| --------- | -------- | ------ | -------- |
| name      | `string` |        | 名称     |
| value     | `string` |        | 静态值   |
| className | `string` |        | 类名     |
| src       | `Api`    |        | 外部地址 |

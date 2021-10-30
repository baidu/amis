---
title: Card 卡片
description:
type: 0
group: ⚙ 组件
menuName: Card 卡片
icon:
order: 31
---

## 基本用法

```schema: scope="body"
{
    "type": "card",
    "header": {
        "title": "标题",
        "subTitle": "副标题",
        "description": "这是一段描述",
        "avatarClassName": "pull-left thumb-md avatar b-3x m-r",
        "avatar": "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E"
    },
    "body": "这里是内容",
    "actions": [
        {
            "type": "button",
            "label": "编辑",
            "actionType": "dialog",
            "dialog": {
              "title": "编辑",
              "body": "你正在编辑该卡片"
            }
        },
        {
          "type": "button",
          "label": "删除",
          "actionType": "dialog",
          "dialog": {
            "title": "提示",
            "body": "你删掉了该卡片"
          }
        }
    ]
}
```

## 打开链接

> 1.4.0 及以上版本

通过 `href` 属性可以设置点击卡片打开外部链接

```schema: scope="body"
{
    "type": "card",
    "href": "https://github.com/baidu/amis",
    "header": {
        "title": "标题",
        "subTitle": "副标题",
        "description": "这是一段描述",
        "avatarClassName": "pull-left thumb-md avatar b-3x m-r",
        "avatar": "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E"
    },
    "body": "这里是内容",
    "actions": [
        {
            "type": "button",
            "label": "编辑",
            "actionType": "dialog",
            "dialog": {
              "title": "编辑",
              "body": "你正在编辑该卡片"
            }
        },
        {
          "type": "button",
          "label": "删除",
          "actionType": "dialog",
          "dialog": {
            "title": "提示",
            "body": "你删掉了该卡片"
          }
        }
    ]
}
```

## 点击卡片的行为

> 1.4.0 及以上版本

通过设置 `itemAction` 可以设置整个卡片的点击行为

```schema: scope="body"
{
    "type": "card",
    "itemAction": {
      "type": "button",
      "actionType": "dialog",
      "dialog": {
        "title": "详情",
        "body": "当前描述"
      }
    },
    "header": {
        "title": "标题",
        "subTitle": "副标题",
        "description": "这是一段描述",
        "avatarClassName": "pull-left thumb-md avatar b-3x m-r",
        "avatar": "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E"
    },
    "body": "这里是内容"
}
```

注意它和前面的 `href` 配置冲突，如果设置了 `href` 这个将不会生效

## 属性表

| 属性名                 | 类型                                 | 默认值                              | 说明                                   |
| ---------------------- | ------------------------------------ | ----------------------------------- | -------------------------------------- |
| type                   | `string`                             | `"card"`                            | 指定为 Card 渲染器                     |
| className              | `string`                             | `"panel-default"`                   | 外层 Dom 的类名                        |
| href                   | [模板](../../docs/concepts/template) |                                     | 外部链接                               |
| header                 | `Object`                             |                                     | Card 头部内容设置                      |
| header.className       | `string`                             |                                     | 头部类名                               |
| header.title           | [模板](../../docs/concepts/template) |                                     | 标题                                   |
| header.subTitle        | [模板](../../docs/concepts/template) |                                     | 副标题                                 |
| header.desc            | [模板](../../docs/concepts/template) |                                     | 描述                                   |
| header.avatar          | [模板](../../docs/concepts/template) |                                     | 图片                                   |
| header.avatarText      | [模板](../../docs/concepts/template) |                                     | 如果不配置图片，则会在图片处显示该文本 |
| header.highlight       | `boolean`                            |                                     | 是否显示激活样式                       |
| header.avatarClassName | `string`                             | `"pull-left thumb avatar b-3x m-r"` | 图片类名                               |
| body                   | `Array`                              |                                     | 内容容器，主要用来放置非表单项组件     |
| bodyClassName          | `string`                             | `"padder m-t-sm m-b-sm"`            | 内容区域类名                           |
| actions                | Array<[Action](./action)>            |                                     | 配置按钮集合                           |
| itemAction             | [Action](./action)                   |                                     | 点击卡片的行为                         |

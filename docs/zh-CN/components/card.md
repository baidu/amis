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
        "avatar": "raw:http://hiphotos.baidu.com/fex/%70%69%63/item/bd3eb13533fa828b13b24500f31f4134960a5a44.jpg"
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

## 属性表

| 属性名                 | 类型                                 | 默认值                              | 说明                                   |
| ---------------------- | ------------------------------------ | ----------------------------------- | -------------------------------------- |
| type                   | `string`                             | `"card"`                            | 指定为 Card 渲染器                     |
| className              | `string`                             | `"panel-default"`                   | 外层 Dom 的类名                        |
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

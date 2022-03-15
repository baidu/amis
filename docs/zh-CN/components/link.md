---
title: Link 链接
description:
type: 0
group: ⚙ 组件
menuName: Link
icon:
order: 55
---

## 基本用法

```schema
{
    "type": "page",
    "body": {
        "type": "link",
        "href": "https://www.baidu.com",
        "body": "百度一下，你就知道"
    }
}
```

## 新标签页打开

```schema
{
    "type": "page",
    "body": {
        "type": "link",
        "href": "https://www.baidu.com",
        "body": "百度一下，你就知道",
        "blank": true
    }
}
```

## 禁用超链接

```schema
{
    "type": "page",
    "body": {
        "type": "link",
        "href": "https://www.baidu.com",
        "body": "百度一下，你就知道",
        "blank": true,
        "disabled": true
    }
}
```

## 添加图标

```schema
{
    "type": "page",
    "body": {
        "type": "link",
        "href": "https://www.baidu.com",
        "body": "百度一下，你就知道",
        "blank": true,
        "icon": "fa fa-search"
    }
}
```

## 属性表

| 属性名     | 类型      | 默认值 | 说明                                                                                 |
| ---------- | --------- | ------ | ------------------------------------------------------------------------------------ |
| type       | `string`  |        | 如果在 Table、Card 和 List 中，为`"link"`；在 Form 中用作静态展示，为`"static-link"` |
| body       | `string`  |        | 标签内文本                                                                           |
| href       | `string`  |        | 链接地址                                                                             |
| blank      | `boolean` |        | 是否在新标签页打开                                                                   |
| htmlTarget | `string`  |        | a 标签的 target，优先于 blank 属性                                                   |
| title      | `string`  |        | a 标签的 title                                                                       |
| disabled   | `boolean` |        | 禁用超链接                                                                           |
| icon       | `string`  |        | 超链接图标，以加强显示                                                               |
| rightIcon  | `string`  |        | 右侧图标                                                                             |

## 事件表

| 事件名称 | 事件参数                                      | 说明 |
| -------- | --------------------------------------------- | ---- |
| click    | [动作](../../docs/concepts/event-action#动作) | 点击 |

## 动作表

暂无

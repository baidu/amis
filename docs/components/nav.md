---
title: Nav 导航
description:
type: 0
group: ⚙ 组件
menuName: Nav
icon:
order: 58
---

用于展示链接导航

## 基本用法

```schema:height="300" scope="body"
{
    "type": "nav",
    "stacked": true,
    "className": "w-md",
    "links": [
        {
            "label": "Nav 1",
            "to": "/docs/index",
            "icon": "fa fa-user",
            "active": true
        },
        {
            "label": "Nav 2",
            "to": "/docs/api"
        },
        {
            "label": "Nav 3",
            "to": "/docs/renderers"
        }
    ]
}
```

## 配置多层级

```schema:height="300" scope="body"
{
    "type": "nav",
    "stacked": true,
    "className": "w-md",
    "links": [
        {
            "label": "Nav 1",
            "to": "/docs/index",
            "icon": "fa fa-user",
            "active": true
        },
        {
            "label": "Nav 2",
            "unfolded": true,
            "children": [
                {
                    "label": "Nav 2-1",
                    "children": [
                        {
                            "label": "Nav 2-1-1",
                            "to": "/docs/api-2-1-1"
                        }
                    ]
                },
                {
                    "label": "Nav 2-2",
                    "to": "/docs/api-2-2"
                }
            ]
        },
        {
            "label": "Nav 3",
            "to": "/docs/renderers"
        }
    ]
}
```

## 横向摆放

```schema:height="300" scope="body"
{
    "type": "nav",
    "stacked": false,
    "links": [
        {
            "label": "Nav 1",
            "to": "/docs/index",
            "icon": "fa fa-user"
        },
        {
            "label": "Nav 2",
            "to": "/docs/api"
        },
        {
            "label": "Nav 3",
            "to": "/docs/renderers"
        }
    ]
}
```

## 属性表

| 属性名            | 类型                             | 默认值  | 说明                                   |
| ----------------- | -------------------------------- | ------- | -------------------------------------- |
| type              | `string`                         | `"nav"` | 指定为 Nav 渲染器                      |
| className         | `string`                         |         | 外层 Dom 的类名                        |
| stacked           | `boolean`                        | `true`  | 设置成 false 可以以 tabs 的形式展示    |
| links             | `Array`                          |         | 链接集合                               |
| links[x].label    | `string`                         |         | 名称                                   |
| links[x].to       | [模板](../concepts/template)     |         | 链接地址                               |
| links[x].icon     | `string`                         |         | 图标                                   |
| links[x].children | `Array<link>`                    |         | 子链接                                 |
| links[x].unfolded | `boolean`                        |         | 初始是否展开                           |
| links[x].active   | `boolean`                        |         | 是否高亮                               |
| links[x].activeOn | [表达式](../concepts/expression) |         | 是否高亮的条件，留空将自动分析链接地址 |

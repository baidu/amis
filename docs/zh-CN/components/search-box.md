---
title: Search Box 搜索框
description:
type: 0
group: ⚙ 组件
menuName: Search Box
icon:
---

## 基本用法

用于展示一个简单搜索框，通常需要搭配其他组件使用。比如 page 配置 `initApi` 后，可以用来实现简单数据过滤查找，`name` keywords 会作为参数传递给 page 的 `initApi`。

```schema
{
    "type": "page",
    "initApi": "/api/mock2/page/initData?keywords=${keywords}",
    "body": [
      {
        "type": "search-box",
        "name": "keywords"
      },

      {
        "type": "tpl",
        "tpl": "<p>关键字：${keywords}</p><p>返回结果：${&|json}</p>"
      }
    ]
}
```

## mini 版本

```schema
{
    "type": "page",
    "initApi": "/api/mock2/page/initData?keywords=${keywords}",
    "body": [
      {
        "type": "search-box",
        "name": "keywords",
        "mini": true
      },

      {
        "type": "tpl",
        "tpl": "<p>关键字：${keywords}</p><p>返回结果：${&|json}</p>"
      }
    ]
}
```

## 与 CRUD 搭配

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample",
    "syncLocation": false,
    "headerToolbar": [
      {
        "type": "search-box",
        "name": "keywords",
        "align": "right",
        "placeholder": "关键字检索"
      }
    ],
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "engine",
            "label": "Rendering engine"
        },
        {
            "name": "browser",
            "label": "Browser"
        },
        {
            "name": "platform",
            "label": "Platform(s)"
        },
        {
            "name": "version",
            "label": "Engine version"
        },
        {
            "name": "grade",
            "label": "CSS grade"
        }
    ]
}
```

## 与 Service 搭配

```schema
{
    "type": "page",
    "body": [
      {
        "type": "service",
        "api": "/api/mock2/page/initData?keywords=${keywords}",
        "body": [
          {
            "type": "search-box",
            "name": "keywords"
          },

          {
            "type": "tpl",
            "tpl": "<p>关键字：${keywords}</p><p>返回结果：${&|json}</p>"
          }
        ]
      }

    ]
}
```

## 属性表

| 属性名           | 类型      | 默认值 | 说明             |
| ---------------- | --------- | ------ | ---------------- |
| type             | `string`  |        | `search-box`     |
| className        | `string`  |        | 外层 CSS 类名    |
| mini             | `boolean` |        | 是否为 mini 模式 |
| searchImediately | `boolean` |        | 是否立即搜索     |

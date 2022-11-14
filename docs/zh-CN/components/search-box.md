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

## 加强样式

```schema
{
    "type": "page",
    "initApi": "/api/mock2/page/initData?keywords=${keywords}",
    "body": [
      {
        "type": "search-box",
        "name": "keywords",
        "enhance": true
      },

      {
        "type": "tpl",
        "tpl": "<p>关键字：${keywords}</p><p>返回结果：${&|json}</p>"
      }
    ]
}
```

## 可清除

```schema
{
    "type": "page",
    "initApi": "/api/mock2/page/initData?keywords=${keywords}",
    "body": [
      {
        "type": "search-box",
        "name": "keywords",
        "clearable": true
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

## 事件表

> 2.4.1 及以上版本

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                  | 说明                 |
| -------- | ------------------------- | -------------------- |
| search   | `[name]: string` 组件的值 | 点击搜索图标时触发   |
| change   | `[name]: string` 组件的值 | 输入框值变化时触发   |
| focus    | `[name]: string` 组件的值 | 输入框获取焦点时触发 |
| blur     | `[name]: string` 组件的值 | 输入框失去焦点时触发 |

## 动作表

> 2.4.1 及以上版本

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                 | 说明     |
| -------- | ------------------------ | -------- |
| clear    | -                        | 清空     |
| setValue | `value: string` 更新的值 | 更新数据 |

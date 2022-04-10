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

```schema: scope="body"
{
    "type": "nav",
    "stacked": true,
    "className": "w-md",
    "itemBadge": {
      "mode": "ribbon",
      "text": "${customText}",
      "position": "top-left",
      "visibleOn": "this.customText",
      "level": "${customLevel}"
    },
    "links": [
        {
            "label": "Nav 1",
            "to": "/docs/index",
            "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
            "active": true
        },
        {
            "label": "Nav 2",
            "to": "/docs/api",
            "customText": "HOT",
            "customLevel": "danger"
        },
        {
            "label": "Nav 3",
            "to": "/docs/renderers",
            "customText": "SUC",
            "customLevel": "success"
        },
        {
            "label": "外部地址",
            "to": "http://www.baidu.com/",
            "target": "_blank"
        }
    ]
}
```

## 配置多层级

```schema: scope="body"
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

```schema: scope="body"
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

### 响应式收纳

横向（`"stack": false`）模式下配置`overflow`，实现导航响应式收纳。

```schema: scope="body"
{
    "type": "nav",
    "stacked": false,
    "overflow": {
        "enable": true
    },
    "links": [
        {
            "label": "Nav 1",
            "to": "?to=nav1",
        },
        {
            "label": "Nav 2",
            "to": "?to=nav1"
        },
        {
            "label": "Nav 3",
            "to": "?to=nav3"
        },
        {
            "label": "Nav 4",
            "to": "?to=nav4"
        },
        {
            "label": "Nav 5",
            "to": "?to=nav5"
        },
        {
            "label": "Nav 6",
            "to": "?to=nav6"
        },
        {
            "label": "Nav 7",
            "to": "?to=nav7"
        },
         {
            "label": "Nav 8",
            "to": "?to=nav8"
        }
    ]
}
```

设置`maxVisibleCount`可以自定义强制展示的导航数量，不设置则自动处理。设置`overflowIndicator`自定义菜单按钮的图标。
设置`overflowLabel`自定义菜单按钮文本。

```schema: scope="body"
{
    "type": "nav",
    "stacked": false,
    "overflow": {
        "enable": true,
        "overflowClassName": "nav-overflow-btn",
        "overflowPopoverClassName": "nav-overflow-popover",
        "overflowIndicator": "fas fa-angle-double-down",
        "overflowLabel": "更多",
        "maxVisibleCount": 5,
    },
    "links": [
        {
            "label": "Nav 1",
            "to": "?to=nav1",
        },
        {
            "label": "Nav 2",
            "to": "?to=nav1"
        },
        {
            "label": "Nav 3",
            "to": "?to=nav3"
        },
        {
            "label": "Nav 4",
            "to": "?to=nav4"
        },
        {
            "label": "Nav 5",
            "to": "?to=nav5"
        },
        {
            "label": "Nav 6",
            "to": "?to=nav6"
        },
        {
            "label": "Nav 7",
            "to": "?to=nav7"
        },
         {
            "label": "Nav 8 Nav 8 Nav 8 Nav 8 Nav 8",
            "to": "?to=nav8"
        }
    ]
}
```

## 动态导航

通过配置 source 来实现动态生成导航，source 可以是 api 地址或者变量，比如

```schema
{
    "type": "page",
    "data": {
        "nav": [
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
    },
    "body": {
        "type": "nav",
        "stacked": true,
        "source": "${nav}"
    }
}
```

## 懒加载

可以一次只加载部分层级，更深层次的选项可以标记为 `defer` 为 true，这样只有点开的时才会加载。

```schema: scope="body"
{
    "type": "nav",
    "stacked": true,
    "source": "/api/options/nav?parentId=${value}"
}
```

## 更多操作

```schema: scope="body"
{
    "type": "nav",
    "stacked": true,
    "className": "w-md",
    "draggable": true,
    "saveOrderApi": "/api/options/nav",
    "source": "/api/options/nav?parentId=${value}",
    "itemActions": [
        {
            "type": "icon",
            "icon": "cloud",
            "visibleOn": "this.to === '?cat=1'"
        },
        {
            "type": "dropdown-button",
            "level": "link",
            "icon": "fa fa-ellipsis-h",
            "hideCaret": true,
            "buttons": [
                {
                    "type": "button",
                    "label": "编辑",

                },
                {
                    "type": "button",
                    "label": "删除"
                }
            ]
        }
    ]
}
```

## 属性表

| 属性名                            | 类型                                      | 默认值             | 说明                                                                                     |
| --------------------------------- | ----------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| type                              | `string`                                  | `"nav"`            | 指定为 Nav 渲染器                                                                        |
| className                         | `string`                                  |                    | 外层 Dom 的类名                                                                          |
| stacked                           | `boolean`                                 | `true`             | 设置成 false 可以以 tabs 的形式展示                                                      |
| source                            | `string` 或 [API](../../docs/types/api)   |                    | 可以通过变量或 API 接口动态创建导航                                                      |
| deferApi                          | [API](../../docs/types/api)               |                    | 用来延时加载选项详情的接口，可以不配置，不配置公用 source 接口。                         |
| itemActions                       | [SchemaNode](../../docs/types/schemanode) |                    | 更多操作相关配置                                                                         |
| draggable                         | `boolean`                                 |                    | 是否支持拖拽排序                                                                         |
| dragOnSameLevel                   | `boolean`                                 |                    | 仅允许同层级内拖拽                                                                       |
| saveOrderApi                      | `string` 或 [API](../../docs/types/api)   |                    | 保存排序的 api                                                                           |
| itemBadge                         | [BadgeSchema](../../components/badge)     |                    | 角标                                                                                     |
| links                             | `Array`                                   |                    | 链接集合                                                                                 |
| links[x].label                    | `string`                                  |                    | 名称                                                                                     |
| links[x].to                       | [模板](../../docs/concepts/template)      |                    | 链接地址                                                                                 |
| links[x].target                   | `string`                                  | 链接关系           |                                                                                          |
| links[x].icon                     | `string`                                  |                    | 图标                                                                                     |
| links[x].children                 | `Array<link>`                             |                    | 子链接                                                                                   |
| links[x].unfolded                 | `boolean`                                 |                    | 初始是否展开                                                                             |
| links[x].active                   | `boolean`                                 |                    | 是否高亮                                                                                 |
| links[x].activeOn                 | [表达式](../../docs/concepts/expression)  |                    | 是否高亮的条件，留空将自动分析链接地址                                                   |
| links[x].defer                    | `boolean`                                 |                    | 标记是否为懒加载项                                                                       |
| links[x].deferApi                 | [API](../../docs/types/api)               |                    | 可以不配置，如果配置优先级更高                                                           |
| overflow                          | `NavOverflow`                             |                    | 响应式收纳配置                                                                           |
| overflow.enable                   | `boolean`                                 | `false`            | 是否开启响应式收纳                                                                       |
| overflow.overflowLabel            | `string \| SchemaObject`                  |                    | 菜单触发按钮的文字                                                                       |
| overflow.overflowIndicator        | `SchemaIcon`                              | `"fa fa-ellipsis"` | 菜单触发按钮的图标                                                                       |
| overflow.maxVisibleCount          | `number`                                  |                    | 开启响应式收纳后导航最大可显示数量，超出此数量的导航将被收纳到下拉菜单中，默认为自动计算 |
| overflow.wrapperComponent         | `string`                                  |                    | 包裹导航的外层标签名，可以使用其他标签渲染                                               |
| overflow.style                    | `React.CSSProperties`                     |                    | 自定义样式                                                                               |
| overflow.overflowClassName        | `string`                                  | `""`               | 菜单按钮 CSS 类名                                                                        |
| overflow.overflowPopoverClassName | `string`                                  | `""`               | Popover 浮层 CSS 类名                                                                    |
| overflow.overflowListClassName    | `string`                                  | `""`               | 菜单外层 CSS 类名                                                                        |

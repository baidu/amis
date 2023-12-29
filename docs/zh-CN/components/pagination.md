---
title: Pagination 分页组件
description:
type: 0
group: ⚙ 组件
menuName: Pagination
icon:
order: 73
---

## 基本用法

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/crud/table",
    "body": [
        {
            "type": "pagination",
            "layout": "total,perPage,pager,go",
            "mode": "normal",
            "activePage": 2,
            "lastPage": 99999,
            "total": 999,
            "perPage": 10,
            "maxButtons": 7,
            "showPerPage": true,
            "perPageAvailable": [10, 20, 50, 100],
            "showPageInput": true,
            "disabled": false
        }
    ]
}
```

## 微型模式

> `6.0.0`及以上版本

配置`"size": "sm"`可实现微型模式


```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/crud/table",
    "body": [
        {
            "type": "pagination",
            "layout": "total,perPage,pager,go",
            "mode": "normal",
            "activePage": 1,
            "lastPage": 99999,
            "size": "sm",
            "total": 999,
            "perPage": 10,
            "maxButtons": 7,
            "showPerPage": true,
            "perPageAvailable": [10, 20, 50, 100],
            "showPageInput": true,
            "disabled": false

        }
    ]
}
```

## 简洁模式

配置`"mode": "simple"`可实现简洁模式，支持input框输入指定页码跳转，input框中也可以通过键盘上下键进行页码跳转

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/crud/table",
    "body": [
        {
            "type": "pagination",
            "mode": "simple",
            "activePage": 2,
            "hasNext": true
        }
    ]
}
```

## 属性表

| 属性名           | 类型                       | 默认值                                   | 说明                                                      | 版本 |
| ---------------- | -------------------------- | ---------------------------------------- | --------------------------------------------------------- | --- |
| type             | `string`                   | `"pagination"`                           | 指定为 Pagination 渲染器                                  |
| mode             | `normal` \| `simple`       | `normal`                                 | 迷你版本/简易版本 只显示左右箭头，配合 hasNext 使用       |
| layout           | `string` \| `string[]`     | `["pager"]`                              | 通过控制 layout 属性的顺序，调整分页结构布局              |
| maxButtons       | `number` \| `string`       | `5`                                      | 最多显示多少个分页按钮，最小为 5                          |
| total            | `number` \| `string`       |                                          | 总条数                                                    |
| activePage       | `number` \| `string`       | `1`                                      | 当前页数                                                  |
| perPage          | `number` \| `string`       | `10`                                     | 每页显示多条数据                                          |
| showPerPage      | `boolean`                  | false                                    | 是否展示 perPage 切换器 layout 和 showPerPage 都可以控制  |
| size      | `'sm' \| 'md'`               | `md`                                    | 组件尺寸，支持`md`、`sm`设置  |`6.0.0`后支持变量
| ellipsisPageGap      | `number` \| `string`                 | 5                                    | 多页跳转页数，页数较多出现`...`时点击省略号时每次前进/后退的页数，默认为5  | `6.0.0`后支持变量
| perPageAvailable | `number[]`                 | `[10, 20, 50, 100]`                      | 指定每页可以显示多少条                                    |
| showPageInput    | `boolean`                  | false                                    | 是否显示快速跳转输入框 layout 和 showPageInput 都可以控制 |
| disabled         | `boolean`                  | false                                    | 是否禁用                                                  |
| onPageChange     | page、perPage 改变时会触发 | (page: number, perPage: number) => void; | 分页改变触发                                              |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。
> | 事件名称 | 事件参数 | 说明 |
> | -------- | ------------------------------------- | ------------------------------------------- |
> | change | `page: number` 当前页码的值<br/>`perPage: number` 每页显示的记录数 | 当前页码值改变时触发 |

### change

切换页码时，通过更新 service 数据域中的 page 来实现联动刷新 table 表格数据。

```schema: scope="body"
{
    "type": "service",
    "id": "service_01",
    "api": "/api/mock2/crud/table?page=${page}",
    "data": {
        "page": 1
    },
    "body": [
        {
        "type": "table",
        "title": "表格1",
        "source": "$rows",
        "columns": [
          {
            "name": "engine",
            "label": "Engine"
          },
          {
            "name": "version",
            "label": "Version"
          }
        ]
      },
        {
            "type": "pagination",
            "activePage": "${page}",
            "hasNext": true,
            "onEvent": {
                "change": {
                    "actions": [
                        {
                            "actionType": "setValue",
                            "componentId": "service_01",
                            "args": {
                                "value": {
                                    "page": "${event.data.page}"
                                }
                            }
                        }
                    ]
                }
            }
        }
    ]
}
```

切换页码时，通过向 service 发送 page 并重新加载 service 数据来实现联动刷新 table 表格数据。

```schema: scope="body"
{
    "type": "service",
    "id": "service_02",
    "api": "/api/mock2/crud/table?page=${page}",
    "data": {
        "page": 1
    },
    "body": [
        {
        "type": "table",
        "title": "表格1",
        "source": "$rows",
        "columns": [
          {
            "name": "engine",
            "label": "Engine"
          },
          {
            "name": "version",
            "label": "Version"
          }
        ]
      },
        {
            "type": "pagination",
            "activePage": "${page}",
            "hasNext": true,
            "onEvent": {
                "change": {
                    "actions": [
                        {
                            "actionType": "reload",
                            "componentId": "service_02",
                            "data": {
                                "page": "${event.data.page}"
                            }
                        }
                    ]
                }
            }
        }
    ]
}
```

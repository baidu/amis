---
title: Pagination 分页组件
description:
type: 0
group: ⚙ 组件
menuName: Pagination
icon:
order: 73
---

分页组件

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/crud/table",
    "body": [
        {
            "type": "pagination",
            "layout": "total,pageSize,pager,go",
            "mode": "simple",
            "activePage": 2,
            "lastPage": 99999,
            "perPage": 10,
            "maxButtons": 7,
            "showPageSize": true,
            "perPageAvailable": [10, 20, 50, 100],
            "showPageInput": true,
            "disabled": true

        }
    ]
}
```
## 属性表

| 属性名        | 类型                                      | 默认值                 | 说明                                                                               |
| ------------- | ----------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------- |
| type          | `string`                  | `"pagination"` | 指定为 Pagination渲染器          |
| layout   | `string \| string[]`       | `total,pageSize,pager,go`                | 通过控制layout属性的顺序，调整分页结构布局                                                      |
| maxButtons    | `number`                                  | `7`                    | 最多显示多少个分页按钮，最小为5                                                             |
| mode     | `normal \| simple`                                  | `normal`              | 迷你版本/简易版本    主要控制每个页码显示，无边框                                    |
| lastPage    | `number`                                  |            | 总页数                                                                     |
| activePage  | `number`    |  `1`  |    当前页数    |
| perPage       | `number`                                  | `10`                   | 每页显示多条数据                                                                   |
|  showPageSize  | `boolean`  |  TRUE  |    是否展示pageSize切换器 layout和showPageSize都可以控制 |
|  perPageAvailable  | `number[]`    | `[10, 20, 50, 100]` | 指定每页可以显示多少条 |
|  hideOnSinglePage  |  `boolean`  | false    |  只有一页时是否隐藏分页器  |
|  disabled  |  `boolean`  | false    |  是否禁用  |
| onPageChange      | page、pageSize改变时会触发         | (page: number, perPage: number) => void;              | 分页改变触发 |
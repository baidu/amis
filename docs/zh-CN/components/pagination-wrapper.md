---
title: PaginationWrapper 分页容器
description:
type: 0
group: ⚙ 组件
menuName: PaginationWrapper
icon:
order: 59
---

分页容器组件，可以用来对已有列表数据做分页处理。

- 输入：默认读取作用域中的 items 变量，如果是其他变量名请配置 `inputName`。
- 输出：经过分页处理后会把分页后的数据下发给 `outputName` （默认也是 items）对应的数据。

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/crud/table",
    "body": [
        {
            "type": "pagination-wrapper",
            "inputName": "rows",
            "outputName": "rows",
            "perPage": 2,
            "body": [
                {
                    "type": "table",
                    "title": "分页表格",
                    "source": "${rows}",
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
                }
            ]
        }
    ]
}
```

## 属性表

| 属性名        | 类型                                      | 默认值                 | 说明                                                                               |
| ------------- | ----------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------- |
| type          | `string`                                  | `"pagination-wrapper"` | 指定为 Pagination-Wrapper 渲染器                                                   |
| showPageInput | `boolean`                                 | `false`                | 是否显示快速跳转输入框                                                             |
| maxButtons    | `number`                                  | `5`                    | 最多显示多少个分页按钮                                                             |
| inputName     | `string`                                  | `"items"`              | 输入字段名                                                                         |
| outputName    | `string`                                  | `"items"`              | 输出字段名                                                                         |
| perPage       | `number`                                  | `10`                   | 每页显示多条数据                                                                   |
| position      | `'top'` 或 `'bottom'` 或 `'none'`         | `"top"`                | 分页显示位置，如果配置为 none 则需要自己在内容区域配置 pagination 组件，否则不显示 |
| body          | [SchemaNode](../../docs/types/schemanode) |                        | 内容区域                                                                           |

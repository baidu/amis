### Table

表格展示。

| 属性名           | 类型                          | 默认值                    | 说明                                                    |
| ---------------- | ----------------------------- | ------------------------- | ------------------------------------------------------- |
| type             | `string`                      |                           | `"table"` 指定为 table 渲染器                           |
| title            | `string`                      |                           | 标题                                                    |
| source           | `string`                      | `${items}`                | 数据源, 绑定当前环境变量                                |
| affixHeader      | `boolean`                     | `true`                    | 是否固定表头                                            |
| columnsTogglable | `auto` 或者 `boolean`         | `auto`                    | 展示列显示开关, 自动即：列数量大于或等于 5 个时自动开启 |
| placeholder      | string                        | ‘暂无数据’                | 当没数据的时候的文字提示                                |
| className        | `string`                      | `panel-default`           | 外层 CSS 类名                                           |
| tableClassName   | `string`                      | `table-db table-striped`  | 表格 CSS 类名                                           |
| headerClassName  | `string`                      | `Action.md-table-header`  | 顶部外层 CSS 类名                                       |
| footerClassName  | `string`                      | `Action.md-table-footer`  | 底部外层 CSS 类名                                       |
| toolbarClassName | `string`                      | `Action.md-table-toolbar` | 工具栏 CSS 类名                                         |
| columns          | Array of [Column](.Column.md) |                           | 用来设置列信息                                          |

```schema:height="700" scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "panel",
            "title": "简单表格示例1",
            "body": {
                "type": "table",
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
            }
        },

        {
            "type": "panel",
            "title": "简单表格示例2",
            "body": {
                "type": "table",
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
            }
        }
    ]
}
```

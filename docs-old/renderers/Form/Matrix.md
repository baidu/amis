### Matrix

矩阵类型的输入框。

-   `type` 请设置成 `matrix`
-   `columns` 列信息， 数组中 `label` 字段是必须给出的
-   `rows` 行信息， 数组中 `label` 字段是必须给出的
-   `rowLabel` 行标题说明
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。
-   `multiple` 多选，默认为 `true`
-   `singleSelectMode` 设置单选模式，`multiple`为`false`时有效，可设置为`cell`, `row`, `column` 分别为全部选项中只能单选某个单元格、每行只能单选某个单元格，每列只能单选某个单元格
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="250" scope="form-item"
{
  "type": "matrix",
  "name": "matrix",
  "label": "Matrix",
  "rowLabel": "行标题说明",
  "columns": [
    {
      "label": "列1"
    },
    {
      "label": "列2"
    }
  ],
  "rows": [
    {
      "label": "行1"
    },
    {
      "label": "行2"
    }
  ]
}
```

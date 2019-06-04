### Matrix

矩阵类型的输入框。

-   `type` 请设置成 `matrix`
-   `columns` 列信息， 数组中 `label` 字段是必须给出的
-   `rows` 行信息， 数组中 `label` 字段是必须给出的
-   `rowLabel` 行标题说明
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。
-   更多配置请参考 [FormItem](./FormItem.md)

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

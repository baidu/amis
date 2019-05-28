### Checkboxes

复选框

-   `type` 请设置成 `checkboxes`
-   `options` 选项配置，类型为数组，成员格式如下。
    -   `label` 文字
    -   `value` 值
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。
-   `joinValues` 默认为 `true` 选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
-   `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
-   `delimiter` 默认为 `,`
-   `columnsCount` 默认为 `1` 可以配置成一行显示多个。
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="330" scope="form"
[
    {
      "name": "checkboxes",
      "type": "checkboxes",
      "label": "Checkboxes",
      "options": [
          {
            "label": "OptionA",
            "value": "a"
          },
          {
            "label": "OptionB",
            "value": "b"
          },
          {
            "label": "OptionC",
            "value": "c"
          },
          {
            "label": "OptionD",
            "value": "d"
          }
        ]
    },

    {
        "type": "static",
        "name": "checkboxes",
        "label": "当前值"
    }
]
```

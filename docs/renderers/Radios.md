### Radios

单选框

-   `type` 请设置成 `radios`
-   `options` 选项配置，类型为数组，成员格式如下。
    -   `label` 文字
    -   `value` 值
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。
-   `columnsCount` 默认为 `1` 可以配置成一行显示多个。
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="330" scope="form"
[
    {
      "name": "radios",
      "type": "radios",
      "label": "Radios",
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
        "name": "radios",
        "label": "当前值"
    }
]
```

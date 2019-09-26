### Radios

单选框

-   `type` 请设置成 `radios`
-   `options` 选项配置，类型为数组，成员格式如下。
    -   `label` 文字
    -   `value` 值
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。
-   `columnsCount` 默认为 `1` 可以配置成一行显示多个。
-   `autoFill` 将当前已选中的选项的某个字段的值自动填充到表单中某个表单项中。
    - `autoFill`的格式为`{address: "${label}"}`，表示将选中项中的`label`的值，自动填充到当前表单项中`name` 为`address` 中
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

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


### 接口说明

开始之前请你先阅读[整体要求](../api.md)。

#### source

**发送**

默认 GET，不携带数据，可从上下文中取数据设置进去。

**响应**

格式要求如下：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "options": [
      {
        "label": "描述",
        "value": "值"
      },

      {
        "label": "描述2",
        "value": "值2"
      }
    ],

    "value": "值" // 默认值，可以获取列表的同时设置默认值。
  }
}
```
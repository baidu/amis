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
-   `checkAll` 默认为 `false` 开启后支持全选
-   `defaultCheckAll` 是否默认全选，默认为`false`
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

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
### Select

选项表单。

-   `type` 请设置成 `select`
-   `options` 选项配置，类型为数组，成员格式如下。
    -   `label` 文字
    -   `value` 值
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。另外也可以用 `$xxxx` 来获取当前作用域中的变量。
-   `autoComplete` 跟 source 不同的是，每次用户输入都会去接口获取提示。
-   `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
-   `joinValues` 默认为 `true`
-   单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
-   多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
-   `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
-   `delimiter` 默认为 `,`
-   `clearable` 默认为 `false`, 当设置为 `true` 时，已选中的选项右侧会有个小 `X` 用来取消设置。
-   `searchable` 默认为 `false`，表示可以通过输入部分内容检索出选项。
-   更多配置请参考 [FormItem](./FormItem.md)

单选

```schema:height="250" scope="form"
[
    {
      "type": "select",
      "name": "select",
      "label": "单选",
      "clearable": true,
      "options": [
        {
          "label": "Option A",
          "value": "a"
        },
        {
          "label": "Option B",
          "value": "b"
        }
      ]
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

多选

```schema:height="280" scope="form"
[
    {
      "type": "select",
      "name": "select",
      "label": "多选",
      "clearable": true,
      "multiple": true,
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
      "name": "select",
      "label": "当前值"
    }
]
```

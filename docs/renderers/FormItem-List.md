### List(FormItem)

简单的列表选择框。

-   `type` 请设置成 `list`
-   `options` 选项配置，类型为数组，成员格式如下。
    -   `label` 文字
    -   `value` 值
    -   `image` 图片的 http 地址。
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。
-   `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
-   `joinValues` 默认为 `true`
-   单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
-   多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
-   `delimiter` 默认为 `,`
-   `clearable` 默认为 `true`, 表示可以取消选中。
-   更多配置请参考 [FormItem](./FormItem.md)

单选

```schema:height="250" scope="form"
[
    {
      "type": "list",
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
      "type": "list",
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

选项带图片

```schema:height="280" scope="form"
[
    {
      "type": "list",
      "name": "select",
      "label": "图片",
      "clearable": true,
      "options": [
        {
          "label": "OptionA",
          "value": "a",
          "image": "raw:https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
        },
        {
          "label": "OptionB",
          "value": "b",
          "image": "raw:https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
        },
        {
          "label": "OptionC",
          "value": "c",
          "image": "raw:https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
        },
        {
          "label": "OptionD",
          "value": "d",
          "image": "raw:https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
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

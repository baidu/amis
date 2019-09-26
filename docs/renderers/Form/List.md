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
-   `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
-   `autoFill` 将当前已选中的选项的某个字段的值自动填充到表单中某个表单项中，只在单选时有效
    - `autoFill`的格式为`{address: "${label}"}`，表示将选中项中的`label`的值，自动填充到当前表单项中`name` 为`address` 中
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

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
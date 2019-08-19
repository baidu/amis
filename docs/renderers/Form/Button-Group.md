### Button-Group(FormItem)

按钮集合，直接看示例吧。

-   `type` 请设置成 `button-group`
-   `buttons` 配置按钮集合。

```schema:height="200" scope="form"
[
  {
    "type": "text",
    "name": "test",
    "label": "Text"
  },

  {
    "type": "button-toolbar",
    "buttons": [
      {
        "type": "button-group",
        "buttons": [
          {
            "type": "button",
            "label": "Button",
            "actionType": "dialog",
            "dialog": {
              "confirmMode": false,
              "title": "提示",
              "body": "对，你刚点击了！"
            }
          },

          {
            "type": "submit",
            "label": "Submit"
          },

          {
            "type": "reset",
            "label": "Reset"
          }
        ]
      },

      {
        "type": "submit",
        "icon": "fa fa-check text-success"
      },

      {
        "type": "reset",
        "icon": "fa fa-times text-danger"
      }
    ]
  }
]
```

button-group 有两种模式，除了能让按钮组合在一起，还能做类似于单选功能。

当不配置 buttons 属性时，就可以当复选框用。

-   `options` 选项配置，类型为数组，成员格式如下。
    -   `label` 文字
    -   `value` 值
    -   `image` 图片的 `http` 地址。
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。
-   `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
-   `joinValues` 默认为 `true`
-   单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
-   多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
-   `delimiter` 默认为 `,`
-   `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 `value` 的值封装为数组，作为当前表单项的值。
-   `clearable` 默认为 `true`, 表示可以取消选中。
-   `size` 按钮大小，从小到大依次为`xs, sm, md, lg`
-   `disabled` 是否禁用`options` 中选项
-   `autoFill` 将当前已选中的选项的某个字段的值自动填充到表单中某个表单项中，只在单选时有效
    - `autoFill`的格式为`{address: "${label}"}`，表示将选中项中的`label`的值，自动填充到当前表单项中`name` 为`address` 中
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="250" scope="form"
[
    {
      "type": "button-group",
      "name": "select",
      "label": "单选",
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

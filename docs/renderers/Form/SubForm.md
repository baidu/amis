### SubForm

formItem 还可以是子表单类型。

-   `type` 请设置成 `form`
-   `multiple` 默认为 `false` 配置是否为多选模式
-   `labelField` 当值中存在这个字段，则按钮名称将使用此字段的值来展示。
-   `btnLabel` 按钮默认名称
-   `minLength` 限制最小长度。
-   `maxLength` 限制最大长度。
-   `addButtonClassName` 新增按钮 CSS 类名 默认：`btn-success btn-sm`。
-   `editButtonClassName` 修改按钮 CSS 类名 默认：`btn-info btn-addon btn-sm`。
-   `form` 字表单的配置
    `title` 标题
    `controls` 请参考 [Form](./Form.md) 中的配置说明。
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="400" scope="form"
[
{
  "type": "form",
  "name": "form",
  "label": "子Form",
  "btnLabel": "设置子表单",
  "form": {
    "title": "配置子表单",
    "controls": [
      {
        "name": "a",
        "label": "A",
        "type": "text"
      },

      {
        "name": "b",
        "label": "B",
        "type": "text"
      }
    ]
  }
},
{
  "type": "static",
  "name": "form",
  "label": "当前值"
},
{
  "type": "form",
  "name": "form2",
  "label": "多选",
  "multiple": true,
  "maxLength":3,
  "btnLabel": "设置子表单",
  "form": {
    "title": "配置子表单",
    "controls": [
      {
        "name": "a",
        "label": "A",
        "type": "text"
      },

      {
        "name": "b",
        "label": "B",
        "type": "text"
      }
    ]
  }
},
{
  "type": "static",
  "name": "form2",
  "label": "当前值"
}
]
```

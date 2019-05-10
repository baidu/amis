### Table(FormItem)

可以用来展现数据的,可以用来展示数组类型的数据，比如 multiple 的[子 form](./SubForm.md)。

-   `type` 请设置成 `table`
-   `columns` 数组类型，用来定义列信息。

```schema:height="250" scope="form"
[
    {
    "type": "form",
    "name": "form",
    "label": "子Form",
    "btnLabel": "设置子表单",
    "multiple": true,
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
    "type":"table",
    "name":"form",
    "columns":[
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
    ]
  }
]
```

当然也可以用来作为表单输入。

| 属性名                       | 类型                    | 默认值           | 说明                                     |
| ---------------------------- | ----------------------- | ---------------- | ---------------------------------------- |
| type                         | `string`                | `"table"`        | 指定为 Table 渲染器                      |
| addable                      | `boolean`               | false            | 是否可增加一行                           |
| editable                     | `boolean`               | false            | 是否可编辑                               |
| removable                    | `boolean`               | false            | 是否可删除                               |
| addApi                       | [api](./Types.md#Api)   | -                | 新增时提交的 API                         |
| updateApi                    | [api](./Types.md#Api)   | -                | 修改时提交的 API                         |
| deleteApi                    | [api](./Types.md#Api)   | -                | 删除时提交的 API                         |
| addBtnLabel                  | `string`                |                  | 增加按钮名称                             |
| addBtnIcon                   | `string`                | `"fa fa-plus"`   | 增加按钮图标                             |
| updateBtnLabel               | `string`                | `""`             | 更新按钮名称                             |
| updateBtnIcon                | `string`                | `"fa fa-pencil"` | 更新按钮图标                             |
| deleteBtnLabel               | `string`                | `""`             | 删除按钮名称                             |
| deleteBtnIcon                | `string`                | `"fa fa-minus"`  | 删除按钮图标                             |
| confirmBtnLabel              | `string`                | `""`             | 确认编辑按钮名称                         |
| confirmBtnIcon               | `string`                | `"fa fa-check"`  | 确认编辑按钮图标                         |
| cancelBtnLabel               | `string`                | `""`             | 取消编辑按钮名称                         |
| cancelBtnIcon                | `string`                | `"fa fa-times"`  | 取消编辑按钮图标                         |
| columns                      | `array`                 | []               | 列信息                                   |
| columns[x].quickEdit         | `boolean` 或者 `object` | -                | 配合 editable 为 true 一起使用           |
| columns[x].quickEditOnUpdate | `boolean` 或者 `object` | -                | 可以用来区分新建模式和更新模式的编辑配置 |

-   更多配置请参考 [FormItem](./FormItem.md)
-   更多 Demo 详情请参考 [表格编辑](/docs/examples/form/table)

```schema:height="250" scope="form-item"
{
    "type":"table",
    "name":"form",
    "editable": true,
    "addable": true,
    "removable": true,
    "label": "表格输入",
    "columns":[
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B",
          "quickEdit": {
            "type": "select",
              "options": [
                {
                  "label": "A",
                  "value": "a"
                },
                {
                  "label": "B",
                  "value": "b"
                }
              ]
          }
        }
    ]
  }
```

### NestedSelect

树形结构选择框。

-   `type` 请设置成 `nested-select`
-   `options` 类似于 [select](./Select.md) 中 `options`, 并且支持通过 `children` 无限嵌套。
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。
-   `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
-   `joinValues` 默认为 `true`
-   单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
-   多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
-   `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
-   `delimiter` 默认为 `,`
-   `autoFill` 将当前已选中的选项的某个字段的值自动填充到表单中某个表单项中，只在单选时有效
    - `autoFill`的格式为`{address: "${label}"}`，表示将选中项中的`label`的值，自动填充到当前表单项中`name` 为`address` 中
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="300" scope="form-item"
{
  "type": "nested-select",
  "name": "nestedSelect",
  "label": "级联选择器",
  "size": "sm",
  "options": [
      {
          "label": "A",
          "value": "a"
      },
      {
          "label": "B",
          "value": "b",
          "children": [
              {
                  "label": "B-1",
                  "value": "b-1"
              },
              {
                  "label": "B-2",
                  "value": "b-2"
              },
              {
                  "label": "B-3",
                  "value": "b-3"
              }
          ]
      },
      {
          "label": "C",
          "value": "c"
      }
  ]
}
```

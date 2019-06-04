### TreeSelect

树形结构选择框。

-   `type` 请设置成 `tree-select`
-   `options` 类似于 [select](./Select.md) 中 `options`, 并且支持通过 `children` 无限嵌套。
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。
-   `hideRoot` 默认是会显示一个顶级，如果不想显示，请设置 `false`
-   `rootLabel` 默认为 `顶级`，当 hideRoot 不为 `false` 时有用，用来设置顶级节点的文字。
-   `showIcon` 是否显示投标，默认为 `true`。
-   `showRadio` 是否显示单选按钮，multiple 为 `false` 是有效。
-   `cascade` 设置成 `true` 时当选中父节点时不自动选择子节点。
-   `withChildren` 是指成 `true`，选中父节点时，值里面将包含子节点的值，否则只会保留父节点的值。
-   `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
-   `joinValues` 默认为 `true`
-   单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
-   多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
-   `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
-   `delimiter` 默认为 `,`
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="300" scope="form-item"
{
  "type": "tree-select",
  "name": "tree",
  "label": "Tree",
  "options": [
    {
      "label": "Folder A",
      "value": 1,
      "children": [
        {
          "label": "file A",
          "value": 2
        },
        {
          "label": "file B",
          "value": 3
        }
      ]
    },
    {
      "label": "file C",
      "value": 4
    },
    {
      "label": "file D",
      "value": 5
    }
  ]
}
```

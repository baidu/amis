### Text

普通的文本输入框。

-   `type` 请设置成 `text`
-   `addOn` 输入框附加组件，比如附带一个提示文字，或者附带一个提交按钮。
-   `addOn.type` 请选择 `text` 、`button` 或者 `submit`。
-   `addOn.label` 文字说明
-   `addOn.xxx` 其他参数请参考按钮配置部分。
-   `hint` 当输入框获得焦点的时候显示，用来提示用户输入内容。
-   `trimContents` 是否去除首尾空白。
-   `clearable` 在有值的时候是否显示一个删除图标在右侧。
-   `resetValue` 默认为 `""`, 删除后设置此配置项给定的值。
-   `options` 可选，选项配置，类型为数组，成员格式如下，配置后用户输入内容时会作为选项提示辅助输入。
    -   `label` 文字
    -   `value` 值
-   `source` 通过 `options` 只能配置静态数据，如果设置了 `source` 则会从接口拉取，实现动态效果。
-   `autoComplete` 跟 `source` 不同的是，每次用户输入都会去接口获取提示。
-   `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
-   `joinValues` 默认为 `true`
-   单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
-   多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
-   `delimiter` 默认为 `,`
-   `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="200" scope="form-item"
{
  "type": "text",
  "name": "text",
  "label": "文本"
}
```

带提示功能

```schema:height="240" scope="form-item"
{
  "type": "text",
  "name": "text",
  "label": "文本",
  "clearable": true,
  "addOn": {
    "type": "submit",
    "icon": "fa fa-search",
    "level": "primary"
  },
  "options": [
    "wangzhaojun",
    "libai",
    "luna",
    "zhongkui"
  ]
}
```

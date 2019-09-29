### Tag

标签输入框。

-   `type` 请设置成 `tag`
-   `clearable` 在有值的时候是否显示一个删除图标在右侧。
-   `resetValue` 默认为 `""`, 删除后设置此配置项给定的值。
-   `optionsTip` 选项提示，默认为 `最近您使用的标签`
-   `options` 选项配置，类型为数组，成员格式如下，或者直接为字符串，配置后用户输入内容时会作为选项提示辅助输入
    -   `label` 文字
    -   `value` 值
-   `source` 通过 `options` 只能配置静态数据，如果设置了 `source` 则会从接口拉取，实现动态效果。
-   `joinValues` 默认为 `true`
-   单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
-   多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
-   `delimiter` 默认为 `,`
-   `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="200" scope="form-item"
{
  "type": "tag",
  "name": "tag",
  "label": "标签"
}
```

带提示功能

```schema:height="240" scope="form-item"
{
  "type": "tag",
  "name": "tag",
  "label": "标签",
  "clearable": true,
  "options": [
    "wangzhaojun",
    "libai",
    "luna",
    "zhongkui"
  ]
}
```

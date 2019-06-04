### Url

URL 输入框。

-   `type` 请设置成 `url`
-   `addOn` 输入框附加组件，比如附带一个提示文字，或者附带一个提交按钮。
-   `addOn.type` 请选择 `text` 、`button` 或者 `submit`。
-   `addOn.label` 文字说明
-   `addOn.xxx` 其他参数请参考按钮配置部分。
-   `clearable` 在有值的时候是否显示一个删除图标在右侧。
-   `resetValue` 默认为 `""`, 删除后设置此配置项给定的值。
-   `options` 可选，选项配置，类型为数组，成员格式如下，配置后用户输入内容时会作为选项提示辅助输入。
    -   `label` 文字
    -   `value` 值
-   `source` 通过 options 只能配置静态数据，如果设置了 source 则会从接口拉取，实现动态效果。
-   `autoComplete` 跟 source 不同的是，每次用户输入都会去接口获取提示。
-   `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="200" scope="form-item"
{
  "type": "url",
  "name": "text",
  "validateOnChange": true,
  "label": "Url"
}
```

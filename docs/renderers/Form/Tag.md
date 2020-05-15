### Tag

标签输入框。

- `type` 请设置成 `tag`
- `clearable` 在有值的时候是否显示一个删除图标在右侧。
- `options` 选项配置，类型为数组，成员格式如下，或者直接为字符串，配置后用户输入内容时会作为选项提示辅助输入，可以不指定，当不指定时完全由用户手动输入。
  - `label` 文字
  - `value` 值
  - `children` 如果需要简单分组，可以考虑把选项包在某个选项的 children 里面。
- `delimiter` 默认为 `,`，当标签在输入中，输入了这个字符时，也能自动创建一个新标签。
- `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
- **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="200" scope="form-item"
{
  "type": "tag",
  "name": "tag",
  "label": "标签"
}
```

待选项的标签输入。

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

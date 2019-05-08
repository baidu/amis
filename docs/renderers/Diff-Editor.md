### Diff-Editor

-   `type` 请设置成 `diff-editor`
-   `language` 默认为 `javascript` 当 `type` 为 `diff-editor` 的时候有用
-   `diffValue` 设置左侧编辑器的值，支持`${xxx}`获取变量
-   `disabled` 配置 **右侧编辑器** 是否可编辑，**左侧编辑器**始终不可编辑
-   更多配置请参考 [FormItem](#FormItem)

PS: 当用作纯展示时，可以通过`value`配置项，设置右侧编辑器的值

```schema:height="350" scope="form-item"
{
  "type": "diff-editor",
  "name": "diff",
  "diffValue": "hello world",
  "label": "Diff-Editor"
}
```

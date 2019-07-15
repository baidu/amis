### Textarea

多行文本输入框。

-   `type` 请设置成 `textarea`
-   `minRows` 最小行数
-   `maxRows` 最大行数
-   `hint` 当输入框获得焦点的时候显示，用来提示用户输入内容。
-   `trimContents` 是否去除首尾空白。
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="200" scope="form-item"
{
  "type": "textarea",
  "name": "text",
  "label": "多行文本"
}
```

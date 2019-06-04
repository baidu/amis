### Rich-Text

富文本编辑器

-   `type` 请设置成 `rich-text`
-   `saveAsUbb` 是否保存为 ubb 格式
-   `reciever` 默认的图片保存 API `/api/upload/image`
-   `size` 框的大小，可以设置成 `md` 或者 `lg` 来增大输入框。
-   `buttons` 默认为

    ```js
    [
        'paragraphFormat',
        'quote',
        'color',
        '|',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        '|',
        'formatOL',
        'formatUL',
        'align',
        '|',
        'insertLink',
        'insertImage',
        'insertTable',
        '|',
        'undo',
        'redo',
        'html',
    ];
    ```

-   `options` Object 类型，给富文本的配置信息。请参考 https://www.froala.com/wysiwyg-editor/docs/options
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="350" scope="form-item"
{
  "type": "rich-text",
  "name": "html",
  "label": "Rich Text"
}
```

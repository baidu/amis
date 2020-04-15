### Rich-Text

富文本编辑器

- `type` 请设置成 `rich-text`
- `vendor` 默认为 `tinymce`，amis 平台中默认为 `froala`。
- `reciever` 默认的图片保存 API `/api/upload/image`
- `videoReciever` 默认的视频保存 API `/api/upload/video`。 当为 tinymce 时无效
- `size` 框的大小，可以设置成 `md` 或者 `lg` 来增大输入框。 当为 tinymce 时无效
- `buttons` 默认为

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
    'html'
  ];
  ```

  当为 tinymce 时无效

- `options` Object 类型，给富文本的配置信息。请参考 https://www.froala.com/wysiwyg-editor/docs/options 或者 https://www.tiny.cloud/docs/configure/integration-and-setup/

  tinymce 你可能需要指定样式表才能达到更好的展示效果，这个默认配置是关闭的，具体请参考 tinymce 文档。

- **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="350" scope="form-item"
{
  "type": "rich-text",
  "name": "html",
  "label": "Rich Text"
}

```

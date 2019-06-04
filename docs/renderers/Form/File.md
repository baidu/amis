### File

文件输入，amis 也默认处理了图片存储，提交给 API 的是文件的下载地址。

-   `type` 请设置成 `file`
-   `reciever` 默认 `/api/upload/file` 如果想自己存储，请设置此选项。(PS: 如果想存自己的 bos, 系统配置中可以直接填写自己的 bos 配置。)
-   `accept` 默认 `text/plain` 默认只支持纯文本，要支持其他类型，请配置此属性。
-   `maxSize` 默认没有限制，当设置后，文件大小大于此值将不允许上传。
-   `multiple` 是否多选。
-   `maxLength` 默认没有限制，当设置后，一次只允许上传指定数量文件。
-   `joinValues` 多选时是否将多个值用 `delimiter` 连接起来。
-   `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
-   `delimiter` 链接符
-   `autoUpload` 是否选择完就自动开始上传？默认为 `true`
-   `fileField` 默认 `file`, 如果你不想自己存储，则可以忽略此属性。
-   `downloadUrl` 默认显示文件路径的时候会支持直接下载，可以支持加前缀如：`http://xx.dom/filename=` ，如果不希望这样，可以把当前配置项设置为 `false`。
-   `useChunk` 默认为 'auto' amis 所在服务器，限制了文件上传大小不得超出 10M，所以 amis 在用户选择大文件的时候，自动会改成分块上传模式。
-   `chunkSize` 分块大小，默认为 5M.
-   `startChunkApi` 默认 `/api/upload/startChunk` 想自己存储时才需要关注。
-   `chunkApi` 默认 `/api/upload/chunk` 想自己存储时才需要关注。
-   `finishChunkApi` 默认 `/api/upload/finishChunk` 想自己存储时才需要关注。
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="250" scope="form-item"
{
  "type": "file",
  "name": "file",
  "label": "File",
  "maxSize": 1048576
}
```

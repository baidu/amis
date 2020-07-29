### File

用来负责文件上传，文件上传成功后会返回文件地址，这个文件地址会作为这个表单项的值，整个表单提交的时候，其实提交的是文件地址，文件上传已经在这个控件中完成了。

- `type` 请设置成 `file`
- `reciever` 默认 `/api/upload/file` 如果想自己存储，请设置此选项。(PS: 如果想存自己的 bos, 系统配置中可以直接填写自己的 bos 配置。)
- `accept` 默认支持所有类型，如果限制只能选某些类型的文件，请配置此属性为文件后缀名`.xxx`
  - 例如：`.png`；
  - 也可以配置多个，用逗号分隔：`.mp3,.mp4`。
- `maxSize` 默认没有限制，当设置后，文件大小大于此值将不允许上传。
- `multiple` 是否多选。
- `maxLength` 默认没有限制，当设置后，一次只允许上传指定数量文件。
- `joinValues` 多选时是否将多个值用 `delimiter` 连接起来。
- `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
- `delimiter` 链接符
- `autoUpload` 是否选择完就自动开始上传，默认为 `true`
- `fileField` 默认 `file`, 如果你不想自己存储，则可以忽略此属性。
- `downloadUrl` 默认显示文件路径的时候会支持直接下载，可以支持加前缀如：`http://xx.dom/filename=` ，如果不希望这样，可以把当前配置项设置为 `false`。
- `useChunk` 默认为 `auto`，amis 所在服务器，限制了文件上传大小不得超出 10M，所以 amis 在用户选择大文件的时候，自动会改成分块上传模式。
- `chunkSize` 分块大小，默认为 5M.
- `startChunkApi` 默认 `/api/upload/startChunk` 想自己存储时才需要关注。
- `chunkApi` 默认 `/api/upload/chunk` 想自己存储时才需要关注。
- `finishChunkApi` 默认 `/api/upload/finishChunk` 想自己存储时才需要关注。
- `autoFill` 将上传成功后接口返回值的某个字段，自动填充到表单中某个表单项中，只在单选时有效
  - 配置`"autoFill": {"filename": "${filename}"}`，表示将选中项中的`filename`的值，自动填充到当前`name`为`filename`的表单项中
- **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="250" scope="form-item"
{
  "type": "file",
  "name": "file",
  "label": "File",
  "maxSize": 1048576
}
```

如果不希望 File 控件接管上传，可以配置 `asBlob` 或者 `asBase64` 这两个属性（二选一），采用这种方式后，File 控件不再自己上传了，而是直接把文件数据作为表单项的值，文件内容会在 Form 表单提交的接口里面一起带上。

### 接口说明

开始之前请你先阅读[整体要求](../api.md)。

#### reciever

用来自己实现文件接收

**发送：**

POST 方式，内容体为 form-data/multipart 格式。文件的字段名为 file。

**响应：**

常规返回格式如下：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "value": "一般为文件的下载地址"
  }
}
```

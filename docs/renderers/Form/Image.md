### Image

图片格式输入，默认 amis 会直接存储在 FEX 的 hiphoto 里面，提交到 form 是直接的图片 url。

- `type` 请设置成 `image`
- `reciever` 默认 `/api/upload` 如果想自己存储，请设置此选项。
- `multiple` 是否多选。
- `maxLength` 默认没有限制，当设置后，一次只允许上传指定数量文件。
- `joinValues` 多选时是否将多个值用 `delimiter` 连接起来。
- `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
- `delimiter` 连接符，默认是 `,`, 多选时且 `joinValues` 为 `true` 时用来连接值。
- `autoUpload` 是否选择完就自动开始上传？默认为 `true`
- `maxSize` 默认没有限制，当设置后，文件大小大于此值将不允许上传。
- `crop` 用来设置是否支持裁剪。
  - `aspectRatio` 浮点型，默认 `1` 即 `1:1`，如果要设置 `16:9` 请设置 `1.7777777777777777` 即 `16 / 9`。
- `limit` 限制图片大小，超出不让上传。
  - `width` 限制图片宽度。
  - `height` 限制图片高度。
  - `minWidth` 限制图片最小宽度。
  - `minHeight` 限制图片最小高度。
  - `maxWidth` 限制图片最大宽度。
  - `maxHeight` 限制图片最大高度。
  - `aspectRatio` 限制图片宽高比，格式为浮点型数字，默认 `1` 即 `1:1`，如果要设置 `16:9` 请设置 `1.7777777777777777` 即 `16 / 9`。 如果不想限制比率，请设置空字符串。
- **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="250" scope="form-item"
{
  "type": "image",
  "name": "image",
  "label": "Images"
}
```

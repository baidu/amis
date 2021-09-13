---
title: InputFile 文件上传
description:
type: 0
group: null
menuName: InputFile
icon:
order: 21
---

## 基本用法

用来负责文件上传，文件上传成功后会返回文件地址，这个文件地址会作为这个表单项的值，整个表单提交的时候，其实提交的是文件地址，文件上传已经在这个控件中完成了。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-file",
            "name": "file",
            "label": "File",
            "accept": "*",
            "receiver": "/api/upload/file"
        }
    ]
}
```

### 接口返回格式

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "value": "xxxx"
  }
}
```

- value：必须返回该字段用作回显，一般是文件资源地址

## 限制文件类型

可以配置`accept`来限制可选择的文件类型，格式是文件后缀名`.xxx`

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-file",
            "name": "file",
            "label": "限制只能上传csv文件",
            "accept": ".csv",
            "receiver": "/api/upload/file"
        }
    ]
}
```

想要限制多个类型，则用逗号分隔，例如：`.csv,.md`

## 手动上传

如果不希望 File 组件上传，可以配置 `asBlob` 或者 `asBase64`，采用这种方式后，组件不再自己上传了，而是直接把文件数据作为表单项的值，文件内容会在 Form 表单提交的接口里面一起带上。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-file",
            "name": "file",
            "label": "File",
            "accept": "*",
            "asBlob": true
        }
    ]
}
```

上例中，选择任意文件，然后观察数据域变化；点击提交，amis 自动会调整接口数据格式为`FormData`

## 分块上传

如果文件过大，则可能需要使用分块上传

## 自动填充

上传成功后，可以通过配置 `autoFill` 将上传接口返回的值填充到某个表单项中（在非表单下暂不支持）：

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-file",
      "name": "file",
      "label": "File",
      "accept": "*",
      "receiver": "/api/upload/file",
      "autoFill": {
        "myUrl": "${url}"
      }
    },
    {
      "type": "input-text",
      "name": "myUrl",
      "label": "url"
    }
  ]
}
```

上例中，file 组件上传后，接口返回格式例如如下：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "value": "xxxxxxx",
    "filename": "xxxx.csv",
    "url": "http://xxxx.xxx.xxx"
  }
}
```

然后 file 上配置：

```json
"autoFill": {
    "myUrl": "${url}"
}
```

这样上传成功后，会把接口中的 `url` 变量，赋值给 `myUrl` 变量

**多选模式**

当表单项为多选模式时，不能再直接取选项中的值了，而是通过 `items` 变量来取，通过它可以获取当前选中的选项集合。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-file",
      "name": "file",
      "label": "File",
      "multiple": true,
      "receiver": "/api/upload/file",
      "autoFill": {
        "myUrl": "${items|pick:url}",
        "lastUrl": "${items|last|pick:url}"
      }
    }
  ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名           | 类型                           | 默认值                                                                                                     | 说明                                                                                                                                 |
| ---------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| receiver         | [API](../../../docs/types/api) |                                                                                                            | 上传文件接口                                                                                                                         |
| accept           | `string`                       | `text/plain`                                                                                               | 默认只支持纯文本，要支持其他类型，请配置此属性为文件后缀`.xxx`                                                                       |
| asBase64         | `boolean`                      | `false`                                                                                                    | 将文件以`base64`的形式，赋值给当前组件                                                                                               |
| asBlob           | `boolean`                      | `false`                                                                                                    | 将文件以二进制的形式，赋值给当前组件                                                                                                 |
| maxSize          | `number`                       |                                                                                                            | 默认没有限制，当设置后，文件大小大于此值将不允许上传。单位为`B`                                                                      |
| maxLength        | `number`                       |                                                                                                            | 默认没有限制，当设置后，一次只允许上传指定数量文件。                                                                                 |
| multiple         | `boolean`                      | `false`                                                                                                    | 是否多选。                                                                                                                           |
| joinValues       | `boolean`                      | `true`                                                                                                     | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                                                           |
| extractValue     | `boolean`                      | `false`                                                                                                    | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)                                                       |
| delimiter        | `string`                       | `,`                                                                                                        | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                                                            |
| autoUpload       | `boolean`                      | `true`                                                                                                     | 否选择完就自动开始上传                                                                                                               |
| hideUploadButton | `boolean`                      | `false`                                                                                                    | 隐藏上传按钮                                                                                                                         |
| stateTextMap     | object                         | `{ init: '', pending: '等待上传', uploading: '上传中', error: '上传出错', uploaded: '已上传', ready: '' }` | 上传状态文案                                                                                                                         |
| fileField        | `string`                       | `file`                                                                                                     | 如果你不想自己存储，则可以忽略此属性。                                                                                               |
| nameField        | `string`                       | `name`                                                                                                     | 接口返回哪个字段用来标识文件名                                                                                                       |
| valueField       | `string`                       | `value`                                                                                                    | 文件的值用那个字段来标识。                                                                                                           |
| urlField         | `string`                       | `url`                                                                                                      | 文件下载地址的字段名。                                                                                                               |
| btnLabel         | `string`                       |                                                                                                            | 上传按钮的文字                                                                                                                       |
| downloadUrl      | `boolean`或`string`            | `""` 1.1.6 版本开始支持 `post:http://xxx.com/${value}` 这种写法                                            | 默认显示文件路径的时候会支持直接下载，可以支持加前缀如：`http://xx.dom/filename=` ，如果不希望这样，可以把当前配置项设置为 `false`。 |
| useChunk         | `boolean`或`"auto"`            | `"auto"`                                                                                                   | amis 所在服务器，限制了文件上传大小不得超出 10M，所以 amis 在用户选择大文件的时候，自动会改成分块上传模式。                          |
| chunkSize        | `number`                       | `5 * 1024 * 1024`                                                                                          | 分块大小                                                                                                                             |
| startChunkApi    | [API](../../../docs/types/api) |                                                                                                            | startChunkApi                                                                                                                        |
| chunkApi         | [API](../../../docs/types/api) |                                                                                                            | chunkApi                                                                                                                             |
| finishChunkApi   | [API](../../../docs/types/api) |                                                                                                            | finishChunkApi                                                                                                                       |

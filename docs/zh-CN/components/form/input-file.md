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

> 如果希望文件内容伴随表单一起提交，可以配置 `asBlob` 或者 `asBase64`。

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

### 接口说明

这是单文件上传模式，通过配置 `receiver` 来接管文件上传。

接口发送方式是 POST, 数据体为 form-data 格式。对应的文件字段名为 `file`。这个可以通过 `fileField` 来配置。要求返回的数据格式如下。

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

> 注意这只是单文件上传部分，如果允许上传的文件比较大，建议用分块上传，请阅读下面的分块上传部分。

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

如果文件过大，则可能需要使用分块上传，默认大于 5M（chunkSize 配置决定） 的文件是会自动开启，可以通过 `useChunk` 配置成 false 关闭。

分块上传需要配置三个接口来完成分别是:

- `startChunkApi` 用来做分块前的准备工作
- `chunkApi` 用来接收每个分块上传
- `finishChunkApi` 用来收尾分块上传

还可以通过 `concurrency` 控制并行数量，默认是 3

### startChunkApi

用来做分块前的准备工作，一个文件只会调用一次。如果出错了，后续的分块上传就会中断。

发送说明：默认是 post，发送的数据中会包含 `filename` 字段，记录文件名，默认的数据体格式为 json。可以额外配置参数，请参考 API 的配置说明。

要求返回的数据中必须包含：

- `uploadId` 这次上传的唯一 ID。
- `key` 有点类似 `uploadId`，可有可无，爱速搭中用来记录后端文件存储路径。

其他属性返回目前是没有任何作用的。

如：

```
{
  "status": 0,
  "msg": "",
  "data": {
    "key": "images/JSSDK_page-xxxx.zip",
    "uploadId": "036f64cd5dd95750d4bcb33556b629c6"
  }
}
```

### chunkApi

用来接收每个分块上传，大文件会根据 chunkSize 分割成多块，然后每块上传都会调用这个接口。

发送说明：默认为 post，发送体格式为 form-data。包含以下信息：

- `uploadId` startChunkApi 返回的
- `key` startChunkApi 返回的
- `partNumber` 分块序号，从 1 开始。
- `partSize` 分块大小
- `file` 文件体

要求返回的数据中必须包含:

- `eTag` 通常为文件的内容戳。

如：

```
{
  "status": 0,
  "msg": "",
  "data": {
    "eTag": "016bd9b68ddd5cd7318875da3ea28207"
  }
}
```

### finishChunkApi

等所有分块上传完后，将上传文件收集到的 `eTag` 信息合并一起，再次请求后端完成文件上传。

发送说明：默认为 post，数据体默认为 json，包含以下信息

- `filename` 文件名
- `key` startChunkApi 返回的
- `uploadId` startChunkApi 返回的
- `partList` 数组，每个成员为 `{partNumber: xxx, eTag: "xxxxx"}` 即分块编号和分块 `eTag` 信息。

数据返回，类似单文件上传一样，必须有 `value` 属性，可选返回 `url` 用来决定文件的下载地址。如：

```
{
  "status": 0,
  "msg": "",
  "data": {
    "value": "https://xxxx.cdn.bcebos.com/images/JSSDK_page-xxxxx.zip"
  }
}
```

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

## 拖拽上传

把文件拖入指定区域，完成上传，同样支持点击上传。

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
            "drag": true
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
| drag             | `boolean`                      | `false`                                                                                                    | 是否为拖拽上传                                                                                                                       |
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
| concurrency      | `number`                       |                                                                                                            | 分块上传时并行个数                                                                                                                   |
| documentation    | `string`                       |                                                                                                            | 文档内容                                                                                                                             |
| documentLink     | `string`                       |                                                                                                            | 文档链接                                                                                                                             |
| initAutoFill     | `boolean`                      | `true`                                                                                                     | 初表单反显时是否执行                                                                                                                 |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.0 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`file`取值。

| 事件名称 | 事件参数                                                                                                                                    | 说明                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| change   | `[name]: FileValue` \| `Array<FileValue>` 组件的值                                                                                          | 上传文件值变化时触发(上传失败同样会触发) |
| remove   | `item: FileValue` 被移除的文件<br/>`[name]: FileValue` \| `Array<FileValue>` 组件的值                                                       | 移除文件时触发                           |
| success  | `item: FileValue` 远程上传请求成功后返回的结果数据<br/>`[name]: FileValue` \| `Array<FileValue>` 组件的值                                   | 上传成功时触发                           |
| fail     | `item: FileValue` 上传的文件 <br /> `error: object` 远程上传请求失败后返回的错误信息<br/>`[name]: FileValue` \| `Array<FileValue>` 组件的值 | 上传文件失败时触发                       |

### FileValue 属性表

| 属性名 | 类型     | 说明                                               |
| ------ | -------- | -------------------------------------------------- |
| name   | `string` | 文件名称                                           |
| value  | `string` | 上传成功后返回的 url                               |
| state  | `string` | 文件当前状态,值可为 `pending` `uploaded` `invalid` |
| error  | `string` | 错误信息                                           |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置 | 说明 |
| -------- | -------- | ---- |
| clear    | -        | 清空 |

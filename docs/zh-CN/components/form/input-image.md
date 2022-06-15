---
title: InputImage 图片
description:
type: 0
group: null
menuName: InputImage
icon:
order: 27
---

图片格式输入，需要实现接收器，提交时将以 url 的方式提交，如果需要以表单方式提交请使用 [InputFile](input-file#手动上传)。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-image",
            "name": "image",
            "label": "image",
            "receiver": "/api/upload/file"
        }
    ]
}
```

默认情况下，选中文件后，就会自动调用 `receiver` 配置里的接口进行上传，比如 node 版本的示例如下：

```javascript
const express = require('express');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const app = express();

app.use(express.static('public'));

// 默认情况下是 file 字段名作为文件参数，也可以通过 fileField 配置来改成别的名字
app.post('/uploader', upload.single('file'), function (req, res, next) {
  res.json({
    status: 0,
    data: {
      value: '/' + req.file.path
    }
  });
});

// 配合上面的返回值，将 uploads 目录可读，这样返回的文件才能正常显示
app.get('uploads', express.static('uploads'));

app.listen(8080, function () {});
```

这个接口需要返回图片地址，比如下面的格式

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "value": "https:/xxx.yy/zz.png"
  }
}
```

点击表单提交的时候，实际提交的就是这个返回的图片地址，比如上面的例子是 `image`，则会提交

```
{
  "image": "https:/xxx.yy/zz.png"
}
```

## 限制文件类型

可以配置`accept`来限制可选择的文件类型，格式是文件后缀名`.xxx`

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-image",
            "name": "image",
            "label": "限制只能上传jpg图片",
            "accept": ".jpg",
            "receiver": "/api/upload/file"
        }
    ]
}
```

想要限制多个类型，则用逗号分隔，例如：`.jpg,.png`

## 限制文件大小

配置 `limit`，更多属性请参考后面的属性说明。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-image",
            "name": "image",
            "label": "限制只能上传宽度大于 1000 的图片",
            "accept": ".jpg",
            "limit": {
              "minWidth": 1000
            },
            "receiver": "/api/upload/file"
        }
    ]
}
```

## 支持裁剪

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-image",
            "name": "image",
            "label": "上传后裁剪",
            "receiver": "/api/upload/file",
            "crop": true
        }
    ]
}
```

设置裁剪比例等配置，具体细节可以参考[这里](https://github.com/fengyuanchen/cropperjs#options)。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-image",
            "name": "image",
            "label": "上传后裁剪",
            "receiver": "/api/upload/file",
            "crop": {
              "aspectRatio": 1.7777
            }
        }
    ]
}
```

默认情况下裁剪结果是 `png` 格式，如果要支持其它格式，请设置 `cropFormat`，比如下面设置为 `jpeg` 格式，同时设置质量为 `0.9`

> 1.4.0 及以上版本

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-image",
            "name": "image",
            "label": "上传后裁剪",
            "receiver": "/api/upload/file",
            "crop": true,
            "cropFormat": "image/jpeg",
            "cropQuality": 0.9
        }
    ]
}
```

如果浏览器支持，还能设置为 `image/webp`

## 自动填充

上传成功后，可以通过配置 `autoFill` 将上传接口返回的值填充到某个表单项中：

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-image",
      "name": "image",
      "label": "image",
      "receiver": "/api/upload/file",
      "autoFill": {
        "myUrl": "${url}"
      }
    },
    {
      "type": "text",
      "name": "myUrl",
      "label": "url"
    }
  ]
}
```

上例中，image 组件上传后，接口返回格式例如如下：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "value": "xxxxxxx",
    "filename": "xxxx.jpg",
    "url": "http://xxxx.xxx.xxx"
  }
}
```

然后 image 上配置：

```json
"autoFill": {
    "myUrl": "${url}"
}
```

这样上传成功后，会把接口中的 `url` 变量，赋值给 `myUrl` 变量，这个里支持表达式，比如在前面加上域名

```json
"autoFill": {
    "myUrl": "https://cdn.com/${filename}"
}
```

**多选模式**

当表单项为多选模式时，不能再直接取选项中的值了，而是通过 `items` 变量来取，通过它可以获取当前选中的选项集合。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-image",
      "name": "image",
      "label": "image",
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

**initAutoFill**

当表单反显时，可通过`initAutoFill`控制`autoFill`在数据反显时是否执行。

```schema: scope="body"
{
  type: 'crud',
  api: '/api/mock2/crud/list',
  perPage: 3,
  columns: [
    {
      type: 'operation',
      label: '操作',
      buttons: [
        {
          type: 'button',
          label: '修改',
          level: 'link',
          size: 'xs',
          actionType: 'dialog',
          dialog: {
            title: '修改',
            size: 'lg',
            body: {
              "type": "form",
              "horizontal": {
                "left": 3,
                "right": 9
              },
              "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
              "body": [
                {
                  "type": "input-image",
                  "name": "image",
                  "label": "image",
                  "receiver": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/upload/file",
                  "autoFill": {
                    "text": "${url}"
                  },
                  "initAutoFill": true
                },
                {
                  "type": "input-text",
                  "name": "text",
                  "label": "文本",
                },
                {
                  "type": "input-image",
                  "name": "carousel",
                  "label": "image",
                  "receiver": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/upload/file",
                  "autoFill": {
                    "id": "${url}"
                  },
                  "initAutoFill": false
                },
                {
                  "type": "input-text",
                  "name": "id",
                  "label": "ID",
                },
              ]
            }
          },
        },
      ]
    },
    {
      name: 'id',
      label: 'ID',
      type: 'text'
    },
    {
      name: 'text',
      label: '文本',
      type: 'text'
    },
    {
      type: 'image',
      label: '图片',
      name: 'image',
      enlargeAble: true,
      title: '233',
      thumbMode: 'cover'
    },
    {
      name: 'carousel',
      label: '轮播图',
      type: 'carousel',
      width: '300'
    },
  ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名             | 类型                            | 默认值                 | 说明                                                                                                                                             |
| ------------------ | ------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| receiver           | [API](../../../docs/types/api)  |                        | 上传文件接口                                                                                                                                     |
| accept             | `string`                        | `.jpeg,.jpg,.png,.gif` | 支持的图片类型格式，请配置此属性为图片后缀，例如`.jpg,.png`                                                                                      |
| maxSize            | `number`                        |                        | 默认没有限制，当设置后，文件大小大于此值将不允许上传。单位为`B`                                                                                  |
| maxLength          | `number`                        |                        | 默认没有限制，当设置后，一次只允许上传指定数量文件。                                                                                             |
| multiple           | `boolean`                       | `false`                | 是否多选。                                                                                                                                       |
| joinValues         | `boolean`                       | `true`                 | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                                                                       |
| extractValue       | `boolean`                       | `false`                | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)                                                                   |
| delimiter          | `string`                        | `,`                    | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                                                                        |
| autoUpload         | `boolean`                       | `true`                 | 否选择完就自动开始上传                                                                                                                           |
| hideUploadButton   | `boolean`                       | `false`                | 隐藏上传按钮                                                                                                                                     |
| fileField          | `string`                        | `file`                 | 如果你不想自己存储，则可以忽略此属性。                                                                                                           |
| crop               | `boolean`或`{"aspectRatio":""}` |                        | 用来设置是否支持裁剪。                                                                                                                           |
| crop.aspectRatio   | `number`                        |                        | 裁剪比例。浮点型，默认 `1` 即 `1:1`，如果要设置 `16:9` 请设置 `1.7777777777777777` 即 `16 / 9`。。                                               |
| crop.rotatable     | `boolean`                       | `false`                | 裁剪时是否可旋转                                                                                                                                 |
| crop.scalable      | `boolean`                       | `false`                | 裁剪时是否可缩放                                                                                                                                 |
| crop.viewMode      | `number`                        | `1`                    | 裁剪时的查看模式，0 是无限制                                                                                                                     |
| cropFormat         | `string`                        | `image/png`            | 裁剪文件格式                                                                                                                                     |
| cropQuality        | `number`                        | `1`                    | 裁剪文件格式的质量，用于 jpeg/webp，取值在 0 和 1 之间                                                                                           |
| limit              | Limit                           |                        | 限制图片大小，超出不让上传。                                                                                                                     |
| frameImage         | `string`                        |                        | 默认占位图地址                                                                                                                                   |
| fixedSize          | `boolean`                       |                        | 是否开启固定尺寸,若开启，需同时设置 fixedSizeClassName                                                                                           |
| fixedSizeClassName | `string`                        |                        | 开启固定尺寸时，根据此值控制展示尺寸。例如`h-30`,即图片框高为 h-30,AMIS 将自动缩放比率设置默认图所占位置的宽度，最终上传图片根据此尺寸对应缩放。 |
| initAutoFill       | `boolean`                       | `false`                | 表单反显时是否执行 autoFill                                                                                                                      |

### Limit 属性表

| 属性名      | 类型     | 默认值 | 说明                                                                                                                                                |
| ----------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| width       | `number` |        | 限制图片宽度。                                                                                                                                      |
| height      | `number` |        | 限制图片高度。                                                                                                                                      |
| minWidth    | `number` |        | 限制图片最小宽度。                                                                                                                                  |
| minHeight   | `number` |        | 限制图片最小高度。                                                                                                                                  |
| maxWidth    | `number` |        | 限制图片最大宽度。                                                                                                                                  |
| maxHeight   | `number` |        | 限制图片最大高度。                                                                                                                                  |
| aspectRatio | `number` |        | 限制图片宽高比，格式为浮点型数字，默认 `1` 即 `1:1`，如果要设置 `16:9` 请设置 `1.7777777777777777` 即 `16 / 9`。 如果不想限制比率，请设置空字符串。 |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`event.data.xxx`事件参数变量来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                                                                                                   | 说明                                     |
| -------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| change   | `event.data.file: Array<FileValue>` 上传的文件                                                             | 上传文件值变化时触发(上传失败同样会触发) |
| remove   | `event.data.file: FileValue` 被移除的文件                                                                  | 移除文件时触发                           |
| success  | `event.data.file: FileValue` 远程上传请求成功后返回的结果数据                                              | 上传成功时触发                           |
| fail     | `event.data.file: FileValue` 上传的文件 <br /> `event.data.error: object` 远程上传请求失败后返回的错误信息 | 上传文件失败时触发                       |

### FileValue 属性表

| 属性名 | 类型     | 说明                                               |
| ------ | -------- | -------------------------------------------------- |
| name   | `string` | 图片名称                                           |
| value  | `string` | 上传成功后返回的 url                               |
| state  | `string` | 文件当前状态,值可为 `pending` `uploaded` `invalid` |
| error  | `string` | 错误信息                                           |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置 | 说明 |
| -------- | -------- | ---- |
| clear    | -        | 清空 |

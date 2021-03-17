---
title: Image 图片
description:
type: 0
group: null
menuName: Image
icon:
order: 27
---

图片格式输入，需要实现接收器，提交时将以 url 的方式提交，如果需要以表单方式提交请使用 [File](file#手动上传)。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
        {
            "type": "image",
            "name": "image",
            "label": "image",
            "receiver": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/upload/file"
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
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
        {
            "type": "image",
            "name": "image",
            "label": "限制只能上传jpg图片",
            "accept": ".jpg",
            "receiver": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/upload/file"
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
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
        {
            "type": "image",
            "name": "image",
            "label": "限制只能上传宽度大于 1000 的图片",
            "accept": ".jpg",
            "limit": {
              "minWidth": 1000
            },
            "receiver": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/upload/file"
        }
    ]
}
```

## 支持裁剪

```schema: scope="body"
{
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
        {
            "type": "image",
            "name": "image",
            "label": "限制只能上传jpg图片",
            "accept": ".jpg",
            "receiver": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/upload/file",
            "crop": true
        }
    ]
}
```

## 自动填充

上传成功后，可以通过配置 `autoFill` 将上传接口返回的值填充到某个表单项中：

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "image",
      "name": "image",
      "label": "image",
      "receiver": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/upload/file",
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

这样上传成功后，会把接口中的 `url` 变量，赋值给 `myUrl` 变量

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名           | 类型                            | 默认值                 | 说明                                                                                                                                   |
| ---------------- | ------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| receiver         | [API](../../../docs/types/api)  |                        | 上传文件接口                                                                                                                           |
| accept           | `string`                        | `.jpeg,.jpg,.png,.gif` | 支持的图片类型格式，请配置此属性为图片后缀，例如`.jpg,.png`                                                                            |
| maxSize          | `number`                        |                        | 默认没有限制，当设置后，文件大小大于此值将不允许上传。单位为`B`                                                                        |
| maxLength        | `number`                        |                        | 默认没有限制，当设置后，一次只允许上传指定数量文件。                                                                                   |
| multiple         | `boolean`                       | `false`                | 是否多选。                                                                                                                             |
| joinValues       | `boolean`                       | `true`                 | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                                                             |
| extractValue     | `boolean`                       | `false`                | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)                                                         |
| delimeter        | `string`                        | `,`                    | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                                                              |
| autoUpload       | `boolean`                       | `true`                 | 否选择完就自动开始上传                                                                                                                 |
| hideUploadButton | `boolean`                       | `false`                | 隐藏上传按钮                                                                                                                           |
| fileField        | `string`                        | `file`                 | 如果你不想自己存储，则可以忽略此属性。                                                                                                 |
| crop             | `boolean`或`{"aspectRatio":""}` |                        | 用来设置是否支持裁剪。                                                                                                                 |
| crop.aspectRatio | `number`                        |                        | 裁剪比例。浮点型，默认 `1` 即 `1:1`，如果要设置 `16:9` 请设置 `1.7777777777777777` 即 `16 / 9`。。                                     |
| crop.rotatable   | `boolean`                       | `false`                | 裁剪时是否可旋转                                                                                                                       |
| crop.scalable    | `boolean`                       | `false`                | 裁剪时是否可缩放                                                                                                                       |
| crop.viewMode    | `number`                        | `1`                    | 裁剪时的查看模式，0 是无限制                                                                                                           |
| limit            | Limit                           |                        | 限制图片大小，超出不让上传。                                                                                                           |
| defaultImage     | `string`                        |                        | 默认占位图地址                                                                                                                         |
| fixedSize        | `string`                        |                        | 默认占位图尺寸类名。例如`w-50 h-30`,即图片框宽为 w-50,高 w 为 h-30,最终上传图片根据此尺寸对应缩放;也可只传入高度类名，宽度会自适应撑开 |

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

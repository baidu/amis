---
title: QRCode 二维码
description:
type: 0
group: ⚙ 组件
menuName: QRCode 二维码
icon:
order: 61
---

## 基本用法

```schema: scope="body"
{
    "type": "qr-code",
    "codeSize": 128,
    "value": "https://www.baidu.com"
}
```

> 根据 QR 码国际标准，二进制模式最多可存储`2953`字节的内容（1 中文汉字=2 字节）

## 配置背景色

背景色默认为`#fff`（纯白色）, `backgroundColor`属性可以修改背景色。

```schema: scope="body"
[
    {
        "type": "qr-code",
        "codeSize": 128,
        "backgroundColor": "#108cee",
        "foregroundColor": "#000",
        "value": "https://www.baidu.com"
    }
]
```

## 配置前景色

前景色默认为`#000`（纯黑色）, `foregroundColor`属性可以前景色。

```schema: scope="body"
[
    {
        "type": "qr-code",
        "codeSize": 128,
        "backgroundColor": "#fff",
        "foregroundColor": "#108cee",
        "value": "https://www.baidu.com"
    }
]
```

## 纠错等级

`level`属性可以设置二维码的纠错等级，纠错等级分为四种（`'L' 'M' 'Q' 'H'`），从左到右依次提升，默认为`'L'`。

```schema: scope="body"
{
  "type": "hbox",
  "columns": [
    {
      "type": "qr-code",
      "codeSize": 128,
      "level": "L",
      "value": "https://www.baidu.com"
    },
    {
      "type": "qr-code",
      "codeSize": 128,
      "level": "M",
      "value": "https://www.baidu.com"
    },
    {
      "type": "qr-code",
      "codeSize": 128,
      "level": "Q",
      "value": "https://www.baidu.com"
    },
    {
      "type": "qr-code",
      "codeSize": 128,
      "level": "H",
      "value": "https://www.baidu.com"
    }
  ]
}
```

## 嵌入图片

`imageSettings`属性可以设置二维码中嵌入的图片，`src`设置图片链接地址，图片大小默认为二维码大小的 10%，图片位置默认水平垂直居中。

> 1.10.0 及以上版本。
> 建议根据图片大小，调整二维码纠错等级，避免图片遮挡导致二维码无法被正确识别

```schema: scope="body"
{
    "type": "qr-code",
    "codeSize": 128,
    "level": "Q",
    "value": "https://www.baidu.com",
    "imageSettings": {
      "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg",
    }
}
```

### 关联上下文变量

```schema: scope="body"
{
    "type": "page",
    "data": {
        "imgSrc": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg"
    },
    "body": {
        "type": "qr-code",
        "codeSize": 128,
        "level": "Q",
        "value": "https://www.baidu.com",
        "imageSettings": {
            "width": 50,
            "height": 30,
            "src": "${imgSrc}"
        }
    }

}
```

### 图片宽高

`width` 和 `height` 可以设置图片的宽度和高度。

```schema: scope="body"
{
    "type": "qr-code",
    "codeSize": 128,
    "level": "Q",
    "value": "https://www.baidu.com",
    "imageSettings": {
      "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg",
      "width": 50,
      "height": 30
    }
}
```

### 图片偏移量

以二维码**左上角**为原点，`x`，`y`分别设置图片的水平偏移量和垂直偏移量。示例通过`codeSize`和图片的`width` 和 `height` 计算出偏移量`{"x": 78, "y": 98}`，使图片位于右下角。

```schema: scope="body"
{
    "type": "qr-code",
    "codeSize": 128,
    "level": "Q",
    "value": "https://www.baidu.com",
    "imageSettings": {
      "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg",
      "width": 50,
      "height": 30,
      "x": 78,
      "y": 98
    }
}
```

### 挖孔嵌入

设置`excavate: true`，可以在二维码图片中挖孔，视觉上使图片和二维码处于同一图层。

```schema: scope="body"

{
  "type": "hbox",
  "columns": [
    {
      "type": "qr-code",
      "codeSize": 128,
      "level": "Q",
      "value": "https://www.baidu.com",
      "imageSettings": {
        "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg",
        "width": "50",
        "height": "30",
        "excavate": false
      }
    },
    {
      "type": "qr-code",
      "codeSize": 128,
      "level": "Q",
      "value": "https://www.baidu.com",
      "imageSettings": {
        "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg",
        "width": "50",
        "height": "30",
        "excavate": true
      }
    }
  ]
}

```

## 属性表

| 属性名                 | 类型                                 | 默认值                    | 说明                                                                                                                                  |
| ---------------------- | ------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| type                   | `string`                             | `"qr-code"`               | 指定为 QRCode 渲染器                                                                                                                  |
| className              | `string`                             |                           | 外层 Dom 的类名                                                                                                                       |
| qrcodeClassName        | `string`                             |                           | 二维码 SVG 的类名                                                                                                                     |
| codeSize               | `number`                             | `128`                     | 二维码的宽高大小                                                                                                                      |
| backgroundColor        | `string`                             | `"#fff"`                  | 二维码背景色                                                                                                                          |
| foregroundColor        | `string`                             | `"#000"`                  | 二维码前景色                                                                                                                          |
| level                  | `string`                             | `"L"`                     | 二维码复杂级别，有（'L' 'M' 'Q' 'H'）四种                                                                                             |
| value                  | [模板](../../docs/concepts/template) | `"https://www.baidu.com"` | 扫描二维码后显示的文本，如果要显示某个页面请输入完整 url（`"http://..."`或`"https://..."`开头），支持使用 [模板](./concepts/template) |
| imageSettings          | `object`                             |                           | QRCode 图片配置                                                                                                                       |
| imageSettings.src      | `string`                             |                           | 图片链接地址                                                                                                                          |
| imageSettings.width    | `number`                             | 默认为`codeSize`的 10%    | 图片宽度                                                                                                                              |
| imageSettings.height   | `number`                             | 默认为`codeSize`的 10%    | 图片高度                                                                                                                              |
| imageSettings.x        | `number`                             | 默认水平居中              | 图片水平方向偏移量                                                                                                                    |
| imageSettings.y        | `number`                             | 默认垂直居中              | 图片垂直方向偏移量                                                                                                                    |
| imageSettings.excavate | `boolean`                            | `false`                   | 图片是否挖孔嵌入                                                                                                                      |

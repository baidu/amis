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

## 不同复杂度

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

## 属性表

| 属性名          | 类型                                 | 默认值                    | 说明                                                                                                                                  |
| --------------- | ------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| type            | `string`                             | `"qr-code"`               | 指定为 QRCode 渲染器                                                                                                                  |
| className       | `string`                             |                           | 外层 Dom 的类名                                                                                                                       |
| qrcodeClassName | `string`                             |                           | 二维码 SVG 的类名                                                                                                                     |
| codeSize        | `number`                             | `128`                     | 二维码的宽高大小                                                                                                                      |
| backgroundColor | `string`                             | `"#fff"`                  | 二维码背景色                                                                                                                          |
| foregroundColor | `string`                             | `"#000"`                  | 二维码前景色                                                                                                                          |
| level           | `string`                             | `"L"`                     | 二维码复杂级别，有（'L' 'M' 'Q' 'H'）四种                                                                                             |
| value           | [模板](../../docs/concepts/template) | `"https://www.baidu.com"` | 扫描二维码后显示的文本，如果要显示某个页面请输入完整 url（`"http://..."`或`"https://..."`开头），支持使用 [模板](./concepts/template) |

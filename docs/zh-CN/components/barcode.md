---
title: BarCode 条形码
description:
type: 0
group: ⚙ 组件
menuName: BarCode 条形码
icon:
order: 62
---

## 基本用法

```schema: scope="body"
{
    "type": "barcode",
    "value": "amis"
}
```

## 条形码配置

通过 options 属性配置，具体请参考[这里](https://github.com/lindell/JsBarcode/wiki/Options)，比如

```schema: scope="body"
{
    "type": "barcode",
    "value": "123",
    "options": {
      "format": "pharmacode",
      "lineColor": "#0aa",
      "width": "4",
      "height": "40",
    }
}
```

## 属性表

| 属性名    | 类型     | 默认值 | 说明                           |
| --------- | -------- | ------ | ------------------------------ |
| className | `string` |        | 外层 CSS 类名                  |
| value     | `string` |        | 显示的颜色值                   |
| name      | `string` |        | 在其他组件中，时，用作变量映射 |

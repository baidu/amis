---
title: InputColor 颜色选择器
description:
type: 0
group: null
menuName: InputColor
icon:
order: 11
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-color",
            "name": "color",
            "label": "颜色"
        }
    ]
}
```

## 选择器预设颜色值

颜色选择器底部预设有会写可选的颜色值，默认为：`['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']`

你可以配置`presetColors`数组进行自定义。

## rgba

将 `format` 设置为 rgba 就能改变颜色透明度。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-color",
            "name": "color",
            "label": "颜色",
            "format": "rgba"
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名           | 类型            | 默认值                                                                                                 | 说明                                                          |
| ---------------- | --------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| format           | `string`        | `hex`                                                                                                  | 请选择 `hex`、`hls`、`rgb`或者`rgba`。                        |
| presetColors     | `Array<string>` | [见选择器预设颜色值](./color#%E9%80%89%E6%8B%A9%E5%99%A8%E9%A2%84%E8%AE%BE%E9%A2%9C%E8%89%B2%E5%80%BC) | 选择器底部的默认颜色，数组内为空则不显示默认颜色              |
| allowCustomColor | `boolean`       | `true`                                                                                                 | 为`false`时只能选择颜色，使用 `presetColors` 设定颜色选择范围 |
| clearable        | `boolean`       | `"label"`                                                                                              | 是否显示清除按钮                                              |
| resetValue       | `string`        | `""`                                                                                                   | 清除后，表单项值调整成该值                                    |

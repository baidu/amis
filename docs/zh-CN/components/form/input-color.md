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
            "label": "普通色盘"
        }
    ]
}
```

## 选择器预设颜色值

颜色选择器底部预设有会写可选的颜色值，默认为：

```
['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']
```

你可以配置`presetColors`数组进行自定义。颜色支持两种格式`string` 和 `{color: string; title: string}`，并支持两种格式混合使用。`string`格式支持所有合法的 CSS 颜色码，`object`类型下的`color`属性为 CSS 颜色码，`title`属性为颜色名称，鼠标悬浮于色块时会显示对应颜色名称。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-color",
            "name": "color",
            "label": "自定义预设色盘",
            "presetColors": [
                {"color": "#d4380d", "title": "熔岩红"},
                {"color": "#ffa940", "title": "金桔橙"},
                {"color": "#ffec3d", "title": "土豪金"},
                {"color": "#73d13d", "title": "苹果绿"},
                {"color": "#73E3EC", "title": "蒂芙尼青"},
                {"color": "#2f54eb", "title": "冰川蓝"},
                {"color": "#9254de", "title": "薰衣草紫"},
                {"color": "#ffc0cb", "title": "樱花粉"},
                "rgb(212, 56, 13)", "rgba(255, 169, 64, 1.0)", "hsl(54,100%,62%)", "hsla(98, 62%, 53%, 1.0)", "#73E3EC", "#2f54eb", "#9254de", "pink"
            ]

        }
    ]
}
```

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
            "label": "带透明度调节的色盘",
            "format": "rgba"
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名           | 类型            | 默认值                                                                                                     | 说明                                                          |
| ---------------- | --------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| format           | `string`        | `hex`                                                                                                      | 请选择 `hex`、`hls`、`rgb`或者`rgba`。                        |
| presetColors     | `Array<string>` | [选择器预设颜色值](./input-color#%E9%80%89%E6%8B%A9%E5%99%A8%E9%A2%84%E8%AE%BE%E9%A2%9C%E8%89%B2%E5%80%BC) | 选择器底部的默认颜色，数组内为空则不显示默认颜色              |
| allowCustomColor | `boolean`       | `true`                                                                                                     | 为`false`时只能选择颜色，使用 `presetColors` 设定颜色选择范围 |
| clearable        | `boolean`       | `"label"`                                                                                                  | 是否显示清除按钮                                              |
| resetValue       | `string`        | `""`                                                                                                       | 清除后，表单项值调整成该值                                    |

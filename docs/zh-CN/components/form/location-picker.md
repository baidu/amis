---
title: LocationPicker 地理位置
description:
type: 0
group: null
menuName: LocationPicker
icon:
order: 30
---

用于选择地理位置

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "location-picker",
      "name": "location",
      "ak": "LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7",
      "label": "地址"
    }
  ]
}
```

注意其中的 `ak` 参数只能在 amis 官网示例中使用，请前往[百度地图开放平台](http://lbsyun.baidu.com/)申请自己的 `ak`。

## 高德地图（暂不支持）

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "location-picker",
      "name": "location",
      "vendor": "gaode",
      "ak": "8ae6a7549ce3f37f8e5aab9d445df8ad",
      "label": "地址"
    },
  ]
}
```

高的地图需要设置 `vendor` 为 `gaode`，并且需要设置 `ak`。其中的 ak 参数为随机值, 请替换为自己申请的 `ak` , 高德地图的 `ak` 申请地址：[高德地图开放平台](https://lbs.amap.com/)

请注意: **_高德地图不支持坐标转换_**

## 属性表

| 属性名          | 类型      | 默认值             | 说明                                                       |
| --------------- | --------- | ------------------ | ---------------------------------------------------------- |
| vendor          | 'baidu'   | 'baidu' \| 'gaode' | 地图厂商，目前只实现了百度地图和高德地图                   |
| ak              | `string`  | 无                 | 百度/高德地图的 ak                                         |
| clearable       | `boolean` | false              | 输入框是否可清空                                           |
| placeholder     | `string`  | '请选择位置'         | 默认提示                                                   |
| autoSelectCurrentLoc     | `boolean`  | false    | 是否自动选中当前地理位置                                 |
| onlySelectCurrentLoc     | `boolean`  | false    | 是否限制只能选中当前地理位置，设置为true后，可用于充当定位组件 |
| coordinatesType | `string`  | 'bd09'             | 默为百度/高德坐标，可设置为'gcj02', 高德地图不支持坐标转换   |

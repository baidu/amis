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

## 属性表

| 属性名          | 类型      | 默认值       | 说明                           |
| --------------- | --------- | ------------ | ------------------------------ |
| vendor          | 'baidu'   | 'baidu'      | 地图厂商，目前只实现了百度地图 |
| ak              | `string`  | 无           | 百度地图的 ak                  |
| clearable       | `boolean` | false        | 输入框是否可清空               |
| placeholder     | `string`  | '请选择位置' | 默认提示                       |
| coordinatesType | `string`  | 'bd09'       | 默为百度坐标，可设置为'gcj02'  |

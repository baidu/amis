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

## 静态展示

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
    {
      "type": "location-picker",
      "name": "location",
      "ak": "LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7",
      "label": "默认展示方式",
      "value": {
        "address": "北京市西城区复兴门内大街97号",
        "lat": 39.91404014231763,
        "lng": 116.36857981150743,
        "zoom": 12
      },
      "static": true
    },
    {
      "type": "location-picker",
      "name": "location",
      "ak": "LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7",
      "label": "内嵌地图展示",
      "value": {
        "address": "北京市西城区复兴门内大街97号",
        "lat": 39.91404014231763,
        "lng": 116.36857981150743,
        "zoom": 12
      },
      "static": true,
      "staticSchema": {
        "embed": true,
        "showAddress": true
      }
    }
  ]
}
```

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

高德地图需要设置 `vendor` 为 `gaode`，并且需要设置 `ak`。其中的 ak 参数为随机值， 请替换为自己申请的 `ak` ， 高德地图的 `ak` 申请地址：[高德地图开放平台](https://lbs.amap.com/)

请注意: **_高德地图不支持坐标转换_**

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名                   | 类型               | 默认值                               | 说明                                                                             |
| ------------------------ | ------------------ | ------------------------------------ | -------------------------------------------------------------------------------- |
| value                    | `LocationData`     | 参考 [`LocationData`](#LocationData) |                                                                                  |
| vendor                   | 'baidu' \| 'gaode' | 'baidu'                              | 地图厂商，目前只实现了百度地图和高德地图                                         |
| ak                       | `string`           | 无                                   | 百度/高德地图的 ak                                                               |
| clearable                | `boolean`          | false                                | 输入框是否可清空                                                                 |
| placeholder              | `string`           | '请选择位置'                         | 默认提示                                                                         |
| autoSelectCurrentLoc     | `boolean`          | false                                | 是否自动选中当前地理位置                                                         |
| onlySelectCurrentLoc     | `boolean`          | false                                | 是否限制只能选中当前地理位置，设置为 true 后，可用于充当定位组件                 |
| coordinatesType          | 'bd09' \| 'gcj02'  | 'bd09'                               | 坐标系类型，默认百度坐标，使用高德地图时应设置为'gcj02'， 高德地图不支持坐标转换 |
| staticSchema             | `object`           |                                      | 静态展示，内嵌模式`{static: true: embed: true}`时的额外配置                      |
| staticSchema.embed       | `boolean`          | false                                | 是否内嵌地图展示地理位置                                                         |
| staticSchema.showAddress | `boolean`          | true                                 | 内嵌模式是否展示文字地址                                                         |
| staticSchema.showGeoLoc  | `boolean`          | false                                | 内嵌模式是否展示定位当当前控件                                                   |
| staticSchema.mapStyle    | `object`           |                                      | 内嵌模式地图的样式，可以传宽高控制大小                                           |

### 坐标系说明

- bd09：百度坐标系，在 GCJ02 坐标系基础上再次加密。
- gcj02：火星坐标系，是由中国国家测绘局制定的地理坐标系统。

### LocationData

| 属性值  | 类型               | 是否必填 | 说明                    |
| ------- | ------------------ | -------- | ----------------------- |
| address | `string`           | 是       | 地址信息                |
| lng     | `number`           | 是       | 经度，范围：[-180, 180] |
| lat     | `number`           | 是       | 维度，范围：[-90, 90]   |
| vendor  | 'baidu' \| 'gaode' | 否       | 地图厂商类型            |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                        | 说明             |
| -------- | ------------------------------- | ---------------- |
| change   | `[name]: LocationData` 组件的值 | 选中值变化时触发 |

### change

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
      {
        "type": "location-picker",
        "name": "location",
        "ak": "LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7",
        "label": "地址",
        "onEvent": {
            "change": {
                "actions": [
                    {
                      "actionType": "toast",
                      "args": {
                          "msg": "${event.data.value|json}"
                      }
                    }
                ]
            }
        }
      }
    ]
  }
```

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置 | 说明                                             |
| -------- | -------- | ------------------------------------------------ |
| clear    | -        | 清空                                             |
| reset    | -        | 将值重置为初始值。6.3.0 及以下版本为`resetValue` |
| setValue | `value`  | 参考 [`LocationData`](#LocationData)             |

### clear

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "type": "location-picker",
          "name": "location",
          "ak": "LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7",
          "label": "地址",
          "value": {
            "address":"北京市西城区府右街131号",
            "lat":39.916383659908185,
            "lng":116.38854914523102,
            "city":"北京市",
            "vendor":"baidu"
          },
          "id": "clear_text"
        },
        {
            "type": "button",
            "label": "清空",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "clear",
                            "componentId": "clear_text"
                        }
                    ]
                }
            }
        }
    ]
}
```

### reset

如果配置了`resetValue`，则重置时使用`resetValue`的值，否则使用初始值。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "type": "location-picker",
          "name": "location",
          "ak": "LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7",
          "label": "地址",
          "value": {
            "address":"北京市西城区府右街131号",
            "lat":39.916383659908185,
            "lng":116.38854914523102,
            "city":"北京市",
            "vendor":"baidu"
          },
          "id": "reset_text"
        },
        {
            "type": "button",
            "label": "重置",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "reset",
                            "componentId": "reset_text"
                        }
                    ]
                }
            }
        }
    ]
}
```

### setValue

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "type": "location-picker",
          "name": "location",
          "ak": "LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7",
          "label": "地址",
          "id": "setvalue_text"
        },
        {
            "type": "button",
            "label": "赋值",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "setValue",
                            "componentId": "setvalue_text",
                            "args": {
                                "value": {
                                  "address":"北京市西城区府右街131号",
                                  "lat":39.916383659908185,
                                  "lng":116.38854914523102,
                                  "city":"北京市",
                                  "vendor":"baidu"
                                }
                            }
                        }
                    ]
                }
            }
        }
    ]
}
```

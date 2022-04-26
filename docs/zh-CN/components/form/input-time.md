---
title: InputTime 时间
description:
type: 0
group: null
menuName: InputTime 时间
icon:
order: 58
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-time",
            "name": "time",
            "label": "时间"
        }
    ]
}
```

## 显示格式

选中任意时间，可以看到默认显示时间的格式是像`01:01`这样的格式，如果你想要自定义显示格式，那么可以配置`inputFormat`。

例如你想显示`01时01分`这样的格式，查找 moment 文档可知配置格式应为 `HH时mm分`，即：

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-time",
            "name": "time",
            "label": "时间",
            "inputFormat": "HH时mm分"
        }
    ]
}
```

调整时间，观察显示格式

## 值格式

选中任意时间，可以看到默认表单项的值格式是像`1591862818`这样的时间戳格式。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-time",
            "name": "time",
            "label": "时间"
        }
    ]
}
```

如果你想要其他格式的日期值，那么可以配置`format`参数用于调整表单项的值格式。

例如你调整值为`01:11`这样的格式，查找 moment 文档可知配置格式应为 `HH:mm`，即：

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-time",
            "name": "time",
            "label": "时间",
            "format": "HH:mm"
        }
    ]
}
```

调整时间，观察数据域中表单项值的变化

## 显示秒

默认显示的是时和分，要显示秒请参考以下配置

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-time",
            "name": "time",
            "label": "时间",
            "format": "HH:mm:ss",
            "timeFormat": "HH:mm:ss",
            "inputFormat": "HH:mm:ss"
        }
    ]
}
```

## 默认值

可以设置`value`属性，设置日期选择器的默认值

### 基本配置

配置符合当前 [值格式](./date#%E5%80%BC%E6%A0%BC%E5%BC%8F) 的默认值。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-time",
            "name": "time",
            "label": "时间",
            "value": "1591862818"
        }
    ]
}
```

### 相对值

`value` 还支持类似像`"+1hours"`这样的相对值，更加便捷的配置默认值

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-time",
            "name": "time",
            "label": "时间",
            "value": "+1hours"
        }
    ]
}
```

上例中配置了`"value": "+1hours"`，默认就会选中一小时后。

支持的相对值关键字有：

- `now`: 当前时间
- `hour`或`hours`: 时
- `minute`或`minutes`: 分
- `second`或`seconds`: 秒

## 控制输入范围

通过 `timeConstraints` 属性可以控制输入范围

默认值是

```json
{
  "hours": {
    "min": 0,
    "max": 23,
    "step": 1
  },
  "minutes": {
    "min": 0,
    "max": 59,
    "step": 1
  },
  "seconds": {
    "min": 0,
    "max": 59,
    "step": 1
  },
  "milliseconds": {
    "min": 0,
    "max": 999,
    "step": 1
  }
}
```

可以只修改其中的部分值，比如下面的示例将分钟每次加减改成了 15，小时的范围限制在 9 到 17

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-time",
            "name": "time",
            "label": "时间",
            "timeConstraints": {
                "hours": {
                    "min": 9,
                    "max": 17
                },
                "minutes": {
                    "step": 15
                }
            }
        }
    ]
}
```

## 原生时间组件

原生时间组件将直接使用浏览器的实现，最终展现效果和浏览器有关，而且只支持 `min`、`max`、`step` 这几个属性设置。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "native-time",
            "name": "time",
            "label": "时间"
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名          | 类型      | 默认值         | 说明                                                                                |
| --------------- | --------- | -------------- | ----------------------------------------------------------------------------------- |
| value           | `string`  |                | [默认值](./date#%E9%BB%98%E8%AE%A4%E5%80%BC)                                        |
| timeFormat      | `string`  | `HH:mm`        | 时间选择器值格式，更多格式类型请参考 [moment](http://momentjs.com/)                 |
| format          | `string`  | `X`            | 时间选择器值格式，更多格式类型请参考 [moment](http://momentjs.com/)                 |
| inputFormat     | `string`  | `HH:mm`        | 时间选择器显示格式，即时间戳格式，更多格式类型请参考 [moment](http://momentjs.com/) |
| placeholder     | `string`  | `"请选择时间"` | 占位文本                                                                            |
| clearable       | `boolean` | `true`         | 是否可清除                                                                          |
| timeConstraints | `object`  | `true`         |                                                                                     |

## 事件表

| 事件名称 | 事件参数               | 说明                 |
| -------- | ---------------------- | -------------------- |
| change   | `value: string` 时间值 | 值变化               |
| focus    | -                      | 获得焦点(非内嵌模式) |
| blur     | -                      | 失去焦点(非内嵌模式) |

## 动作表

| 动作名称 | 动作配置                     | 说明                                                   |
| -------- | ---------------------------- | ------------------------------------------------------ |
| clear    | -                            | 清空                                                   |
| reset    | -                            | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: string` 更新的时间值 | 更新数据，依赖格式`format`，例如：'1648746120'         |

---
title: InputTimeRange 时间范围
description:
type: 0
group: null
menuName: InputTimeRange
icon:
order: 15
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-time-range",
            "name": "times",
            "label": "时间范围"
        }
    ]
}
```

## 内嵌模式

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-time-range",
            "name": "times",
            "label": "时间范围",
            "embed": true
        }
    ]
}
```

## 显示秒

默认显示的是时和分，要显示秒请参考以下配置

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-time-range",
            "name": "times",
            "label": "时间范围",
            "timeFormat": "HH:mm:ss",
            "format": "HH:mm:ss",
            "inputFormat": "HH:mm:ss"
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名      | 类型      | 默认值             | 说明                                                                  |
| ----------- | --------- | ------------------ | --------------------------------------------------------------------- |
| timeFormat  | `string`  | `HH:mm`            | [时间范围选择器值格式](./date#%E5%80%BC%E6%A0%BC%E5%BC%8F)            |
| format      | `string`  | `HH:mm`            | [时间范围选择器值格式](./date#%E5%80%BC%E6%A0%BC%E5%BC%8F)            |
| inputFormat | `string`  | `HH:mm`            | [时间范围选择器显示格式](./date#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F) |
| placeholder | `string`  | `"请选择时间范围"` | 占位文本                                                              |
| clearable   | `boolean` | `true`             | 是否可清除                                                            |
| embed       | `boolean` | `false`            | 是否内联模式                                                          |


## 事件表

| 事件名称           | 事件参数                                        | 说明                  |
|-------------------|------------------------------------------------|----------------------|
| focus             | -                                 |  获得焦点(非内嵌模式)               |
| blur              | -                                 |  失去焦点(非内嵌模式)               |

## 动作表

| 动作名称           | 动作配置                 | 说明                    |
|-------------------|-------------------------|------------------------|
| clear             | -                       | 清空                    |
| reset             | `resetValue: [Date, Date]`           | 值重置                   |
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
    "debug": true,
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

| 属性名      | 类型      | 默认值             | 说明                                                                  | 版本    |
| ----------- | --------- | ------------------ | --------------------------------------------------------------------- | ------- |
| timeFormat  | `string`  | `HH:mm`            | [时间范围选择器值格式](./date#%E5%80%BC%E6%A0%BC%E5%BC%8F)            |
| format      | `string`  | `HH:mm`            | [时间范围选择器值格式](./date#%E5%80%BC%E6%A0%BC%E5%BC%8F)            |
| inputFormat | `string`  | `HH:mm`            | [时间范围选择器显示格式](./date#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F) |
| placeholder | `string`  | `"请选择时间范围"` | 占位文本                                                              |
| clearable   | `boolean` | `true`             | 是否可清除                                                            |
| embed       | `boolean` | `false`            | 是否内联模式                                                          |
| animation   | `boolean` | `true`             | 是否启用游标动画                                                      | `2.2.0` |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.1 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                  | 说明                             |
| -------- | ------------------------- | -------------------------------- |
| change   | `[name]: string` 组件的值 | 时间值变化时触发                 |
| focus    | `[name]: string` 组件的值 | 输入框获取焦点(非内嵌模式)时触发 |
| blur     | `[name]: string` 组件的值 | 输入框失去焦点(非内嵌模式)时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                                    | 说明                                                     |
| -------- | ------------------------------------------- | -------------------------------------------------------- |
| clear    | -                                           | 清空                                                     |
| reset    | -                                           | 将值重置为`resetValue`，若没有配置`resetValue`，则清空   |
| setValue | `value: string` 更新的时间区间值，用`,`隔开 | 更新数据，依赖格式`format`，例如 '1617206400,1743436800' |

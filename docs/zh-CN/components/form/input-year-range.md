---
title: InputYearRange 年份范围
description:
type: 0
group: null
menuName: InputYearRange
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
            "type": "input-year-range",
            "name": "year-range",
            "label": "年份范围"
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
            "type": "input-year-range",
            "name": "year-range",
            "label": "年份范围",
            "embed": true
        }
    ]
}
```

## 存成两个字段

默认年份范围存储一个字段，用 `delimiter` 分割，如果配置 `extraName` 则会存两个字段。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-year-range",
            "name": "begin",
            "extraName": "end",
            "label": "年份范围"
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名                   | 类型      | 默认值             | 说明                                                                               | 版本    |
| ------------------------ | --------- | ------------------ | ---------------------------------------------------------------------------------- | ------- |
| valueFormat              | `string`  | `X`                | [年份选择器值格式](./input-date#%E5%80%BC%E6%A0%BC%E5%BC%8F)                       | `3.4.0` |
| displayFormat            | `string`  | `YYYY`             | [年份选择器显示格式](./input-date#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F)            | `3.4.0` |
| placeholder              | `string`  | `"请选择年份范围"` | 占位文本                                                                           |
| minDate                  | `string`  |                    | 限制最小日期，用法同 [限制范围](./input-date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| maxDate                  | `string`  |                    | 限制最大日期，用法同 [限制范围](./input-date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| minDuration              | `string`  |                    | 限制最小跨度，如： 2year                                                           |
| maxDuration              | `string`  |                    | 限制最大跨度，如：4year                                                            |
| utc                      | `boolean` | `false`            | [保存 UTC 值](./input-date#utc)                                                    |
| clearable                | `boolean` | `true`             | 是否可清除                                                                         |
| embed                    | `boolean` | `false`            | 是否内联模式                                                                       |
| animation                | `boolean` | `true`             | 是否启用游标动画                                                                   | `2.2.0` |
| popOverContainerSelector | `string`  |                    | 弹层挂载位置选择器，会通过`querySelector`获取                                      | `6.4.0` |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

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
| reset    | -                                           | 将值重置为初始值。6.3.0 及以下版本为`resetValue`         |
| setValue | `value: string` 更新的时间区间值，用`,`隔开 | 更新数据，依赖格式`format`，例如 '1648746120,1648760760' |

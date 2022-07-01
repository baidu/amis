---
title: Year 年份选择
description:
type: 0
group: null
menuName: Year 年份选择
icon:
order: 61
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-year",
            "name": "year",
            "label": "年份选择"
        }
    ]
}
```

更多用法和配置可以参考 [InputDate 日期](input-date)，year 就是 data 的特定配置，所以 data 的所有配置都能使用。

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`event.data.xxx`事件参数变量来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                          | 说明                             |
| -------- | --------------------------------- | -------------------------------- |
| change   | `event.data.value: string` 时间值 | 时间值变化时触发                 |
| focus    | `event.data.value: string` 时间值 | 输入框获取焦点(非内嵌模式)时触发 |
| blur     | `event.data.value: string` 时间值 | 输入框失去焦点(非内嵌模式)时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                     | 说明                                                   |
| -------- | ---------------------------- | ------------------------------------------------------ |
| clear    | -                            | 清空                                                   |
| reset    | -                            | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: string` 更新的时间值 | 更新数据，依赖格式`format`，例如：'1617206400'         |

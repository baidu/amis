---
title: InputDateRange 日期范围
description:
type: 0
group: null
menuName: InputDateRange
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
            "type": "input-date-range",
            "name": "select",
            "label": "日期范围"
        }
    ]
}
```

## 默认值

通过 value 设置默认值，除了实际值，比如

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date-range",
            "name": "date",
            "label": "日期范围",
            "value": "1659283200,1661961599"
        }
    ]
}
```

还可以是相对值，比如最近一周内

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date-range",
            "name": "date",
            "label": "日期范围",
            "value": "today,+1weeks"
        }
    ]
}
```

支持的相对值关键字有：

- today: 当前日期
- day 或 days: 天
- week 或 weeks: 周
- month 或 months: 月
- year 或 years: 年

## 快捷键

`ranges`属性支持自定义快捷选择日期范围快捷键

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date-range",
            "name": "select",
            "label": "日期范围",
              "ranges": [
                "7daysago",
                "15dayslater",
                "2weeksago",
                "1weekslater",
                "thismonth",
                "2monthsago",
                "3monthslater"
            ]
        }
    ]
}
```

支持的快捷键有

- `today`: 今天
- `yesterday`: 昨天
- `tomorrow`: 明天
- `prevweek`: 上周
- `thisweek`: 这个周
- `thismonth`: 本月
- `prevmonth`: 上个月
- `prevquarter`: 上个季度
- `thisquarter`: 这个季度
- `thisyear`: 今年
- `lastYear`: 去年
- `{n}daysago` : 最近 n 天，例如：`7daysago`，下面用法相同
- `{n}dayslater`: n 天以内
- `{n}weeksago`: 最近 n 周
- `{n}weekslater`: n 周以内
- `{n}monthsago`: 最近 n 月
- `{n}monthslater`: n 月以内
- `{n}quartersago`: 最近 n 季度
- `{n}quarterslater`: n 季度以内
- `{n}yearsago`: 最近 n 年
- `{n}yearslater`: n 年以内

## 内嵌模式

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-date-range",
            "name": "date",
            "label": "日期范围",
            "embed": true
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名      | 类型                      | 默认值                                                          | 说明                                                                         | 版本    |
| ----------- | ------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------- |
| format      | `string`                  | `X`                                                             | [日期选择器值格式](./date#%E5%80%BC%E6%A0%BC%E5%BC%8F)                       |
| inputFormat | `string`                  | `YYYY-MM-DD`                                                    | [日期选择器显示格式](./date#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F)            |
| placeholder | `string`                  | `"请选择日期范围"`                                              | 占位文本                                                                     |
| ranges      | `Array<string> 或 string` | `"yesterday,7daysago,prevweek,thismonth,prevmonth,prevquarter"` | 日期范围快捷键                                                               |
| minDate     | `string`                  |                                                                 | 限制最小日期，用法同 [限制范围](./date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| maxDate     | `string`                  |                                                                 | 限制最大日期，用法同 [限制范围](./date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| minDuration | `string`                  |                                                                 | 限制最小跨度，如： 2days                                                     |
| maxDuration | `string`                  |                                                                 | 限制最大跨度，如：1year                                                      |
| utc         | `boolean`                 | `false`                                                         | [保存 UTC 值](./date#utc)                                                    |
| clearable   | `boolean`                 | `true`                                                          | 是否可清除                                                                   |
| embed       | `boolean`                 | `false`                                                         | 是否内联模式                                                                 |
| animation   | `boolean`                 | `true`                                                          | 是否启用游标动画                                                             | `2.2.0` |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`event.data.xxx`事件参数变量来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                          | 说明                             |
| -------- | --------------------------------- | -------------------------------- |
| change   | `event.data.value: string` 时间值 | 时间值变化时触发                 |
| focus    | `event.data.value: string` 时间值 | 输入框获取焦点(非内嵌模式)时触发 |
| blur     | `event.data.value: string` 时间值 | 输入框失去焦点(非内嵌模式)时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                                    | 说明                                                        |
| -------- | ------------------------------------------- | ----------------------------------------------------------- |
| clear    | -                                           | 清空                                                        |
| reset    | -                                           | 将值重置为`resetValue`，若没有配置`resetValue`，则清空      |
| setValue | `value: string` 更新的时间区间值，用`,`隔开 | 更新数据，，依赖格式`format`，例如：'1650556800,1652889599' |

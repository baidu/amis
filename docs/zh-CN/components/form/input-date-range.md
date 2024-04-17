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

或者用公式来配置复杂情况， 比如本周一到周日

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date-range",
            "name": "date",
            "label": "日期范围",
            "value": "${DATETOSTR(DATEMODIFY(STARTOF(NOW(), 'week'), 1, 'day'), 'X') + ',' + DATETOSTR(DATEMODIFY(ENDOF(NOW(), 'week'), '1', 'day'), 'X')}"
        }
    ]
}
```

> 因为默认周日是第一天，所以需要往后加一天

再看个上月第一天到上月最后一天的例子

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date-range",
            "name": "date",
            "label": "日期范围",
            "value": "${DATETOSTR(STARTOF(DATEMODIFY(NOW(), -1, 'month'), 'month'), 'X') + ',' + DATETOSTR(ENDOF(DATEMODIFY(NOW(), -1, 'month'), 'month'), 'X')}"
        }
    ]
}
```

## 快捷键

`shortcuts`属性支持自定义快捷选择日期范围快捷键

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date-range",
            "name": "select",
            "label": "日期范围",
              "shortcuts": [
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

快捷键也支持使用表达式的写法，可以使用这种方式自定义快捷键

> 3.1.0 及以上版本

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date-range",
            "name": "select",
            "label": "日期范围",
              "shortcuts": [
                {
                    "label": "1天前",
                    "startDate": "${DATEMODIFY(NOW(), -1, 'day')}",
                    "endDate": "${NOW()}"
                },
                {
                    "label": "1个月前",
                    "startDate": "${DATEMODIFY(NOW(), -1, 'months')}",
                    "endDate": "${NOW()}"
                },
                {
                    "label": "本季度",
                    "startDate": "${STARTOF(NOW(), 'quarter')}",
                    "endDate": "${ENDOF(NOW(), 'quarter')}"
                }
            ]
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
            "type": "input-date-range",
            "name": "date",
            "label": "日期范围",
            "embed": true
        }
    ]
}
```

## 存成两个字段

默认日期范围存储一个字段，用 `delemiter` 分割，如果配置 `extraName` 则会存两个字段。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date-range",
            "name": "begin",
            "extraName": "end",
            "label": "日期范围"
        }
    ]
}
```

## 数据处理函数

> `3.5.0`及以上版本

默认情况下，日期范围选择器组件的绑定值的开始时间为所选时间当天的 0 点（使用`moment().startOf('day')`处理），结束时间为所选时间当天的 23 时 59 分 59 秒 999 毫秒（使用`moment().endOf('day')`处理）。如果设置了`timeFormat`（时间格式），则会基于`timeFormat`配置决定**最小时间单位**，举例：

- 不设置`timeFormat`（时间格式），默认按照天(day)级处理：

  ```typescript
  moment().startOf('day'); // 2008-08-08 00:00:00.000
  moment().endOf('day'); // 2008-08-08 23:59:59.999
  ```

- `timeFormat`（时间格式）为 `"HH:mm:ss"`，则会按照秒(second)级处理：

  ```typescript
  moment().startOf('second'); // 2008-08-08 08:08:08.000
  moment().endOf('second'); // 2008-08-08 08:08:08.999
  ```

- `timeFormat`（时间格式）为 `"HH:mm"`，则会按照分钟(minute)级处理：

  ```typescript
  moment().startOf('minute'); // 2008-08-08 08:08:00.000
  moment().endOf('minute'); // 2008-08-08 08:08:59.999
  ```

- `timeFormat`（时间格式）为 `"HH"`，则会按照小时(hour)级处理：

  ```typescript
  moment().startOf('hour'); // 2008-08-08 08:00:00.000
  moment().endOf('hour'); // 2008-08-08 08:59:59.999
  ```

部分情况下，即使配置`timeFormat`也无法满足需求，此时可以使用`transform`函数对时间值做进一步处理, 函数签名如下：

```typescript
interface TransFormFunc {
  (
    /* 当前值，Moment对象 */
    value: moment.Moment,
    config: {
      /* 操作类型，start：起始时间；end：结束时间 */
      type: 'start' | 'end';
      /* 初始值，最近一次选择的时间值 */
      originValue: moment.Moment;
      /* 时间格式 */
      timeFormat: string;
    },
    /* 当前组件的属性 */
    props: any,
    /* 当前组件数据域 */
    data: any,
    /* moment函数 */
    moment: moment
  ): moment.Moment;
}
```

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date-range",
            "name": "range1",
            "label": "日期范围（默认）",
            "valueFormat": "YYYY-MM-DDTHH:mm:ss[Z]"
        },
        {
            "type": "input-date-range",
            "name": "range2",
            "label": "日期范围（使用transform函数）",
            "valueFormat": "YYYY-MM-DDTHH:mm:ss[Z]",
            "transform": "const now = moment(); if (config.type === 'end') {value.set({hours: now.hours(), minutes: now.minutes(), seconds: now.seconds(), milliseconds: now.milliseconds()})}; return value;"
        }
    ]
}
```

上面的示例使用 `transform` 函数，将结束时间的值设置为当前时间

```typescript
function transform(value, config, props, data) {
  const now = moment();

  if (config.type === 'end') {
    value.set({
      hours: now.hours(),
      minutes: now.minutes(),
      seconds: now.seconds(),
      milliseconds: now.milliseconds()
    });
  }

  return value;
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名                   | 类型                                                                               | 默认值                                                          | 说明                                                                         | 版本                    |
| ------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------- |
| valueFormat              | `string`                                                                           | `X`                                                             | [日期选择器值格式](./date#%E5%80%BC%E6%A0%BC%E5%BC%8F)                       | 3.4.0 版本后支持        |
| displayFormat            | `string`                                                                           | `YYYY-MM-DD`                                                    | [日期选择器显示格式](./date#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F)            | 3.4.0 版本后支持        |
| placeholder              | `string`                                                                           | `"请选择日期范围"`                                              | 占位文本                                                                     |
| shortcuts                | `string \| string[] \| Array<{label: string; startDate: string; endDate: string}>` | `"yesterday,7daysago,prevweek,thismonth,prevmonth,prevquarter"` | 日期范围快捷键                                                               | `3.1.0`版本后支持表达式 |
| minDate                  | `string`                                                                           |                                                                 | 限制最小日期，用法同 [限制范围](./date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| maxDate                  | `string`                                                                           |                                                                 | 限制最大日期，用法同 [限制范围](./date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| minDuration              | `string`                                                                           |                                                                 | 限制最小跨度，如： 2days                                                     |
| maxDuration              | `string`                                                                           |                                                                 | 限制最大跨度，如：1year                                                      |
| utc                      | `boolean`                                                                          | `false`                                                         | [保存 UTC 值](./date#utc)                                                    |
| clearable                | `boolean`                                                                          | `true`                                                          | 是否可清除                                                                   |
| embed                    | `boolean`                                                                          | `false`                                                         | 是否内联模式                                                                 |
| animation                | `boolean`                                                                          | `true`                                                          | 是否启用游标动画                                                             | `2.2.0`                 |
| extraName                | `string`                                                                           |                                                                 | 是否存成两个字段                                                             | `3.3.0`                 |
| transform                | `string`                                                                           |                                                                 | 日期数据处理函数，用来处理选择日期之后的的值，返回值为 `Moment`对象          | `3.5.0`                 |
| popOverContainerSelector | `string`                                                                           |                                                                 | 弹层挂载位置选择器，会通过`querySelector`获取                                | `6.4.0`                 |

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

| 动作名称 | 动作配置                                    | 说明                                                        |
| -------- | ------------------------------------------- | ----------------------------------------------------------- |
| clear    | -                                           | 清空                                                        |
| reset    | -                                           | 将值重置为`resetValue`，若没有配置`resetValue`，则清空      |
| setValue | `value: string` 更新的时间区间值，用`,`隔开 | 更新数据，，依赖格式`format`，例如：'1650556800,1652889599' |

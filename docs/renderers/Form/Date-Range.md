### Date-Range

日期范围类型。

-   `type` 请设置成 `date-range`
-   `format` 默认 `X` 即时间戳格式，用来提交的时间格式。更多格式类型请参考 moment.
-   `inputFormat` 默认 `HH:mm` 用来配置显示的时间格式。
-   `minDate` 限制最小日期，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`
-   `maxDate` 限制最小日期，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="250" scope="form"
[
    {
      "type": "date-range",
      "name": "select",
      "label": "日期范围"
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

考虑到大家都习惯用两个字段来存储，那么就用 date 来代替吧。

```schema:height="250" scope="form"
[
  [
    {
      "type": "date",
      "name": "start",
      "label": "开始日期",
      "maxDate": "$end"
    },

    {
      "type": "date",
      "name": "end",
      "label": "结束日期",
      "minDate": "$start"
    }
  ],

  {
    "type": "static",
    "name": "select",
    "label": "当前值",
    "description": "包含开始日期和结束日期",
    "tpl": "$start - $end"
  }
]
```

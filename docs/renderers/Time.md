### Time

时间类型。

-   `type` 请设置成 `time`
-   `format` 默认 `X` 即时间戳格式，用来提交的时间格式。更多格式类型请参考 moment.
-   `inputFormat` 默认 `HH:mm` 用来配置显示的时间格式。
-   `placeholder` 默认 `请选择日期`
-   `timeConstraints` 请参考： https://github.com/YouCanBookMe/react-datetime
-   `value` 这里面 value 需要特殊说明一下，因为支持相对值。如：
    -   `-2mins` 2 分钟前
    -   `+2days` 2 天后
    -   `-10week` 十周前
-   `minTime` 限制最小时间，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`
-   `maxTime` 限制最大时间，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`

    可用单位： `min`、`hour`、`day`、`week`、`month`、`year`。所有单位支持复数形式。

-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="250" scope="form"
[
    {
      "type": "time",
      "name": "select",
      "label": "日期"
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

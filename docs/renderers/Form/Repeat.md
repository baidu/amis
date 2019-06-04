### Repeat

可用来设置重复频率

-   `type` 请设置成 `repeat`
-   `options` 默认: `hourly,daily,weekly,monthly`， 可用配置 `secondly,minutely,hourly,daily,weekdays,weekly,monthly,yearly`
-   `placeholder` 默认为 `不重复`, 当不指定值时的说明。
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="300" scope="form-item"
{
  "type": "repeat",
  "name": "repeat",
  "label": "重复频率"
}
```

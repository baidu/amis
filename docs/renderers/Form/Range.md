### Range

范围输入框。

-   `type` 请设置成 `range`
-   `min` 最小值
-   `max` 最大值
-   `step` 步长
-   `multiple` 支持选择范围，默认为`false`
-   `joinValuse` 默认为 `true`，选择的 `value` 会通过 `delimiter` 连接起来，否则直接将以`{min: 1, max: 100}`的形式提交，开启`multiple`时有效
-   `delimiter` 默认为 `,`
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="400" scope="form-item"
{
  "type": "range",
  "name": "range",
  "label": "数字范围",
  "min": 0,
  "max": 20,
  "step": 2
}
```

### Number

数字输入框。

-   `type` 请设置成 `number`
-   `min` 最小值，支持用`${xxx}`获取变量
-   `max` 最大值，支持用`${xxx}`获取变量
-   `step` 步长
-   `precision` 精度
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="200" scope="form-item"
{
  "type": "number",
  "name": "text",
  "label": "数字",
  "min": 1,
  "max": 10,
  "step": 1
}
```

### Color

颜色选择器。

-   `type` 请设置成 `color`
-   `format` 请选择 `hex`、`hls`、`rgb`或者`rgba`。默认为 `hex`。
-   `presetColors` 选择器底部的默认颜色
    - 默认为`['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']`，数组内为空则不显示默认颜色
-   `allowCustomColor` 是否允许自定义颜色，默认为`true`，为`false`时只能选择颜色，使用 `presetColors` 设定颜色选择范围
-   `clearable` 是否显示清除按钮。
-   `resetValue` 默认为 `""`, 删除后设置此配置项给定的值。

```schema:height="400" scope="form-item"
{
  "type": "color",
  "name": "color",
  "label": "颜色"
},

{
  "type": "color",
  "name": "customColor",
  "label": "自定义颜色",
  "allowCustomColor": false
}
```

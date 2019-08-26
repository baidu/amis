## Chart

图表渲染器，采用 echarts 渲染，配置格式跟 echarts 相同，[echarts配置文档](http://echarts.baidu.com/option.html#title)

| 属性名             | 类型                              | 默认值    | 说明                                                               |
|--------------------|-----------------------------------|-----------|--------------------------------------------------------------------|
| type               | `string`                          | `"chart"` | 指定为 chart 渲染器                                                |
| className          | `string`                          |           | 外层 Dom 的类名                                                    |
| body               | [Container](./Types.md#container) |           | 内容容器                                                           |
| api                | [api](./Types.md#Api)             |           | 配置项远程地址                                                     |
| initFetch          | `boolean`                         |           | 是否默认拉取                                                       |
| interval           | `number`                          |           | 刷新时间(最低 3000)                                                |
| config             | `object/string`                   |           | 设置 eschars 的配置项,当为`string`的时候可以设置 function 等配置项 |
| style              | `object`                          |           | 设置根元素的 style                                                 |
| width              | `string`                          |           | 设置根元素的宽度                                                   |
| height             | `string`                          |           | 设置根元素的高度                                                   |
| replaceChartOption | `boolean`                         | `false`   | 每次更新是完全覆盖配置项还是追加？                                 |

```schema:height="350" scope="body"
{
    "type": "chart",
    "api": "/api/mock2/chart/chart",
    "interval": 5000
}
```

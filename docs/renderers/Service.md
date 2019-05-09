## Service

功能型容器，自身不负责展示内容，主要职责在于通过配置的 api 拉取数据，数据可用于子组件。
该组件初始化时就会自动拉取一次数据，后续如果需要刷新，请结合 Action 实现，可以把 Action 的 actionType 设置为 reload, target 为该组件的 name 值。
同时该组件，还支持 api 数值自动监听，比如 `getData?type=$type` 只要当前环境 type 值发生变化，就会自动重新拉取。

| 属性名              | 类型                              | 默认值      | 说明                                                |
| ------------------- | --------------------------------- | ----------- | --------------------------------------------------- |
| type                | `string`                          | `"service"` | 指定为 service 渲染器                               |
| className           | `string`                          |             | 外层 Dom 的类名                                     |
| body                | [Container](./Types.md#container) |             | 内容容器                                            |
| api                 | [api](./Types.md#Api)             |             | 数据源 API 地址                                     |
| initFetch           | `boolean`                         |             | 是否默认拉取                                        |
| schemaApi           | [api](./Types.md#Api)             |             | 用来获取远程 Schema 的 api                          |
| initFetchSchema     | `boolean`                         |             | 是否默认拉取 Schema                                 |
| interval            | `number`                          | `3000`      | 刷新时间(最低 3000)                                 |
| silentPolling       | `boolean`                         | `false`     | 配置刷新时是否显示加载动画                          |
| stopAutoRefreshWhen | `string`                          | `""`        | 通过[表达式](./Types.md#表达式)来配置停止刷新的条件 |

```schema:height="200" scope="body"
{
    "type": "service",
    "api": "/api/mock2/page/initData",
    "body": {
        "type": "panel",
        "title": "$title",
        "body": "现在是：${date}"
    }
}
```
